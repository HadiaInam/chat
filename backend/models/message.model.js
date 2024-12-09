import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    recieverId: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        requried: true
    }
}, {timestamps: true} );

const Message = mongoose.models.message || mongoose.model('message', messageSchema);

export default Message;