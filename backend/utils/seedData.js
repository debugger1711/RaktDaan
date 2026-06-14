const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/raktdaan';

const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Gurugram', 'Noida', 'Lucknow', 'Ahmedabad'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const hospitals = [
  'AIIMS', 'Fortis Hospital', 'Apollo Hospital', 'Max Super Speciality',
  'Medanta The Medicity', 'Safdarjung Hospital', 'Ram Manohar Lohia Hospital',
  'Sir Ganga Ram Hospital', 'BLK Super Speciality Hospital', 'Narayana Health',
];

const donorNames = [
  'Suresh Kumar', 'Meera Reddy', 'Amit Patel', 'Neha Gupta', 'Rajesh Khanna',
  'Pooja Sharma', 'Vikram Singh', 'Anjali Desai', 'Rohit Verma', 'Priya Nair',
  'Deepak Joshi', 'Sneha Roy', 'Arjun Mehta', 'Kavita Yadav', 'Manish Tiwari',
  'Anita Saxena', 'Sanjay Rao', 'Divya Pillai', 'Arun Mishra', 'Ritu Chauhan',
];

const recipientNames = [
  'Raghav Malhotra', 'Sunita Devi', 'Karan Arora', 'Lata Mangeshkar',
  'Nikhil Banerjee', 'Geeta Iyer', 'Pramod Shukla', 'Rekha Bhatia',
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (daysBack) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};
const randomPhone = () => `+91 ${Math.floor(70000 + Math.random() * 29999)} ${Math.floor(10000 + Math.random() * 89999)}`;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await BloodRequest.deleteMany({});
    await Donation.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data');

    // --- Create Admin ---
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@raktdaan.in',
      phone: '+91 98765 00001',
      password: 'admin123',
      role: 'admin',
      bloodGroup: 'O+',
      city: 'New Delhi',
      isVerified: true,
    });
    console.log('Admin created: admin@raktdaan.in / admin123');

    // --- Create Donors ---
    const donors = [];
    for (let i = 0; i < donorNames.length; i++) {
      const donor = await User.create({
        name: donorNames[i],
        email: `donor${i + 1}@raktdaan.in`,
        phone: randomPhone(),
        password: 'donor123',
        role: 'donor',
        bloodGroup: randomItem(bloodGroups),
        city: randomItem(cities),
        isAvailable: Math.random() > 0.2,
        lastDonationDate: Math.random() > 0.3 ? randomDate(180) : null,
        totalDonations: Math.floor(Math.random() * 15),
        isVerified: true,
      });
      donors.push(donor);
    }
    console.log(`${donors.length} donors created (donor1@raktdaan.in ... donor${donors.length}@raktdaan.in / donor123)`);

    // --- Create Recipients ---
    const recipients = [];
    for (let i = 0; i < recipientNames.length; i++) {
      const recipient = await User.create({
        name: recipientNames[i],
        email: `recipient${i + 1}@raktdaan.in`,
        phone: randomPhone(),
        password: 'recipient123',
        role: 'recipient',
        city: randomItem(cities),
        isVerified: true,
      });
      recipients.push(recipient);
    }
    console.log(`${recipients.length} recipients created (recipient1@raktdaan.in ... recipient${recipients.length}@raktdaan.in / recipient123)`);

    // --- Create Blood Requests ---
    const urgencies = ['Normal', 'High', 'Critical'];
    const statuses = ['Pending', 'Pending', 'Pending', 'Accepted', 'Completed', 'Closed'];
    const requests = [];
    for (let i = 0; i < 15; i++) {
      const requester = randomItem(recipients);
      const status = randomItem(statuses);
      const request = await BloodRequest.create({
        requester: requester._id,
        patientName: `Patient ${i + 1}`,
        bloodGroup: randomItem(bloodGroups),
        unitsRequired: Math.ceil(Math.random() * 4),
        hospital: randomItem(hospitals),
        city: randomItem(cities),
        contactNumber: randomPhone(),
        urgency: randomItem(urgencies),
        status: status,
        notes: i % 3 === 0 ? 'Urgent surgery scheduled' : undefined,
        createdAt: randomDate(30),
      });

      // Add accepted donors for non-Pending requests
      if (status !== 'Pending') {
        const acceptedDonor = randomItem(donors);
        request.acceptedDonors.push({ donor: acceptedDonor._id, acceptedAt: new Date() });
        await request.save();
      }

      requests.push(request);
    }
    console.log(`${requests.length} blood requests created`);

    // --- Create Donations ---
    const donations = [];
    for (let i = 0; i < 25; i++) {
      const donor = randomItem(donors);
      const donation = await Donation.create({
        donor: donor._id,
        bloodRequest: Math.random() > 0.3 ? randomItem(requests)._id : undefined,
        hospital: randomItem(hospitals),
        city: donor.city,
        bloodGroup: donor.bloodGroup,
        units: 1,
        donationDate: randomDate(365),
        status: Math.random() > 0.1 ? 'Completed' : 'Cancelled',
      });
      donations.push(donation);
    }
    console.log(`${donations.length} donation records created`);

    // --- Create Notifications ---
    const notifTypes = ['alert', 'info', 'success', 'warning'];
    const notifMessages = [
      { title: 'Urgent Request Nearby', message: 'O+ blood required at Fortis Hospital', type: 'alert' },
      { title: 'Donation Eligibility', message: 'You are now eligible to donate blood again.', type: 'info' },
      { title: 'Request Accepted', message: 'A donor has accepted your blood request.', type: 'success' },
      { title: 'Profile Incomplete', message: 'Please complete your profile for better matching.', type: 'warning' },
      { title: 'New Request Match', message: 'A new blood request matches your blood group in your city.', type: 'alert' },
      { title: 'Thank You!', message: 'Your recent donation has been recorded. You saved lives!', type: 'success' },
    ];

    for (const donor of donors.slice(0, 10)) {
      const notif = randomItem(notifMessages);
      await Notification.create({
        user: donor._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        isRead: Math.random() > 0.5,
        relatedRequest: Math.random() > 0.5 ? randomItem(requests)._id : undefined,
      });
    }
    for (const recipient of recipients.slice(0, 5)) {
      await Notification.create({
        user: recipient._id,
        title: 'Request Accepted',
        message: 'A donor has accepted your blood request. They will contact you shortly.',
        type: 'success',
        isRead: false,
        relatedRequest: randomItem(requests)._id,
      });
    }
    console.log('Notifications created');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('=== Login Credentials ===');
    console.log('Admin:     admin@raktdaan.in / admin123');
    console.log('Donor:     donor1@raktdaan.in / donor123');
    console.log('Recipient: recipient1@raktdaan.in / recipient123');
    console.log('=========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
