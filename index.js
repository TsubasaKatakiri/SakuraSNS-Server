require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandling = require('./middleware/errors.middleware')

const app = express();

const PORT = process.env.SERVER_PORT || 8080;
const MONGODB_URL = process.env.MONGODB_URL;

//=== Server middleware ===
app.use(express.json({extended: true}));
app.use(cookieParser());
app.use(morgan('common'));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'PUT', 'DELETE', 'OPTIONS', 'POST'],
}));

//=== Server routes ===
app.use('/api', require('./routes/index.routes'));

//Error handling
app.use(errorHandling);

//=== Server start ===
const startServer = async () =>{
    try {
        const conn = await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Established connection to the MongoDB database (${conn.connection.host})...`);
        app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
    } catch (error) {
        console.log(`Server error: ${error.message}`);
        process.exit(1);
    }
}

startServer();