import { categoriesApi } from '../api.js';
import { showToast, confirmAction, escapeHtml } from '../utils.js';

export async function renderCategoriesPage(container) {
    container.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 page-enter">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Manajemen Kategori</h2>
                <p class="text-gray-500">Kelola kategori buku perpustakaan</p>
            </div>
            <button id="btn-add" class="bg-primary hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow">
                <span class="text-xl leading-none">+</span> Tambah Kategori
            </button>
        </div>
        <div id="table-container" class="bg-white rounded-xl shadow overflow-hidden">
            <div class="p-8 text-center text-gray-500">Memuat data...</div>
        </div>
    `;

    document.getElementById('btn-add').onclick = () => openModal();
    await loadCategories();

    async function loadCategories() {
        const tableContainer = document.getElementById('table-container');
        try {
            const { data: categories } = await categoriesApi.list();
            if (categories.length === 0) {
                tableContainer.innerHTML = `
                    <div class="p-12 text-center">
                        <div class="text-5xl mb-4">🏷️</div>
                        <p class="text-gray-500 mb-4">Belum ada kategori</p>
                        <button id="btn-add-cat-empty" class="text-primary hover:underline font-medium">
                            Tambah kategori pertama &rarr;
                        </button>
                    </div>
                `;
                document.getElementById('btn-add-cat-empty').onclick = () => openModal();
                return;
            }

            tableContainer.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deskripsi</th>
                                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${categories.map(c => `
                                <tr class="hover:bg-gray-50 transition">
                                    <td class="px-6 py-4 text-sm text-gray-500">#${c.id}</td>
                                    <td class="px-6 py-4 font-medium text-gray-800">${escapeHtml(c.nama)}</td>
                                    <td class="px-6 py-4 text-sm text-gray-600">
                                        ${escapeHtml(c.deskripsi) || '<em class="text-gray-400">(tanpa deskripsi)</em>'}
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-3">
                                        <button data-edit="${c.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                                        <button data-delete="${c.id}" class="text-red-600 hover:text-red-800 text-sm font-medium">Hapus</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;

            tableContainer.querySelectorAll('[data-edit]').forEach(btn => {
                btn.onclick = () => {
                    const cat = categories.find(c => c.id === parseInt(btn.dataset.edit));
                    openModal(cat);
                };
            });

            tableContainer.querySelectorAll('[data-delete]').forEach(btn => {
                btn.onclick = () => deleteCategory(parseInt(btn.dataset.delete));
            });
        } catch (error) {
            tableContainer.innerHTML = `
                <div class="p-8 text-center">
                    <div class="text-5xl mb-4">⚠️</div>
                    <p class="text-red-600 font-medium">Gagal memuat data</p>
                    <p class="text-sm text-gray-500 mt-1">${escapeHtml(error.message)}</p>
                </div>
            `;
        }
    }

    function openModal(category = null) {
        const isEdit = !!category;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div class="px-6 py-4 border-b flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">${isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
                    <button data-close class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                <form id="category-form" class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                        <input name="nama" required maxlength="100" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                        <textarea name="deskripsi" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"></textarea>
                    </div>
                    <div class="flex gap-3 pt-2">
                        <button type="button" data-close class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Batal</button>
                        <button type="submit" class="flex-1 px-4 py-2 bg-primary hover:bg-blue-800 text-white rounded-lg font-medium">${isEdit ? 'Simpan' : 'Tambah'}</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add('modal-open');

        const form = modal.querySelector('#category-form');
        if (category) {
            form.querySelector('[name="nama"]').value = category.nama;
            form.querySelector('[name="deskripsi"]').value = category.deskripsi || '';
        }

        const close = () => {
            modal.remove();
            document.body.classList.remove('modal-open');
        };

        modal.querySelectorAll('[data-close]').forEach(el => el.onclick = close);
        modal.onclick = (e) => { if (e.target === modal) close(); };

        form.onsubmit = async (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            const payload = {
                nama: fd.get('nama').trim(),
                deskripsi: fd.get('deskripsi').trim(),
            };

            try {
                if (isEdit) {
                    await categoriesApi.update(category.id, payload);
                    showToast('Kategori berhasil diperbarui', 'success');
                } else {
                    await categoriesApi.create(payload);
                    showToast('Kategori berhasil ditambahkan', 'success');
                }
                close();
                await loadCategories();
            } catch (error) {
                showToast(error.message, 'error');
            }
        };
    }

    async function deleteCategory(id) {
        if (!confirmAction('Yakin ingin menghapus kategori ini?')) return;
        try {
            await categoriesApi.destroy(id);
            showToast('Kategori berhasil dihapus', 'success');
            await loadCategories();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
}