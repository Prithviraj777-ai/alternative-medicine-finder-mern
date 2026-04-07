const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const medicineRoutes = require('./routes/medicineRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => res.send('API is running...'));

// Error Handling
app.use(errorHandler);

module.exports = app;