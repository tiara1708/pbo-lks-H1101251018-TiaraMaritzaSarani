USE perpustakaan;

-- Hapus tabel lama jika strukturnya tidak sesuai
DROP TABLE IF EXISTS categories;

-- Buat ulang tabel categories dengan kolom 'nama'
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Masukkan kembali data awal
INSERT INTO categories (nama, deskripsi) VALUES
('Fiksi', 'Buku-buku fiksi dan novel'),
('Non-Fiksi', 'Buku non-fiksi, sains, sejarah'),
('Teknologi', 'Buku tentang teknologi dan pemrograman');