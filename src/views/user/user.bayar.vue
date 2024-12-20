<template>
  <div class="payment-container">
    <h1>Payment</h1>

    <div v-if="rooms.length === 0" class="no-rooms-message">
      No rooms selected.
    </div>

    <div v-else>
      <div v-for="room in rooms" :key="room.roomId" class="room-summary">
        <h2>{{ room.roomName }}</h2>
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
      } catch (error) {
        alert("Unable to fetch user session. Please log in again.");
        this.$router.push("/login");
      }
    },

    loadSelectedRooms() {
      const roomsQuery = this.$route.query.rooms;
      if (roomsQuery) {
        try {
          this.rooms = JSON.parse(roomsQuery).map((room) => {
            const storedRoom = JSON.parse(localStorage.getItem(room.roomName));
            return {
              ...room,
              ...storedRoom, 
            };
          });
        } catch {
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

        await axios.post("http://localhost:5000/rooms/bayar", paymentData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        await this.createInvoiceHistory(totalBill);

        this.generateInvoice();
        this.rooms.forEach((room) => {
          localStorage.removeItem(room.roomName);
        });

        this.$router.push("/user");
      } catch {
        alert("Failed to submit payment. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
    },

    async createInvoiceHistory(totalBill) {
      try {
        const invoiceData = {
          userId: this.userId,
          rooms: this.rooms.map(room => room.roomId),
          period: this.rooms[0].period,
          roomPrice: this.rooms[0].roomPrice,
          additionalFeatures: this.rooms.flatMap(room => room.additionalFeatures),
          additionalFeaturesBreakdown: this.rooms.flatMap(room => room.additionalFeaturesBreakdown),
          totalPrice: parseFloat(totalBill),  
        };

        await axios.post("http://localhost:5000/rooms/invoices", invoiceData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (error) {
        console.error("Error saving invoice history:", error);
        alert("Failed to save invoice history. Please try again.");
      }
    },

    generateInvoice() {
      const doc = new jsPDF();
      doc.text("Payment Invoice", 14, 20);
      const tableData = this.rooms.map((room) => [
        room.roomName,
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
