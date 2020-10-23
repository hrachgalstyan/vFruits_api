const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

app.use(bodyParser.json());
app.use(cookieParser());

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

module.exports = app;
