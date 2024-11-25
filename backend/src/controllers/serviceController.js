const Service = require('../models/Service');
const Joi = require('joi');

// Build the service query based on the filters
const buildServiceQuery = ({ category, minPrice, maxPrice, name }) => {
  const query = {};

  if (category) query.category = category;
  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
  if (name) query.title = new RegExp(name, 'i');

  return query;
};

// Joi schema for validating query parameters
const querySchema = Joi.object({
  category: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  name: Joi.string(),
  limit: Joi.number().integer().min(1).default(10),
  page: Joi.number().integer().min(1).default(1),
});

// Controller to fetch services
exports.getServices = async (req, res) => {
  try {
    const validatedQuery = await querySchema.validateAsync(req.query);
    const { name, limit, page, ...filters } = validatedQuery;

    const query = buildServiceQuery(filters);
    const paginationLimit = parseInt(limit, 10);
    const paginationPage = parseInt(page, 10);

    // Add search-specific conditions if "name" is provided
    const searchQuery = name
      ? {
          $or: [
            { title: { $regex: name, $options: 'i' } }, // Match in title
            { description: { $regex: name, $options: 'i' } }, // Match in description
          ],
        }
      : {};

    const combinedQuery = { ...query, ...searchQuery };

    // Fetch services with pagination and scoring
    const services = await Service.aggregate([
      { $match: combinedQuery },
      {
        $addFields: {
          score: {
            $cond: [
              { $regexMatch: { input: '$title', regex: new RegExp(name, 'i') } },
              2, // Higher score for matches in the title
              {
                $cond: [
                  { $regexMatch: { input: '$description', regex: new RegExp(name, 'i') } },
                  1, // Lower score for matches in the description
                  0, // Default score
                ],
              },
            ],
          },
        },
      },
      { $sort: { score: -1, createdAt: -1 } }, // Sort by score, then most recent
      { $skip: (paginationPage - 1) * paginationLimit },
      { $limit: paginationLimit },
    ]);

    const total = await Service.countDocuments(combinedQuery);

    res.status(200).json({
      services,
      total,
      totalPages: Math.ceil(total / paginationLimit),
      currentPage: paginationPage,
    });
  } catch (error) {
    res.status(400).json({
      message: error.isJoi ? 'Invalid query parameters' : 'Failed to fetch services',
      error: error.isJoi ? error.details[0].message : error.message,
    });
  }
};

// Controller to create a new service
exports.createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      provider: req.user._id, // Assume `req.user` is populated from middleware
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({
      message: 'Service creation failed',
      error: error.message,
    });
  }
};
