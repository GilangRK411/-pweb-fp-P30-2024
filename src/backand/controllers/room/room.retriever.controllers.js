import Room from '../../models/room.model.js';

export const getAllRooms = async () => {
  try {
    const rooms = await Room.find({ availability: { $gt: 0 } });
    return rooms;
  } catch (error) {
    throw new Error('Error retrieving rooms: ' + error.message);
  }
};

export default { getAllRooms };
