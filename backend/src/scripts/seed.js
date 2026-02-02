require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Service.deleteMany({});
        console.log('Data cleared...');

        // 1. Create Providers
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const provider1 = await User.create({
            full_name: 'Sara Johnson',
            email: 'sara@salon.com',
            phone: '123-456-7890',
            password: hashedPassword,
            company_name: 'Luxury Looks Salon',
            license_number: 'LIC-001'
        });

        const provider2 = await User.create({
            full_name: 'Mike Smith',
            email: 'mike@barber.com',
            phone: '987-654-3210',
            password: hashedPassword,
            company_name: 'Mike\'s Barbershop',
            license_number: 'LIC-002'
        });

        console.log('Providers created...');

        // 2. Create Categories for Provider 1
        const cat1 = await Category.create({
            provider: provider1._id,
            title: 'Hair Services',
            description: 'Cutting, styling, and coloring',
            status: 'active'
        });

        const cat2 = await Category.create({
            provider: provider1._id,
            title: 'Nail Treatments',
            description: 'Manicures and pedicures',
            status: 'active'
        });

        console.log('Categories created...');

        // 3. Create Services for Provider 1
        await Service.create([
            {
                provider: provider1._id,
                category: cat1._id,
                service_name: 'Women\'s Haircut',
                base_price: 50,
                vat_percent: 15,
                discount_amount: 5
            },
            {
                provider: provider1._id,
                category: cat1._id,
                service_name: 'Full Color',
                base_price: 120,
                vat_percent: 15,
                discount_amount: 0
            },
            {
                provider: provider1._id,
                category: cat2._id,
                service_name: 'Gel Manicure',
                base_price: 40,
                vat_percent: 15,
                discount_amount: 0
            }
        ]);

        // Create Categories/Services for Provider 2
        const cat3 = await Category.create({
            provider: provider2._id,
            title: 'Gentlemen\'s Grooming',
            status: 'active'
        });

        await Service.create({
            provider: provider2._id,
            category: cat3._id,
            service_name: 'Classic Shave',
            base_price: 30,
            vat_percent: 15,
            discount_amount: 0
        });

        console.log('Services created...');
        console.log('Seeding Completed Successfully!');
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/salon_db')
    .then(async () => {
        console.log('MongoDB connected for seeding');
        await seedData();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
