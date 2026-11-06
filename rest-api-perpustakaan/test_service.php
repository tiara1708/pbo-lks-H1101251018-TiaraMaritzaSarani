<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Repositories\BookRepository;
use App\Services\BookService;

$repository = new BookRepository();
$service = new BookService($repository);

try {
    echo "=== 1. UJI GET ALL BOOKS ===\n";
    $books = $service->getAllBooks();
    echo "Total buku: " . count($books) . "\n";
    foreach ($books as $b) {
        echo "- " . $b['judul'] . " (" . $b['penulis'] . ")\n";
    }

    echo "\n=== 2. UJI VALIDASI INPUT (TANPA JUDUL) ===\n";
    try {
        $service->createBook([
            'judul'   => '',
            'penulis' => 'Tes Penulis',
            'tahun'   => 2024,
            'stok'    => 5
        ]);
    } catch (Exception $e) {
        echo "Pesan Error Validasi: " . $e->getMessage() . "\n";
    }

} catch (Exception $e) {
    echo "Error Umum: " . $e->getMessage() . "\n";
}