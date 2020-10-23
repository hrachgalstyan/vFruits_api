const Products = require('../models/Products');
const Factory = require('./HandlerFactory');

exports.getAll = Factory.getAll(Products);
exports.createProduct = Factory.createOne(Products);
exports.getProduct = Factory.getOne(Products);
exports.updateProduct = Factory.updateOne(Products);;
exports.deleteProduct = Factory.deleteOne(Products);

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'tmp')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `product-${req.params.id}-${Date.now()}.${ext}`);
//   }
// })
// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if(file.mimetype.startsWith('image')){
//     cb(null, true);
//   }
//   else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// }

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter
// });

// exports.uploadProductPhoto = upload.single('photo');

// exports.resizeProductPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `product-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//       .resize(500, 500)
//       .toFormat('jpeg')
//       .jpeg({
//           quality: 90
//       })
//       .toFile(`tmp/${req.file.filename}`);
//   next();
// });

