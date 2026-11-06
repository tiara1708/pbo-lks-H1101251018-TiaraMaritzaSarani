<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Database\Connection;

try {
    $db = Connection::getConnection();
    echo "Koneksi database berhasil tersambung!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}