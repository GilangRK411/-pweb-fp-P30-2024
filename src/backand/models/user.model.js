import mongoose from '../database/database.js';
import bcrypt from 'bcryptjs';  

const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt);  
        next();
    } catch (err) {
        return next(err);  
    }
});

userSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;  
    } catch (err) {
        throw new Error('Error comparing passwords'); 
    }
};

export default model('User', userSchema);
