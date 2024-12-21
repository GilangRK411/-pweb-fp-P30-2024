<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-8">
    <div class="w-full p-6">
      <h1 class="text-xl font-bold text-center text-blue-600 mb-4 pt-10">Rooms List</h1>

      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div v-else-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</div>
      <div v-else>
        <div class="grid grid-cols-2 gap-4">
          <!-- Room Cards -->
          <div v-for="room in rooms" :key="room._id" class="room-card p-4 bg-gray-50 rounded-lg shadow-sm w-full">
            <h3 class="text-lg font-semibold text-blue-600 mb-2">{{ room.roomName }}</h3>
            
            <p class="text-sm text-black mb-1"><strong>Dimensions:</strong> {{ room.dimensions }}</p>
            <p class="text-sm text-black mb-2"><strong>Includes:</strong> {{ room.includes.join(', ') }}</p>

            <!-- Rental Period Selection -->
            <div class="mb-2">
              <strong class="block mb-1 text-black">Rental Periods:</strong>
              <div v-for="period in room.rentalPeriods" :key="period" class="mb-2">
                <label class="flex items-center space-x-2 text-black">
                  <input 
                    type="radio" 
                    :value="period" 
                    :checked="selectedRentalPeriod[room._id] === period"
                    @click="toggleRentalPeriod(room._id, period)"
                    class="form-radio text-blue-600"
                  />
                  <span>{{ period }} - 
                    <span class="font-semibold text-black">{{ currency(calculateRoomPrice(period)) }}</span>
                  </span>
                </label>
              </div>
            </div>

            <!-- Additional Features Selection -->
            <div class="mb-2" v-if="selectedRentalPeriod[room._id]">
              <strong class="block mb-1 text-black">Additional Features:</strong>
              <div v-for="feature in room.additionalFeatures" :key="feature" class="mb-2">
                <label class="flex items-center space-x-2 text-black">
                  <input 
                    type="checkbox" 
                    :value="feature" 
                    v-model="selectedAdditionalFeatures[room._id]" 
                    @change="saveToLocalStorage(room)"
                    class="form-checkbox text-blue-600"
                  />
                  <span>{{ feature }} - 
                    <span class="font-semibold text-black">{{ currency(calculateAdditionalFeaturePrice(feature, room)) }}</span>
                  </span>
                </label>
              </div>
            </div>

            <!-- Total Price Display -->
            <div class="mb-4 text-center" v-if="selectedRentalPeriod[room._id]">
              <p class="text-lg font-semibold text-black">
                Total Price: <span class="text-blue-600">{{ currency(calculateTotalPrice(room)) }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Go to Payment Button -->
        <div class="text-center mt-6">
          <button
            @click="navigateToPayment"
            :disabled="isPaymentDisabled"
            class="w-full p-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Go to Payment
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
    this.resetSelections();
    this.fetchRooms();
  },
  computed: {
    isPaymentDisabled() {
      return Object.keys(this.selectedRentalPeriod).length === 0;
    }
  },
  methods: {
    resetSelections() {
      const storedRooms = JSON.parse(localStorage.getItem('selectedRooms')) || [];
      if (storedRooms.length === 0) {
        this.selectedRentalPeriod = {};
        this.selectedAdditionalFeatures = {};
      }
    },

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

    calculateTotalPrice(room) {
      const rentalPeriod = this.selectedRentalPeriod[room._id] || '0';
      const roomPrice = this.calculateRoomPrice(rentalPeriod);

      const additionalFeatures = this.selectedAdditionalFeatures[room._id] || [];
      const additionalFeaturesPrice = additionalFeatures.reduce((total, feature) => {
        return total + this.calculateAdditionalFeaturePrice(feature, room);
      }, 0);

      return roomPrice + additionalFeaturesPrice;
    },

    toggleRentalPeriod(roomId, period) {
      // Reset all other room selections
      for (const id in this.selectedRentalPeriod) {
        if (id !== roomId) {
          delete this.selectedRentalPeriod[id];
          delete this.selectedAdditionalFeatures[id];
        }
      }

      if (this.selectedRentalPeriod[roomId] === period) {
        delete this.selectedRentalPeriod[roomId];
        delete this.selectedAdditionalFeatures[roomId];
      } else {
        this.selectedRentalPeriod[roomId] = period;
        this.saveToLocalStorage(this.rooms.find(room => room._id === roomId));
      }
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

      localStorage.setItem('selectedRooms', JSON.stringify([roomData]));
    },


    navigateToPayment() {
      const selectedRooms = JSON.parse(localStorage.getItem('selectedRooms')) || [];

      if (selectedRooms.length === 0) {
        this.errorMessage = 'No rooms selected!';
        return;
      }

      this.$router.push({ 
        path: '/user/bayar', 
        query: { rooms: JSON.stringify(selectedRooms) } 
      });
    }
  }
};
</script>

<style scoped>
</style>
