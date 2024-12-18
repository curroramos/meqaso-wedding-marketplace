const Service = require('../models/Service');
const Joi = require('joi');

// Build the service query based on the filters
const buildServiceQuery = ({ categories, minPrice, maxPrice, name }) => {
  const query = {};

  // Handle categories
  if (categories.length > 0) {
    query.category = { $in: categories }; // Match any category in the array
  }

  if (minPrice) {
    query.price = { ...query.price, $gte: Number(minPrice) };
  }
  if (maxPrice) {
    query.price = { ...query.price, $lte: Number(maxPrice) };
  }
  if (name) {
    query.title = new RegExp(name, 'i'); // Add case-insensitive name search
  }
  
  return query;
};

// Joi schema for validating query parameters
const querySchema = Joi.object({
  categories: Joi.string().optional(), // Keep as a string since it's JSON-formatted
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  name: Joi.string().optional(),
  limit: Joi.number().integer().min(1).default(10),
  page: Joi.number().integer().min(1).default(1),
});

// Controller to fetch services
exports.getServices = async (req, res) => {
  try {
    const validatedQuery = await querySchema.validateAsync(req.query);

    // Parse categories if it exists
    let categoriesArray = [];
    if (validatedQuery.categories) {
      try {
        categoriesArray = JSON.parse(validatedQuery.categories); // Convert JSON string to array
        if (!Array.isArray(categoriesArray)) {
          throw new Error('categories must be a JSON array');
        }
      } catch (error) {
        return res.status(400).json({ error: 'Invalid JSON format for categories' });
      }
    }

    // Destructure other fields, excluding `categories` as it’s already parsed
    const { name, limit, page, ...filters } = validatedQuery;

    // Add parsed categories to the filters
    const queryFilters = { ...filters, categories: categoriesArray };

    
    // Build the database query
    const query = buildServiceQuery(queryFilters);
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

    const combinedQuery = { ...query, ...searchQuery};

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

// Controller to fetch categories
exports.getCategories = async (req, res) => {
  try {
    const categories = ["DJ", "Band", "Solo Artist"]; // Replace with dynamic data if needed
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
};

// Controller to fetch a service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the service by ID
    const service = await Service.findById(id).populate('provider'); // Assuming `provider` is a reference

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch service',
      error: error.message,
    });
  }
};
