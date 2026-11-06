<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Repositories\BookRepository;

$repository = new BookRepository();

echo "=== 1. TEST GET ALL BOOKS ===\n";
$books = $repository->all();
print_r($books);

echo "\n=== 2. TEST FIND BOOK (ID: 1) ===\n";
$book = $repository->find(1);
print_r($book);

echo "\n=== 3. TEST CREATE BOOK ===\n";
$status = $repository->create([
    'judul'   => 'Bumi',
    'penulis' => 'Tere Liye',
    'tahun'   => 2014,
    'stok'    => 10
]);
echo $status ? "Buku berhasil ditambahkan!\n" : "Gagal menambahkan buku!\n";

echo "\n=== 4. TEST GET ALL BOOKS (SETELAH DITAMBAH) ===\n";
print_r($repository->all());