import LaporanFasilitas from '../../models/laporan.fasilitas.model.js'; 

export async function createLaporanFasilitas (req, res) {
    try {
        const { namaFasilitas, deskripsiKerusakan, tanggalLapor, status } = req.body;

        const username = req.user.username;

        const laporan = new LaporanFasilitas({
            namaFasilitas,
            deskripsiKerusakan,
            tanggalLapor,
            status,
            username 
        });

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

export async function getLaporanFasilitas (req, res) {
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
