import mongoose from 'mongoose'; 
const { Schema } = mongoose;

const donationSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    foodType: {
        type: String,
        enum: ["cooked", "fruit_veggies", "packed"],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Quantity cannot be negative']
    },
    contactInfo: {
        type: String,
        unique: true,
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    pickupTime: {
        type: String,
        enum: ["asap", "2hours", "custom"],
        required: true,
    },
    specificTime: {
        type: String,
        required: function() {
            return this.pickupTime === 'custom';
        }
    },
    specialInstructions: {
        type: String,
        required: false
    },
})

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
