const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const products = require('./data/products');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/organic_soap');

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    const users = [
      { name: 'Admin User', email: 'admin@example.com', password: hashedAdminPassword, role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: hashedUserPassword, role: 'customer' }
    ];

    await User.insertMany(users);
    await Product.insertMany(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
