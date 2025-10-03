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

<style scoped src="~/assets/css/barang.css"></style>