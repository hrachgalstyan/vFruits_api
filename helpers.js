const Telegram = require('node-telegram-bot-api');
// const {Storage} = require('@google-cloud/storage');
const path = require('path');
const {TelegramGroupID} = require('./config');

const TelegramBot = new Telegram(
  "1326098139:AAFhWQtdHetyh2f4PuuAN_2vlM1PUFB15L8"
);

// exports.Storage = new GoogleStorage({
//   projectId: "vfruits-293408",
//   keyFilename: "vfruits-293408.json"
// });

// // umZYXlRKOLaJbkiY+bUQRuLOmrzDmkGFVDkGFmUK

// exports.StorageBucket = Storage.bucket("vfruits-293408.appspot.com");

exports.sendToTelegram = async (text, chatId = TelegramGroupID) =>
  await TelegramBot.sendMessage(chatId, text, { parse_mode: "HTML" });

exports.UNIT_TYPES = ["կգ", "հատ", "լիտր"];
exports.MIN_ORDER_PRICE = 3000;

exports.WORKER_INTERVAL = 60 * 1000;

exports.DELIVERY_TIMES = ["10-11am", "13-14pm", "16-17pm", "19-20pm"];
exports.ADMIN_ROLES = ["super_admin", "admin", "editor"];
exports.DELIVERY_TIME_MAX_HOURS = {
  "10-11am": 9,
  "13-14pm": 12,
  "16-17pm": 15,
  "19-20pm": 18
};

exports.ORDER_STATUS = Object.freeze({
  PENDING: "pending", // Ընթացքում
  CANCELED: "canceled", // Չեղյալ է հայտարարվել
  PACKAGING: "packaging", // Փաթեթավորում
  ON_THE_WAY: "on-the-way", // Ճանապարհին
  DELIVERED: "delivered", // Առաքված
});

exports.ACTIVITY_LOGS_STATUS_TYPES = Object.freeze({
  CATEGORY_CREATE: "category_create",
  CATEGORY_UPDATE: "category_update",
  CATEGORY_DELETE: "category_delete",
  SET_ORDER_STATUS: "set_order_status",
  ORDER_UPDATE: "order_update",
  ORDER_DELETE: "order_delete",
  PRODUCT_CREATE: "product_create",
  PRODUCT_UPDATE: "product_update",
  PRODUCT_DELETE: "product_delete",
  COUPON_UPDATE: "coupon_update",
  COUPON_CREATE: "coupon_create",
  COUPON_DELETE: "coupon_delete"
});

exports.CHANGE_LOGS_TARGETS = Object.freeze({
  SHOP_ORDER: "ShopOrder",
  PRODUCT: "Product",
  CATEGORY: "Category",
  COUPON: "Coupon"
});

exports.PAYMENT_METHODS = {
  CASH: "cash",
  CREDIT_CARD: "credit_card",
  IDRAM : "idram"
};

exports.uploadBase64 = async (base64String, filename) => {
  const filePath = path.join("/tmp", filename);
  await new Promise((resolve, reject) =>
    fs.writeFile(filePath, new Buffer(base64String, "base64"), e =>
      e ? reject(e) : resolve()
    )
  );
  await StorageBucket.upload(filePath, { public: true, destination: filename });
  await new Promise((resolve, reject) =>
    fs.unlink(filePath, e => (e ? reject(e) : resolve()))
  );
};

exports.removeFile = async filename => {
  const file = await StorageBucket.file(filename);
  const fileExists = await file.exists();
  if (fileExists) {
    await file.delete({ force: true });
  }
};