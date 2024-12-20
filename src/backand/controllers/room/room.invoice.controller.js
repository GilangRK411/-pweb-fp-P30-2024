import InvoiceHistory from "../../models/room.invoice.model.js";
import mongoose from "../../database/database.js";

export async function createInvoice(req, res) {
  const userId = req.user.id;
  const {
    rooms,
    period,
    roomPrice,
    additionalFeatures,
    additionalFeaturesBreakdown,
    totalPrice,
  } = req.body;

  if (!userId || !rooms || !period || !roomPrice || !totalPrice) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const newInvoice = new InvoiceHistory({
      user_id: new mongoose.Types.ObjectId(userId),
      rooms,
      period,
      roomPrice,
      additionalFeatures,
      additionalFeaturesBreakdown,
      totalPrice,
    });

    await newInvoice.save();

    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Server error while saving invoice." });
  }
}


// export async function getUserInvoices(req, res) {
//   const { userId } = req.params;

//   try {
//     const invoices = await find({ userId }).sort({ created_at: -1 });
//     res.status(200).json({ invoices });
//   } catch (error) {
//     console.error("Error fetching invoices:", error);
//     res.status(500).json({ message: "Server error while fetching invoices." });
//   }
// }
