import {Schema, model} from 'mongoose';

export const UserSchema = new Schema({
    id: {
        type: String,
        default: () => new Schema.Types.ObjectId(),
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    initialDeposit: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true
});

export const User = model('User', UserSchema);