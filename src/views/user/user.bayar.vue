<template>
  <div class="payment-container">
    <h1>Payment</h1>

    <div v-if="rooms.length === 0" class="no-rooms-message">
      No rooms selected.
    </div>

    <div v-else>
      <div v-for="room in rooms" :key="room.room" class="room-summary">
        <h2>{{ room.room }}</h2>
        <p><strong>Rental Period:</strong> {{ room.period }} months</p>
        <p><strong>Additional Features:</strong> {{ room.additionalFeatures.join(', ') || 'None' }}</p>
        <p><strong>Total Price:</strong> {{ currency(room.totalPrice) }}</p>
      </div>
    </div>

    <h3>Payment Method</h3>
    <div class="payment-method">
      <label>
        <input type="radio" value="QRIS" v-model="paymentMethod" />
        QRIS
      </label>
      <label>
        <input type="radio" value="Transfer" v-model="paymentMethod" />
        Transfer
      </label>
    </div>

    <!-- Bank details shown only if Transfer is selected -->
    <div v-if="paymentMethod === 'Transfer'" class="bank-details">
      <label for="bankName">Bank Name:</label>
      <input type="text" id="bankName" v-model="bankName" placeholder="Enter bank name" />
    </div>

    <button
      :disabled="!isPaymentValid || isSubmitting"
      @click="submitPayment"
    >
      Submit Payment
    </button>
    <div v-if="isSubmitting" class="loading-message">Submitting...</div>
  </div>
</template>

<script>
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  data() {
    return {
      rooms: [], 
      paymentMethod: "", 
      bankName: "", 
      userId: "", 
      isSubmitting: false, 
    };
  },
  computed: {
    isPaymentValid() {
      return (
        this.paymentMethod &&
        (this.paymentMethod !== "Transfer" || this.bankName.trim() !== "")
      );
    },
  },
  created() {
    this.fetchUserSession();
    this.loadSelectedRooms();
  },
  methods: {
    async fetchUserSession() {
      try {
        const response = await axios.get("http://localhost:5000/api/session", {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        this.userId = response.data.username;
        console.log("User session fetched successfully:", this.userId);
      } catch (error) {
        console.error("Error fetching user session:", error);
        alert("Unable to fetch user session. Please log in again.");
        this.$router.push("/login");
      }
    },

    loadSelectedRooms() {
      const roomsQuery = this.$route.query.rooms;
      if (roomsQuery) {
        try {
          this.rooms = JSON.parse(roomsQuery);
          console.log("Rooms loaded successfully:", this.rooms);
        } catch (error) {
          console.error("Error parsing rooms data:", error);
          this.rooms = [];
        }
      }
    },

    currency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(value);
    },

    async submitPayment() {
      if (this.isSubmitting) return; 

      this.isSubmitting = true; 

      try {
        const totalBill = this.rooms.reduce((sum, room) => sum + room.totalPrice, 0);
        const rentPeriods = this.rooms.reduce((max, room) => Math.max(max, room.period), 0);

        const paymentData = {
          user: this.userId,
          total_bill: totalBill,
          payment_method: this.paymentMethod,
          rent_periods: rentPeriods,
          bank_name: this.paymentMethod === "Transfer" ? this.bankName : undefined,
          rooms: this.rooms.map(room => room.roomId),
        };

        console.log("Submitting payment with data:", paymentData);

        const response = await axios.post('http://localhost:5000/rooms/bayar', paymentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Payment submitted successfully:", response.data);

        console.log("Calling generateInvoice...");
        this.generateInvoice();

        localStorage.removeItem("selectedRooms");

        console.log("Redirecting to /user...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.$router.push("/user").catch(err => {
          console.error("Error during redirection:", err);
        });
      } catch (error) {
        console.error("Error submitting payment:", error);
        alert("Failed to submit payment. Please try again.");
      } finally {
        this.isSubmitting = false; 
      }
    },

    generateInvoice() {
      try {
        console.log("Generating invoice...");
        const doc = new jsPDF();
        doc.text("Payment Invoice", 14, 20);
        const tableData = this.rooms.map((room) => [
          room.room,
          `${room.period} months`,
          room.additionalFeatures.join(", ") || "None",
          this.currency(room.totalPrice),
        ]);
        doc.autoTable({
          head: [["Room", "Rental Period", "Additional Features", "Total Price"]],
          body: tableData,
          startY: 30,
        });
        doc.text(`Payment Method: ${this.paymentMethod}`, 14, doc.lastAutoTable.finalY + 10);
        if (this.paymentMethod === "Transfer") {
          doc.text(`Bank Name: ${this.bankName}`, 14, doc.lastAutoTable.finalY + 20);
        }
        doc.save("Invoice.pdf");
      } catch (error) {
        console.error("Error generating invoice:", error);
        alert("Failed to generate invoice.");
      }
    },
  },
};
</script>

<style scoped>
.payment-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.room-summary {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.payment-method {
  margin-top: 20px;
}

.bank-details {
  margin-top: 10px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.no-rooms-message {
  color: #ff0000;
  font-size: 1.2em;
  text-align: center;
}

label {
  font-weight: bold;
}

input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.payment-method label {
  display: inline-block;
  margin-right: 15px;
}

.loading-message {
  color: #007bff;
  font-size: 1.1em;
  text-align: center;
}
</style>
