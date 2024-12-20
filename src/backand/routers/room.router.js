import express from 'express';
import { getAllRooms } from '../controllers/room/room.retriever.controllers.js';
import { createPayment } from '../controllers/room/room.pembayaran.controllers.js';
import { getUserBillHistory } from '../controllers/user/user.billshow.controllers.js';
import { authenticate } from '../middleware/user.authenticate.js';

const router = express.Router();

router.get('/sewa', async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.status(200).json({
      message: 'Rooms retrieved successfully',
      rooms: rooms
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving rooms',
      error: error.message
    });
  }
});

router.get('/bill-history', authenticate, getUserBillHistory);

router.post('/bayar', authenticate, createPayment);

export default router;