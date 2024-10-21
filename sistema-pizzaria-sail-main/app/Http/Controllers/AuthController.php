<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Passport\TokenRepository;

class AuthController extends Controller
{
    protected $tokenRepository;

    public function __construct(TokenRepository $tokenRepository)
    {
        $this->tokenRepository = $tokenRepository;
    }

    public function login(Request $request)
    {
        //Receber a credencial (email e senha)
        $credential = $request->only('email', 'password');

        //Verificoaas credenciais estão no Banco
        if (Auth::guard('web')->attempt(['email' => strtolower($credential['email']), 'password' => $credential['password']])) {
            //Autentica o usuário
            $user = auth()->guard('web')->user();

            //cria um token
            $user->token = $user->createToken($user->email)->accessToken;
            return [
                'status' => 200,
                'message' => "Usuário logado com sucesso",
                "usuario" => $user
            ];
        } else {
            return [
                'status' => 404,
                'message' => "Usuário ou senha incorreto"
            ];
        }
    }

    public function logout(Request $request)
    {
        $token = $request->user()->token();
        if ($token) {
            $this->tokenRepository->revokeAccessToken($token->id);
            return ['status' => true, 'message' => "Usuário deslogado com sucesso!"];
        }

        return ['status' => false, 'message' => "Token não encontrado!"];
    }
}
