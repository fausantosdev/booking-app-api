import mongoose from 'mongoose'

const {Schema} = mongoose

const hotelSchema = new Schema({
    /* user: {
        type: mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User'
    }, */
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        required: true
    },
    rooms: {
        type: [String],
        //required: true
    },
    photos: {
        type: [String],
        //required: true
    },
    cheapestPrice: {
        type: Number,
        required: true
    },
    featured: {
        type: Boolean,
        required: true,
        default: false
    },
},{
    timestamps: true
})

export default mongoose.model('Hotel', hotelSchema)