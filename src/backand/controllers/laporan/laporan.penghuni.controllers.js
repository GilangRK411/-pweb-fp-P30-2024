import LaporanPenghuni from '../../models/laporan.penghuni.model.js';

// GET: Retrieve all reports
// export const getAllLaporan = async (req, res) => {
//     try {
//         const laporan = await LaporanPenghuni.find();
//         res.status(200).json(laporan);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching reports', error });
//     }
// };


export const createLaporanPenghuni = async (req, res) => {
    const { namaPenghuni, details, adminNotes } = req.body;

    if (!namaPenghuni || !details || !details.description) {
        return res.status(400).json({ message: 'Incomplete data provided' });
    }

    try {
        const newLaporan = new LaporanPenghuni({
            namaPenghuni,
            details,
            adminNotes
        });
        await newLaporan.save();
        res.status(201).json({ message: 'Report created successfully', newLaporan });
    } catch (error) {
        res.status(500).json({ message: 'Error creating report', error });
    }
};
