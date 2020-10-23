const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'Users', required: true },
  shopOrder: { type: mongoose.Schema.ObjectId, ref: 'ShopOrders', required: true },
  unpaidOrder: Object, // Keeping unpaid order here for later transferring it to ShopOrder when paid
  paymentId: String,

  // First to set before completing transaction
  orderId: { type: String, unique: true, index: true, required: true },
  description: String,
  amount: {type: Number, required: true},

  // when payment info came back
  state: String,
  cardNumber: String,
  clientName: String,
  expDate: String,
  authCode: String,
  cardholderID: String,
  created_at: { type: Date, default: new Date(Date.now() + 14400000) },
});

const Payments = mongoose.model('Payments', paymentSchema);

module.exports = Payments;