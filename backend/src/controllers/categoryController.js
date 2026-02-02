const Category = require('../models/Category');

// @desc    Get all categories for logged-in provider
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
    try {
        const { search } = req.query;
        const page = Math.max(parseInt(req.query.page || '1', 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
        const skip = (page - 1) * limit;
        let query = { provider: req.user.id };

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)
        ]);

        res.json({
            data: categories,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Ensure user owns category
        if (category.provider.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
    try {
        const { title, description, image, status } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const category = await Category.create({
            provider: req.user.id,
            title,
            description,
            image,
            status
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Ensure user owns category
        if (category.provider.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Ensure user owns category
        if (category.provider.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await category.deleteOne();

        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};
