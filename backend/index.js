const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const routes = require('./routes/routes');
const mongoose = require('mongoose');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));

app.use(routes);

const port = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(port, () => console.log(`Server running on port: ${port}`));
    })
    .catch(err => console.error("MongoDB error:", err));