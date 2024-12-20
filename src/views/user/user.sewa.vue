<template>
  <div class="room-container">
    <h1>Rooms List</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else>
      <div v-for="room in rooms" :key="room._id" class="room-card">
        <h3>{{ room.roomName }}</h3>
        <p><strong>Dimensions:</strong> {{ room.dimensions }}</p>
        <p><strong>Includes:</strong> {{ room.includes.join(', ') }}</p>

        <div>
          <strong>Rental Periods:</strong>
          <div v-for="period in room.rentalPeriods" :key="period">
            <label>
              <input 
                type="radio" 
                :value="period" 
                v-model="selectedRentalPeriod[room._id]" 
                @change="saveToLocalStorage(room)"
              />
              {{ period }} - 
              <span>{{ currency(calculateRoomPrice(period)) }}</span>
            </label>
          </div>
        </div>

        <div>
          <strong>Additional Features:</strong>
          <div v-for="feature in room.additionalFeatures" :key="feature">
            <label>
              <input 
                type="checkbox" 
                :value="feature" 
                v-model="selectedAdditionalFeatures[room._id]" 
                @change="saveToLocalStorage(room)"
              />
              {{ feature }} - 
              <span>{{ currency(calculateAdditionalFeaturePrice(feature, room)) }}</span>
            </label>
          </div>
        </div>

        <div class="navigation">
          <button @click="navigateToPayment">Go to Payment</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '../../assets/user.room.css';

export default {
  data() {
    return {
      rooms: [],       
      loading: true,     
      errorMessage: '', 
      selectedRentalPeriod: {},  
      selectedAdditionalFeatures: {}  
    };
  },
  created() {
    this.fetchRooms();
  },
  methods: {
    async fetchRooms() {
      try {
        const response = await axios.get('http://localhost:5000/rooms/sewa');
        this.rooms = response.data.rooms;
      } catch (error) {
        this.errorMessage = 'There was an error retrieving the rooms data.';
      } finally {
        this.loading = false;
      }
    },

    currency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(value);
    },

    calculateRoomPrice(period) {
      const prices = {
        '3': 6000000,
        '6': 12000000
      };
      return prices[period] || 0;
    },

    calculateAdditionalFeaturePrice(feature, room) {
      const additionalPrices = {
        Laundry: {
          '3': 600000, 
          '6': 1200000 
        },
        "Cleaning Service": {
          '3': 300000,
          '6': 600000 
        },
        Catering: {
          '3': 3000000,
          '6': 6000000 
        }
      };

      const selectedPeriod = this.selectedRentalPeriod[room._id];
      let totalPrice = 0;

      if (feature in additionalPrices && selectedPeriod) {
        totalPrice = additionalPrices[feature][selectedPeriod] || 0;
      }

      return totalPrice;
    },

    saveToLocalStorage(room) {
      if (!Array.isArray(this.selectedAdditionalFeatures[room._id])) {
        this.selectedAdditionalFeatures[room._id] = [];
      }

      const rentalPeriod = this.selectedRentalPeriod[room._id];
      const additionalFeatures = this.selectedAdditionalFeatures[room._id] || [];

      const roomPrice = this.calculateRoomPrice(rentalPeriod);
      
      const additionalFeaturesPrice = additionalFeatures.reduce((total, feature) => {
        return total + this.calculateAdditionalFeaturePrice(feature, room);
      }, 0);

      const additionalFeaturesBreakdown = additionalFeatures.map((feature) => ({
        feature: feature,
        price: this.calculateAdditionalFeaturePrice(feature, room)
      }));

      const totalPrice = roomPrice + additionalFeaturesPrice;

      const roomData = {
        roomId: room._id,
        roomName: room.roomName,
        period: rentalPeriod,
        roomPrice: roomPrice,
        additionalFeatures: additionalFeatures,
        additionalFeaturesBreakdown: additionalFeaturesBreakdown,
        totalPrice: totalPrice
      };

      localStorage.setItem(room.roomName, JSON.stringify(roomData)); 
    },

    navigateToPayment() {
      const selectedRooms = [];

      Object.keys(localStorage).forEach((key) => {
        try {
          const roomData = JSON.parse(localStorage.getItem(key));
          if (roomData && roomData.roomId) {
            selectedRooms.push(roomData);
          }
        } catch (error) {
          console.error(`Failed to parse localStorage item for key ${key}:`, error);
        }
      });

      this.$router.push({ 
        path: '/user/bayar', 
        query: { rooms: JSON.stringify(selectedRooms) } 
      });
    }
  }
};
</script>
