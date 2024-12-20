import mongoose from '../database/database.js';

const { Schema, model } = mongoose;

const laporanPenghuniSchema = new Schema({
    namaPenghuni: {
        type: String,
        required: true
    },
    details: {
        description: { type: String, required: true },
        date: { type: Date, default: Date.now },
        evidence: [{ type: String }] 
    },
    adminNotes: {
        type: String,
        default: ''
    },
    tanggalLapor: {
        type: Date,
        default: Date.now
    }
});

const LaporanPenghuni = model('LaporanPenghuni', laporanPenghuniSchema);

export default LaporanPenghuni;
