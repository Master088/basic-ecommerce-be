require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const path = require('path')
const app = express();
const expressRateLimit = require('express-rate-limit')
const expressWinston = require('express-winston')
const apicache = require('apicache')
 
const { createLogger } = require('winston')

const {
  winstonLoggerOptions,
  expressRateLimitOptions,
  corsOptions,
  apicacheOptions,
} = require('./config/app.config')

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const api = express.Router()
const v1 = express.Router()


const winstonLogger = createLogger(winstonLoggerOptions)
const rateLimit = expressRateLimit(expressRateLimitOptions)
const cache = apicache.options(apicacheOptions).middleware()

app.use(expressWinston.logger({ winstonInstance: winstonLogger }))
app.use(rateLimit)
app.use(cors(corsOptions))
app.use(cache)

app.use('/api', api)
api.use('/v1', v1)

v1.use('/auth', require('./routes/auth.route'));
v1.use('/categories', require('./routes/category.route'));
v1.use('/product', require('./routes/product.route'));
v1.use('/order', require('./routes/order.route'));
v1.use('/cart', require('./routes/cart.route'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ alter: true });
    console.log('Models synced.');
  } catch (error) {
    console.error('Unable to connect to DB:', error);
  }
});
