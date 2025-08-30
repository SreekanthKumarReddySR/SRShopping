import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import Product from '../models/product.js';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Mock nodemailer to avoid real emails
jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue(true),
    }),
  };
});

describe('Auth + Production API Tests', () => {
  let customerToken;
  let sellerToken;
  let categoryId;
  let productId;

  beforeAll(async () => {
    const testUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    await mongoose.connect(testUri);

    // cleanup
    await User.deleteMany({ email: { $in: ['customer@example.com', 'seller@example.com'] } });
    await Category.deleteMany({});
    await Product.deleteMany({});
  });

  afterAll(async () => {
    // await User.deleteMany({ email: { $in: ['customer@example.com', 'seller@example.com'] } });
    // await Category.deleteMany({});
    // await Product.deleteMany({});
    await mongoose.connection.close();
  });

  test('Register and verify customer', async () => {
    const customerData = {
      name: 'Test Customer',
      email: 'customer@example.com',
      password: 'Customer123!',
      role: 'customer',
    };

    const res = await request(app).post('/api/user/register').send(customerData);
    expect(res.statusCode).toBe(200);

    const customer = await User.findOneAndUpdate(
      { email: customerData.email },
      { isVerified: true },
      { new: true }
    );
    expect(customer).toBeTruthy();
    expect(customer.isVerified).toBe(true);
  });

  test('Register and verify seller', async () => {
    const sellerData = {
      name: 'Test Seller',
      email: 'seller@example.com',
      password: 'Seller123!',
      role: 'seller',
    };

    const res = await request(app).post('/api/user/register').send(sellerData);
    expect(res.statusCode).toBe(200);

    const seller = await User.findOneAndUpdate(
      { email: sellerData.email },
      { isVerified: true },
      { new: true }
    );
    expect(seller).toBeTruthy();
    expect(seller.isVerified).toBe(true);
  });

  test('Login customer and store JWT', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: 'customer@example.com',
      password: 'Customer123!',
    });

    expect(res.statusCode).toBe(200);
    customerToken = res.body.token;
    expect(customerToken).toBeTruthy();
  });

  test('Login seller and store JWT', async () => {
    const res = await request(app).post('/api/user/login').send({
      email: 'seller@example.com',
      password: 'Seller123!',
    });

    expect(res.statusCode).toBe(200);
    sellerToken = res.body.token;
    expect(sellerToken).toBeTruthy();
  });

  test('Seller creates category', async () => {
    const res = await request(app)
      .post('/api/categories/add-category') // ✅ check this matches your route
      .set('auth-token', sellerToken)
      .send({
        name: 'Electronics',
        description: 'Electronic gadgets',
        image: 'electronics.jpg',
      });

    categoryId = res.body.category._id;
    console.log('CategoryId:', categoryId);

    expect(res.statusCode).toBe(201);
    expect(categoryId).toBeTruthy();
  });

  test('Seller creates product', async () => {
    const res = await request(app)
      .post('/api/products/add-product') // ✅ check this matches your route
      .set('auth-token', sellerToken)
      .send({
      title: 'iPhone 15',                  // ✅ schema requires title
      imageLinks: ['iphone15.jpg'],        // ✅ must be array
      category: categoryId,                // ✅ from previous test
      price: 1200,                         // ✅ required
      discountPrice: 1100,
      description: 'Latest Apple iPhone',  // ✅ required
      stock: 10,                           // ✅ required
      deliveryType: 'Standard',
      brand: 'Apple',
      sku: 'IP15-001',
      tags: ['phone', 'apple', 'smartphone'],
      isFeatured: true,
    });

    
    productId = res.body.product._id;
    console.log('ProductId:', productId);
    expect(res.statusCode).toBe(201);
    expect(productId).toBeTruthy();
    
  });

});
