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
import { ref, onMounted, getCurrentInstance } from 'vue'
import Modal from '~/components/Modal.vue'

export default {
  components: { Modal },
  setup() {
    const { proxy } = getCurrentInstance()

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
        const res = await proxy.$api.get('/kategori')
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
        await proxy.$api.post('/kategori/store', form.value)
      } else {
        await proxy.$api.put(`/kategori/update/${form.value.id_kategori}`, form.value)
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
      await proxy.$api.delete(`/kategori/delete/${selected.value.id_kategori}`)
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


<style scoped src="~/assets/css/kategori.css">

</style>