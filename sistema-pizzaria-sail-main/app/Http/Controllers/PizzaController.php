<?php

namespace App\Http\Controllers;

use App\Http\Enums\TamanhoEnum;
use App\Http\Requests\PizzaRequest;
use App\Models\Pizza;
use Illuminate\Http\Request;

/**
 * Class PizzaController
 *
 * @package App\Http\Controllers
 */
class PizzaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $pizzas = Pizza::select('name', 'description', 'size', 'format', 'price')->paginate(10);
            return response()->json([
                'status' => 200,
                'mensagem' => 'Pizzas encontradas com sucesso!',
                'pizzas' => $pizzas
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'mensagem' => 'Erro ao listar pizzas!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PizzaRequest $request)
    {
        try {
            $validatedData = $request->validated();
            $pizza = Pizza::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'size' => TamanhoEnum::from($validatedData['size']),
                'format' => $validatedData['format'],
                'price' => $validatedData['price'],
            ]);

            return response()->json([
                'status' => 200,
                'mensagem' => 'Pizza cadastrada com sucesso!',
                'pizza' => $pizza
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'mensagem' => 'Erro ao cadastrar pizza!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $pizza = Pizza::find($id);

            if (!$pizza) {
                return response()->json([
                    'status' => 404,
                    'mensagem' => 'Pizza não encontrada!',
                ], 404);
            }

            return response()->json([
                'status' => 200,
                'mensagem' => 'Pizza encontrada com sucesso!',
                'pizza' => $pizza
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'mensagem' => 'Erro ao buscar pizza!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PizzaRequest $request, string $id)
    {
        try {
            $pizza = Pizza::find($id);

            if (!$pizza) {
                return response()->json([
                    'status' => 404,
                    'mensagem' => 'Pizza não encontrada!',
                ], 404);
            }

            $validatedData = $request->validated();
            $pizza->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'size' => TamanhoEnum::from($validatedData['size']),
                'format' => $validatedData['format'],
                'price' => $validatedData['price'],
            ]);

            return response()->json([
                'status' => 200,
                'mensagem' => 'Pizza atualizada com sucesso!',
                'pizza' => $pizza
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'mensagem' => 'Erro ao atualizar pizza!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $pizza = Pizza::find($id);

            if (!$pizza) {
                return response()->json([
                    'status' => 404,
                    'mensagem' => 'Pizza não encontrada!',
                ], 404);
            }

            $pizza->delete();

            return response()->json([
                'status' => 200,
                'mensagem' => 'Pizza deletada com sucesso!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'mensagem' => 'Erro ao deletar pizza!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
