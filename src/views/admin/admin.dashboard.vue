<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="max-w-6xl w-full p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">Admin Dashboard</h2>

      <div v-if="loading" class="text-center text-xl text-blue-600">Loading...</div>

      <div v-else>
        <h3 class="text-xl font-semibold text-blue-600 mb-4">Room Occupancy</h3>
        
        <div v-if="rooms.length === 0" class="text-center text-gray-500">
          No data available.
        </div>

        <div v-else>
          <table class="w-full table-auto border-collapse mt-4">
            <thead>
              <tr class="bg-gray-200 text-black">
                <th class="px-4 py-2 text-left">Room Name</th>
                <th class="px-4 py-2 text-left">Dimensions</th>
                <th class="px-4 py-2 text-left">Includes</th>
                <th class="px-4 py-2 text-left">Occupants</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-black" v-for="room in rooms" :key="room.roomId">
                <td class="px-4 py-2 border-b">{{ room.roomName }}</td>
                <td class="px-4 py-2 border-b">{{ room.dimensions }}</td>
                <td class="px-4 py-2 border-b">{{ room.includes.join(', ') }}</td>
                <td class="px-4 py-2 border-b">
                  <ul>
                    <li v-for="occupant in room.occupants" :key="occupant.userId" class="mb-2">
                      <strong class="text-blue-600">{{ occupant.userName }}</strong> ({{ occupant.userEmail }})<br />
                      Period: {{ occupant.period }} months<br />
                      Room Price: {{ formatCurrency(occupant.roomPrice) }}<br />
                      Additional Features: {{ occupant.additionalFeatures.join(', ') }}<br />
                      Total Price: {{ formatCurrency(occupant.totalPrice) }}
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminDashboard",
  data() {
    return {
      loading: true,
      rooms: [],
    };
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(amount);
    },
    async fetchOccupancy() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/rooms/occupancy", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.headers['content-type'].includes('application/json')) {
          console.log("Fetched data:", response.data);

          if (response.data.success) {
            this.rooms = response.data.data;
          } else {
            this.$toast.error("Failed to fetch room occupancy data.");
          }
        } else {
          console.error("Unexpected response format", response);
          this.$toast.error("Received invalid response format.");
        }
      } catch (error) {
        console.error("Error fetching occupancy data:", error);
        this.$toast.error("Failed to fetch room occupancy data.");
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchOccupancy();
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.loading {
  font-size: 18px;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

.no-data {
  font-size: 16px;
  color: #999;
}

body {
  font-family: 'Inter', sans-serif;
}
</style>
