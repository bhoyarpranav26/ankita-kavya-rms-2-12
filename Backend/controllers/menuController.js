const MenuItem = require('../models/MenuItem');

exports.list = async (req, res) => {
  try {
    const { restaurantId, category } = req.query;
    const filter = {};
    if (restaurantId) filter.restaurantId = restaurantId;
    if (category) filter.category = category;
    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    console.error('List menu error:', err);
    res.status(500).json({ message: 'Failed to list menu items' });
  }
};

exports.create = async (req, res) => {
  try {
    const { restaurantId, category, name, description, price, image, available } = req.body;
    if (!restaurantId || !category || !name || price == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const item = new MenuItem({ restaurantId, category, name, description, price, image, available });
    await item.save();
    res.status(201).json({ item });
  } catch (err) {
    console.error('Create menu error:', err);
    res.status(500).json({ message: 'Failed to create menu item' });
  }
};

exports.get = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ item });
  } catch (err) {
    console.error('Get menu error:', err);
    res.status(500).json({ message: 'Failed to get menu item' });
  }
};

exports.update = async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: Date.now() };
    const item = await MenuItem.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ item });
  } catch (err) {
    console.error('Update menu error:', err);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete menu error:', err);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
};

// Seed sample menu items (development helper)
exports.seed = async (req, res) => {
  try {
    const samples = [
      { restaurantId: 'default', category: 'Starters', name: 'Paneer Tikka', description: 'Spiced paneer chunks', price: 220, image: '/assets/images/no-dishes.png' },
      { restaurantId: 'default', category: 'Main Course', name: 'Butter Chicken', description: 'Classic butter chicken', price: 350, image: '/assets/images/no-dishes.png' },
      { restaurantId: 'default', category: 'Beverages', name: 'Masala Chai', description: 'Hot spiced tea', price: 60, image: '/assets/images/no-dishes.png' },
      { restaurantId: 'default', category: 'Desserts', name: 'Gulab Jamun', description: 'Sweet syrupy dessert', price: 120, image: '/assets/images/no-dishes.png' }
    ];

    // Insert only if DB is empty for restaurantId 'default'
    const existing = await MenuItem.findOne({ restaurantId: 'default' });
    if (existing) return res.status(200).json({ message: 'Seed already applied' });

    const created = await MenuItem.insertMany(samples);
    res.status(201).json({ created });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Failed to seed menu items' });
  }
};
