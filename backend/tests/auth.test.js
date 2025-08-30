import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Mock nodemailer before anything else
jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue(true), // pretend email always succeeds
    }),
  };
});

describe('Auth API Tests', () => {
  beforeAll(async () => {
    const testUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    await mongoose.connect(testUri);
    await User.deleteMany({ email: { $in: ['customer@example.com', 'seller@example.com'] } });
  });

  afterAll(async () => {
    await User.deleteMany({ email: { $in: ['customer@example.com', 'seller@example.com'] } });
    await mongoose.connection.close();
  });

  test('Register and verify a customer', async () => {
    const customerData = {
      name: 'Test Customer',
      email: 'customer@example.com',
      password: 'Customer123!',
      role: 'customer',
    };

    const res = await request(app)
      .post('/api/user/register')
      .send(customerData);

    console.log('Customer register response:', res.body);

    expect(res.statusCode).toBe(200);

    const customer = await User.findOneAndUpdate(
      { email: customerData.email },
      { isVerified: true },
      { new: true }
    );
    expect(customer).toBeTruthy();
    expect(customer.isVerified).toBe(true);
  });

  test('Register and verify a seller', async () => {
    const sellerData = {
      name: 'Test Seller',
      email: 'seller@example.com',
      password: 'Seller123!',
      role: 'seller',
    };

    const res = await request(app)
      .post('/api/user/register')
      .send(sellerData);

    console.log('Seller register response:', res.body);

    expect(res.statusCode).toBe(200);

    const seller = await User.findOneAndUpdate(
      { email: sellerData.email },
      { isVerified: true },
      { new: true }
    );
    expect(seller).toBeTruthy();
    expect(seller.isVerified).toBe(true);
  });
});
