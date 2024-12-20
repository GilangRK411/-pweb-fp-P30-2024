import mongoose from '../database/database.js'; 

const PaymentMethod = {
  QRIS: 'QRIS',
  TRANSFER: 'Transfer',
};

const PaymentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  total_bill: {
    type: Number,
    required: true,
    min: [0, 'Total bill must be greater than or equal to 0'],
  },
  payment_method: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: true,
  },
  rent_periods: {
    type: Number,
    required: true,
    min: [1, 'Rent periods must be at least 1'],
  },
  bank_name: {
    type: String,
    validate: {
      validator: function () {
        console.log("Payment method:", this.payment_method);
        console.log("Bank name:", this.bank_name);
        return this.payment_method === PaymentMethod.TRANSFER ? !!this.bank_name : true;
      },
      message: 'Bank name is required for transfer payments.',
    },
  },  
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
