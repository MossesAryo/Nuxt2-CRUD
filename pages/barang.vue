<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Daftar Barang</h1>
    <div v-if="loading">Memuat data barang...</div>
   
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    
    <div v-else-if="barang.length === 0" class="text-gray-500">
      Tidak ada data barang
    </div>
    
    <table v-else class="w-full border border-gray-300 rounded-lg">
      <thead class="bg-gray-100">
        <tr>
          <th class="border p-2">ID</th>
          <th class="border p-2">Nama Barang</th>
          <th class="border p-2">Harga</th>
          <th class="border p-2">Stok</th>
          <th class="border p-2">Kategori</th>
          <th class="border p-2">Satuan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in barang" :key="item.id_barang">
          <td class="border p-2">{{ item.id_barang }}</td>
          <td class="border p-2">{{ item.nama_barang }}</td>
          <td class="border p-2">{{ formatHarga(item.harga) }}</td>
          <td class="border p-2">{{ item.stok }}</td>
          <td class="border p-2">{{ item.kategori?.nama_kategori || '-' }}</td>
          <td class="border p-2">{{ item.satuan }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const barang = ref([])
const loading = ref(true)
const error = ref(null)


const formatHarga = (harga) => {
  const price = parseFloat(harga)
  if (isNaN(price)) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(price)
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8000/barang') 
    barang.value = res.data.data.barang
  } catch (err) {
    error.value = 'Gagal mengambil data barang: ' + err.message
  } finally {
    loading.value = false
  }
})
</script>