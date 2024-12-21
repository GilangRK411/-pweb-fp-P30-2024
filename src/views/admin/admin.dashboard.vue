<template>
  <div class="dashboard">
    <h1>Admin Dashboard</h1>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <h2>Room Occupancy</h2>
      <div v-if="rooms.length === 0" class="no-data">
        No data available.
      </div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Dimensions</th>
              <th>Includes</th>
              <th>Occupants</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in rooms" :key="room.roomId">
              <td>{{ room.roomName }}</td>
              <td>{{ room.dimensions }}</td>
              <td>{{ room.includes.join(', ') }}</td>
              <td>
                <ul>
                  <li v-for="occupant in room.occupants" :key="occupant.userId">
                    <strong>{{ occupant.userName }}</strong> ({{ occupant.userEmail }})<br />
                    Period: {{ occupant.period }} months<br />
                    Room Price: ${{ occupant.roomPrice }}<br />
                    Additional Features: {{ occupant.additionalFeatures.join(', ') }}<br />
                    Total Price: ${{ occupant.totalPrice }}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
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
</style>
