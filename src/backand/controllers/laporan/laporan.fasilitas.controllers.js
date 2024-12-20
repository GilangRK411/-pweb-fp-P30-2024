import LaporanFasilitas from '../../models/laporan.fasilitas.mode.js'; 

export async function createLaporan(req, res) {
    try {
        const { namaFasilitas, deskripsiKerusakan, tanggalLapor, status } = req.body;

        // Create a new LaporanFasilitas document
        const laporan = new LaporanFasilitas({
            namaFasilitas,
            deskripsiKerusakan,
            tanggalLapor,
            status
        });

        // Save the laporan document to the database
        await laporan.save();

        res.status(201).json({
            message: "Laporan kerusakan fasilitas berhasil dibuat.",
            laporan
        });
    } catch (err) {
        res.status(500).json({
            message: "Terjadi kesalahan saat membuat laporan.",
            error: err.message
        });
    }
}

export async function getLaporan(req, res) {
    try {
        // Use the find method on the LaporanFasilitas model
        const laporans = await LaporanFasilitas.find();

        res.status(200).json(laporans);
    } catch (err) {
        res.status(500).json({
            message: "Terjadi kesalahan saat mengambil laporan.",
            error: err.message
        });
    }
}
