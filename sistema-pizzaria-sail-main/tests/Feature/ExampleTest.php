<?php
// tests/Feature/ExampleTest.php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Testa se a aplicação retorna uma resposta bem-sucedida para a rota /api/user.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        // Autenticar um usuário para obter um token
        $user = \App\Models\User::factory()->create();
        $token = $user->createToken('TestToken')->accessToken;

        // Fazer a requisição autenticada para a rota /api/user
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->get('/api/user');

        // Verificar se a resposta é 200
        $response->assertStatus(200);
    }
}