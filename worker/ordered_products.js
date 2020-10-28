const mongoose = require('mongoose');
const moment = require('moment');
const helpers = require('../helpers');

const ShopOrders = require('../models/ShopOrders');
const DailyTotals = require('../models/DailyTotals');

const OrderedProducts = async () => {
  console.log('WORKER-DAILY-ORDERS: START');
  const currentUtc = moment().utc();
  const yesterdayUtc = moment().utc().subtract(1, 'day');
  const dateString = yesterdayUtc.format('DD-MM-YYYY');
  if (currentUtc.get('hour') === 20 && currentUtc.get('minute') === 1) {
    const dailyLog = await DailyTotals.countDocuments({ dateString });
    if (dailyLog > 0) {
      console.log('WORKER-DAILY-ORDERS: ALREADY THERE - C:', dailyLog);
      return;
    }
  } else { // if we have some other time just return
    console.log('WORKER-DAILY-ORDERS: NOT THIS TIME - ', currentUtc.toISOString());
    return;
  }

  // 5am for GMT+4
  const fromDate = yesterdayUtc.clone().set({ 'hour': '1', 'minute': '0' }).toISOString();
  // 4:59am for GMT+4
  const toDate = yesterdayUtc.clone().add(1, 'day').set({ 'hour': '0', 'minute': '59' }).toISOString();

  const orders = await ShopOrders.find({ created_at: { $gte: fromDate, $lte: toDate }, status: helpers.ORDER_STATUS.PENDING });
  let products = [];
  orders.map(order => {
    order.products.map(p => {
      const product = products.find(pp => p._id.toString() === pp._id.toString());
      if (product) {
        product.quantity = product.quantity ? product.quantity + p.quantity : p.quantity;
      } else {
        products.push(p);
      }
    });
  });

  if (products.length === 0) {
    console.log("WORKER-DAILY-ORDERS: NO PRODUCTS TO SEND!");
    return;
  }

  await DailyTotals.create({
    orders: orders.map(o => o._id),
    products,
    dateString,
  });

  helpers.sendToTelegram(`${dateString} orders added! 💰💰💰`);

  console.log('WORKER-DAILY-ORDERS: ADDED NEW ONE - ', dateString);
};

module.exports = OrderedProducts;