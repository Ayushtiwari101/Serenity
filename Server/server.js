const express = require('express');
const mongoose = require('mongoose');
// Forced restart to clear console logs
require('dotenv').config();
const cors = require('cors');
const Router = require('./routes.js');


const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Pre-flight requests
app.options('*', cors());

// Routes
app.use(Router);

let connectionStatus = 'disconnected';

const startDatabase = async () => {
    try {
        const uri = process.env.URI;
        if (!uri) {
            console.error("Database URI is not defined in .env");
            connectionStatus = "Database URI missing";
            return;
        }
        console.log("Connecting to database...");
        await mongoose.connect(uri, { family: 4 });
        connectionStatus = "The database has been connected!!";
    } catch (err) {
        console.error("Failed to connect to database", err);
        connectionStatus = "Failed to connect to database";
    }
};

app.get('/', (req, res) => {
    res.send(connectionStatus);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    startDatabase();
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
