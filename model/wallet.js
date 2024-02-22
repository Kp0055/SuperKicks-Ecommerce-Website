const mongoose = require('mongoose');


const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mus',  
    },
    transactions: [{
        type: {
            type: String,
            enum: ['deposit', 'withdrawal','refund','purchase'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        amount: {
            type: Number,
            required: true
        },
       
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
