import InvoiceHistory from '../../models/room.invoice.model.js';
import Room from '../../models/room.model.js'; 
import User from '../../models/user.model.js'

export const showOccupancy = async (req, res) => {
    try {
      const invoices = await InvoiceHistory.find().populate('rooms user_id', 'roomName dimensions includes unique_id username email');
  
      const occupancy = {};
  
      invoices.forEach((invoice) => {
        invoice.rooms.forEach((room) => {
          if (!occupancy[room._id]) {
            occupancy[room._id] = {
              roomId: room._id,
              roomName: room.roomName,
              dimensions: room.dimensions,
              includes: room.includes,
              occupants: [],
            };
          }
  
          occupancy[room._id].occupants.push({
            userId: invoice.user_id._id,
            userUniqueId: invoice.user_id.unique_id,
            userName: invoice.user_id.username,
            userEmail: invoice.user_id.email,
            period: invoice.period,
            roomPrice: invoice.roomPrice,
            additionalFeatures: invoice.additionalFeatures,
            totalPrice: invoice.totalPrice,
          });
        });
      });
  
      const occupancyArray = Object.values(occupancy);
  
      return res.status(200).json({ success: true, data: occupancyArray });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };