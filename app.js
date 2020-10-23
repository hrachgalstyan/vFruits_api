const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

const globalErrorHandler = require('./controllers/errorController');

const ProductsRouter = require(`${__dirname}/routes/ProductsRouter`);
const AdminRouter = require(`${__dirname}/routes/AdminRouter`);
const UserRouter = require(`${__dirname}/routes/UserRouter`);
const CategoriesRouter = require(`${__dirname}/routes/CategoriesRouter`);
const ActivityLogsRouter = require(`${__dirname}/routes/ActivityLogsRouter`);
const ChangeLogsRouter = require(`${__dirname}/routes/ChangeLogsRouter`);
const DailyTotalsRouter = require(`${__dirname}/routes/DailyTotalsRouter`);
const ShopOrderRouter = require(`${__dirname}/routes/ShopOrderRouter`);
const PaymentsRouter = require(`${__dirname}/routes/PaymentsRouter`);
const CouponsRouter = require(`${__dirname}/routes/CouponsRouter`);

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === "OPTIONS"){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Set Security HTTP headers
app.use(helmet());
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);
app.use(bodyParser.json());

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb',}));
app.use(express.urlencoded({extended: true, limit: '10kb',}));
app.use(cookieParser());
// Data sanitization against NOSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
app.use(compression());

app.use('/api/v1/products', ProductsRouter);
app.use('/api/v1/admin', AdminRouter);
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/categories', CategoriesRouter);
app.use('/api/v1/activity-logs', ActivityLogsRouter);
app.use('/api/v1/change-logs', ChangeLogsRouter);
app.use('/api/v1/daily-totals', DailyTotalsRouter);
app.use('/api/v1/shop-orders', ShopOrderRouter);
app.use('/api/v1/payments', PaymentsRouter);
app.use('/api/v1/coupons', CouponsRouter);

app.all('*', (req, res, next) => {
  console.log(`Can't find ${req.originalUrl} on this server!`);
  next();
});

app.use(globalErrorHandler);

module.exports = app;
