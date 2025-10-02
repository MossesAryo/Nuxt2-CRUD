<template>
  <div class="container">
    <div class="header-main">
      <h1>Daftar Kategori</h1>
      <button class="btn-create" @click="openCreate">+ Tambah Kategori</button>
    </div>

    <div v-if="loading" class="info">Memuat data kategori...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="kategori.length === 0" class="empty">Tidak ada data kategori</div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Kategori</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in kategori" :key="item.id_kategori" class="table-row-hover">
            <td>{{ item.id_kategori }}</td>
            <td>{{ item.nama_kategori }}</td>
            <td>{{ item.deskripsi }}</td>
            <td>
              <button class="btn-edit" @click="openEdit(item)">Edit</button>
              <button class="btn-delete" @click="openDelete(item)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :show="showForm" :title="formMode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'" @close="closeForm">
      <form @submit.prevent="saveKategori" class="form-container">
        <div class="form-group">
          <label>Nama Kategori</label>
          <input v-model="form.nama_kategori" required />
        </div>
        <div class="form-group">
          <label>Deskripsi</label>
          <textarea v-model="form.deskripsi" rows="3"></textarea>
        </div>
        <div class="actions">
          <button type="submit" class="btn-save">
            {{ formMode === 'create' ? 'Simpan' : 'Update' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Modal Delete -->
    <Modal :show="showDelete" title="Konfirmasi Hapus" @close="showDelete = false">
      <p>Apakah yakin ingin menghapus <b>{{ selected?.nama_kategori }}</b>?</p>
      <div class="actions">
        <button class="btn-delete" @click="deleteKategori">Ya, Hapus</button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Modal from '~/components/Modal.vue'

export default {
  components: { Modal },
  setup() {
    const kategori = ref([])
    const loading = ref(true)
    const error = ref(null)

    const showForm = ref(false)
    const formMode = ref('create')
    const form = ref({ id_kategori: null, nama_kategori: '', deskripsi: '' })

    const showDelete = ref(false)
    const selected = ref(null)

    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/kategori')
        kategori.value = res.data.data.kategori
      } catch (err) {
        error.value = 'Gagal mengambil data kategori: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const openCreate = () => {
      formMode.value = 'create'
      form.value = { id_kategori: null, nama_kategori: '', deskripsi: '' }
      showForm.value = true
    }

    const openEdit = (item) => {
      formMode.value = 'edit'
      form.value = { ...item }
      showForm.value = true
    }

    const saveKategori = async () => {
      if (formMode.value === 'create') {
        await axios.post('http://localhost:8000/kategori/store', form.value)
      } else {
        await axios.put(`http://localhost:8000/kategori/update/${form.value.id_kategori}`, form.value) 
      }
      closeForm()
      fetchData()
    }

    const closeForm = () => {
      showForm.value = false
    }

    const openDelete = (item) => {
      selected.value = item
      showDelete.value = true
    }

    const deleteKategori = async () => {
      await axios.delete(`http://localhost:8000/kategori/delete/${selected.value.id_kategori}`)
      showDelete.value = false
      fetchData()
    }

    onMounted(fetchData)

    return {
      kategori, loading, error,
      showForm, formMode, form, openCreate, openEdit, saveKategori, closeForm,
      showDelete, selected, openDelete, deleteKategori
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 20px;
  width: 100%;
  max-width: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

.btn-create {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-create:hover {
  background: #059669;
}

.info {
  padding: 24px;
  text-align: center;
  color: #6b7280;
}

.error {
  padding: 12px;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  border: 1px solid #fecaca;
}

.empty {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f9fafb;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #4b5563;
  font-size: 14px;
}

.table-row-hover:hover {
  background: #f9fafb;
  transition: background 0.15s;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

.form-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.actions {
  padding-top: 16px;
  text-align: right;
}

.btn-save {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover {
  background: #2563eb;
}
</style>