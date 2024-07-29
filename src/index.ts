import {tradeController} from "./controllers/Trade.controller";
import {config} from "dotenv";
import {dbConnect} from "./connector/mongo";
import {JoiValidatorMiddleware} from "./middleware/validator";
import {schemaTrade} from "./validation/request.validation";

config()
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Get all trades for user id
app.get('/trades/:userId', tradeController.getTrades);

// Get all trades for user id
app.put('/trade/:tradeId', tradeController.editTrade);

// Remove trade
app.delete('/trade/:tradeId', tradeController.deleteTrade);

// Create a new trade
app.post('/trade/:userId',JoiValidatorMiddleware(schemaTrade), tradeController.postTrade);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    dbConnect()
});
