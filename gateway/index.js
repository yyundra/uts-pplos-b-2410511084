const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.use(express.json);
app.use(cors());

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60
});

app.use(limiter);

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return res.status(401).json({ message: 'No Token !'});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Token !'});
    }
};

const AUTH_SERVICE = 'http://localhost:8000';
const INVENTORY_SERVICE = 'http://localhost:3001';
const TRANSACTION_SERVICE = 'http://localhost:3002';

app.use('/api/auth', async (req, res) => {
    try {
        const response = await axios ({
            method: req.method,
            url: AUTH_SERVICE + req.url,
            data: req.body,
            headers: req.headers
        });

        res.status(response.status).json(response.data);
    }catch (err) {
        res.status(err.response?.status || 500).json(err.response?.data || { message: 'Auth error !' });
    }
});

app.use('/api/inventory', verifyTokenn, async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: INVENTORY_SERVICE + req.url,
            data: req.body,
            headers: req.headers
        });

        res.status(response.status).json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json(err.response?.data || { message: 'Inventory Error !' });
    }
});

app.use('/api/transaction', verifyToken, async (req, res) => {
    try {
        const response = await axios({
            method: req.method,
            url: INVENTORY_SERVICE + req.url,
            data: req.body,
            headers: req.headers
        });

        res.status(response.status).json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json(err.response?.data || { message: 'Transaction Error !' });
    }
});

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});