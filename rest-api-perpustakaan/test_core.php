<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Core\Container;
use App\Core\Request;
use App\Contracts\BookInterface;
use App\Repositories\BookRepository;
use App\Services\BookService;

$container = new Container();

// Daftarkan binding Interface ke Repository konkrit
$container->set(BookInterface::class, BookRepository::class);

$service = $container->get(BookService::class);

echo "=== UJI CONTAINER & CORE FRAMEWORK ===\n";
if ($service instanceof BookService) {
    echo "[✓] Container berhasil me-resolve BookService secara otomatis!\n";
}

$request = new Request();
echo "[✓] HTTP Method terdeteksi: " . $request->getMethod() . "\n";