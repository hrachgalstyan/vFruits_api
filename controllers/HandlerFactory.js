const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    req.body.updated_at = new Date(Date.now() + 14400000);
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!doc) {
        return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
        return next(new AppError('Տվյալ ID-ով փաստաթուղթ չի հայտնաբերվել', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});

exports.getAll = (Model, sec_query) => catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on product (hack)
    let filter = sec_query || {};
    if (req.params.productId) filter = {
        product: req.params.productId
    };
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();
    const doc = await features.query;

    // Send response
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: doc
    });
})