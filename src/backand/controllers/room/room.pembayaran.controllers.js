import mongoose from '../../database/database.js'; 
import Payment from '../../models/room.pembayaran.model.js';
import Room from '../../models/room.model.js';

export const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { total_bill, payment_method, rent_periods, bank_name, rooms } = req.body;

    const payment = new Payment({
      user_id: new mongoose.Types.ObjectId(userId),
      total_bill,
      payment_method,
      rent_periods,
      bank_name: payment_method.toLowerCase() === 'transfer' ? bank_name : undefined,
    });

    await payment.save();
    for (let roomId of rooms) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({
          message: `Room with ID ${roomId} not found`,
        });
      }

      room.availability = 0;
      await room.save();
    }

    res.status(200).json({
      message: 'Payment processed successfully and room availability updated',
      payment: {
        user_id: payment.user_id,
        total_bill: payment.total_bill,
        payment_method: payment.payment_method,
        rent_periods: payment.rent_periods,
        bank_name: payment.bank_name,
      },
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      message: 'Error creating payment',
      error: error.message,
    });
  }
};

