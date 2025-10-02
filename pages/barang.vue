<template>
  <div class="container">
    <div class="header">
      <h1>Daftar Barang</h1>
      <button class="btn-create" @click="openCreate">+ Tambah Barang</button>
    </div>

    <div v-if="loading" class="info">Memuat data barang...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="barang.length === 0" class="empty">Tidak ada data barang</div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Barang</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Kategori</th>
            <th>Satuan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in barang" :key="item.id_barang" class="table-row-hover">
            <td>{{ item.id_barang }}</td>
            <td>{{ item.nama_barang }}</td>
            <td>{{ formatHarga(item.harga) }}</td>
            <td>{{ item.stok }}</td>
            <td>{{ item.kategori?.nama_kategori || '-' }}</td>
            <td>{{ item.satuan }}</td>
            <td>
              <button class="btn-edit" @click="openEdit(item)">Edit</button>
              <button class="btn-delete" @click="openDelete(item)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- create/edit -->
    <Modal :show="showForm" :title="formMode === 'create' ? 'Tambah Barang' : 'Edit Barang'" @close="closeForm">
      <form @submit.prevent="saveBarang" class="form-container">
        <div class="form-group">
          <label>Nama Barang</label>
          <input v-model="form.nama_barang" required />
        </div>
        <div class="form-group">
          <label for="id_kategori">Kategori</label>
          <select 
            id="id_kategori" 
            v-model.number="form.id_kategori" 
            required
          >
            <option :value="null" disabled>Pilih Kategori</option>
            <option v-for="kat in kategori" :key="kat.id_kategori" :value="kat.id_kategori">
              {{ kat.nama_kategori }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Harga</label>
          <input v-model="form.harga" type="number" required />
        </div>
        <div class="form-group">
          <label>Stok</label>
          <input v-model="form.stok" type="number" required />
        </div>
        <div class="form-group">
          <label>Satuan</label>
          <input v-model="form.satuan" required />
        </div>
        <div class="actions">
          <button type="submit" class="btn-save">
            {{ formMode === 'create' ? 'Simpan' : 'Update' }}
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete -->
    <Modal :show="showDelete" title="Konfirmasi Hapus" @close="showDelete = false">
      <p>Apakah yakin ingin menghapus <b>{{ selected?.nama_barang }}</b>?</p>
      <div class="actions">
        <button class="btn-delete" @click="deleteBarang">Ya, Hapus</button>
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
    const barang = ref([])
    const kategori = ref([])
    const loading = ref(true)
    const error = ref(null)

    const showForm = ref(false)
    const formMode = ref('create')
    const form = ref({ 
      id_barang: null, 
      nama_barang: '', 
      id_kategori: null, 
      harga: '', 
      stok: '', 
      satuan: '' 
    })

    const showDelete = ref(false)
    const selected = ref(null)

    const formatHarga = (harga) => {
      const price = parseFloat(harga)
      if (isNaN(price)) return 'Rp 0'
      return 'Rp ' + new Intl.NumberFormat('id-ID').format(price)
    }

    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8000/barang')
        barang.value = res.data.data.barang
      } catch (err) {
        error.value = 'Gagal mengambil data barang: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const fetchKategori = async () => {
      try {
        const res = await axios.get('http://localhost:8000/kategori')
        kategori.value = res.data.data.kategori
      } catch (err) {
        console.error('Gagal mengambil data kategori: ' + err.message)
      } 
    }

    const openCreate = () => {
      formMode.value = 'create'
      form.value = { 
        id_barang: null, 
        nama_barang: '', 
        id_kategori: null, 
        harga: '', 
        stok: '', 
        satuan: '' 
      }
      showForm.value = true
    }

    const openEdit = (item) => {
      formMode.value = 'edit'
      form.value = {
        id_barang: item.id_barang,
        nama_barang: item.nama_barang,
        id_kategori: item.id_kategori || item.kategori?.id_kategori || null,
        harga: item.harga,
        stok: item.stok,
        satuan: item.satuan
      }
      showForm.value = true
    }

    const saveBarang = async () => {
      try {
        if (formMode.value === 'create') {
          await axios.post('http://localhost:8000/barang/store', form.value)
        } else {
          await axios.put(`http://localhost:8000/barang/update/${form.value.id_barang}`, form.value)
        }
        closeForm()
        fetchData()
      } catch (err) {
        console.error('Error saving:', err)
        alert('Gagal menyimpan data')
      }
    }

    const closeForm = () => {
      showForm.value = false
    }

    const openDelete = (item) => {
      selected.value = item
      showDelete.value = true
    }

    const deleteBarang = async () => {
      try {
        await axios.delete(`http://localhost:8000/barang/delete/${selected.value.id_barang}`)
        showDelete.value = false
        fetchData()
      } catch (err) {
        console.error('Error deleting:', err)
        alert('Gagal menghapus data')
      }
    }

    onMounted(() => {
      fetchData()
      fetchKategori()
    })

    return {
      barang, loading, error,
      kategori,
      formatHarga,
      showForm, formMode, form, openCreate, openEdit, saveBarang, closeForm,
      showDelete, selected, openDelete, deleteBarang
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 100px auto 40px auto;
  padding: 32px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
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

.info, .empty {
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

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
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