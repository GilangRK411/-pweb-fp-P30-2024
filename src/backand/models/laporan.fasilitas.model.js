import mongoose from '../database/database.js';

const { Schema, model } = mongoose;

const laporanFasilitasSchema = new Schema({
    namaFasilitas: {
        type: String,
        required: true
    },
    deskripsiKerusakan: {
        type: String,
        required: true
    },
    tanggalLapor: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Diperbaiki', 'Sedang Diperbaiki', 'Belum Diperbaiki'],
        default: 'Belum Diperbaiki'
    },
    username: { 
        type: String,
        required: true
    }
});

// Create the model from the schema
const LaporanFasilitas = model('LaporanFasilitas', laporanFasilitasSchema);

export default LaporanFasilitas;

