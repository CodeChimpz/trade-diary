import {tradeController} from "./controllers/Trade.controller";
import {config} from "dotenv";
import {dbConnect} from "./connector/mongo";
config()
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Get all trades for user id
app.get('/trades/:userId', tradeController.getTrades);

// Get a specific trade by id
app.get('/trades/:id', tradeController.getTrades);

// Create a new trade
app.post('/trade/:userId', tradeController.postTrade);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    dbConnect()
});
