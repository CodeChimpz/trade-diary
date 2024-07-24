import {config} from "dotenv";

const mongoose = require('mongoose');
config()

const mongoUrl = process.env.MONGO_URL

// Connect to MongoDB
export const dbConnect = () => mongoose
    .connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected...'))
    .catch((err:any) => console.log(err));


