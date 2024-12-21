<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">Fasilitas Kost</h1>

      <!-- Fasilitas List -->
      <div class="space-y-6">
        <div class="facility-item bg-gray-100 p-6 rounded-lg shadow-lg text-black">
          <h3 class="text-2xl font-semibold mb-4">WiFi</h3>
          <p>Internet gratis dengan kecepatan tinggi</p>
        </div>

        <div class="facility-item bg-gray-100 p-6 rounded-lg shadow-lg text-black">
          <h3 class="text-2xl font-semibold mb-4">Laundry</h3>
          <p>Layanan laundry tersedia</p>
        </div>

        <div class="facility-item bg-gray-100 p-6 rounded-lg shadow-lg text-black">
          <h3 class="text-2xl font-semibold mb-4">Parkir</h3>
          <p>Area parkir luas dan aman</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.facility-item {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.facility-item h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.facility-item p {
  font-size: 16px;
  color: #555;
}
</style>
