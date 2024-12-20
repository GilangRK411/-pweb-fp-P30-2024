import mongoose from '../../database/database.js';
import Payment from '../../models/room.pembayaran.model.js';

export const getUserBillHistory = async (req, res) => {
  try {
      const { userId, startDate, endDate } = req.query;

      if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
      }

      if (!mongoose.isValidObjectId(userId)) {
          return res.status(400).json({ message: 'Invalid User ID format' });
      }

      const filter = { 
        user_id: new mongoose.Types.ObjectId(userId),
      };

      if (startDate || endDate) {
          filter.created_at = {};
          if (startDate) {
              filter.created_at.$gte = new Date(startDate);
          }
          if (endDate) {
              filter.created_at.$lte = new Date(endDate);
          }
      }

      const payments = await Payment.find(filter).sort({ created_at: -1 });

      if (!payments || payments.length === 0) {
          return res.status(404).json({ message: 'No payment history found' });
      }

      res.status(200).json(payments);
  } catch (error) {
      console.error('Error fetching payment history:', error);
      res.status(500).json({ 
          message: 'Error fetching payment history', 
          error: error.message || error 
      });
  }
};
