const helpers = require('../helpers');
const OrderedProducts = require('./ordered_products');

const Worker = () => {
  setInterval(async () => {
      try {
        await OrderedProducts();
      } catch (e) {
        console.log('WORKER-ERROR: ', e);
      }
    }, helpers.WORKER_INTERVAL);
};

module.exports = Worker;
