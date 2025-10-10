const mongoose = require('mongoose');
require('dotenv').config();

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
  rating: { type: Number, default: 4.5 },
  bestTimeToVisit: String,
  activities: [String],
  createdAt: { type: Date, default: Date.now }
});

const Destination = mongoose.model('Destination', destinationSchema);

const sampleDestinations = [
  {
    name: 'Bali',
    country: 'Indonesia',
    category: 'Beach',
    description: 'Paradise island with stunning beaches, temples, and vibrant culture. Perfect for relaxation and adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2938&auto=format&fit=crop',
    estimatedCost: 5000000,
    rating: 4.8,
    bestTimeToVisit: 'April - October',
    activities: ['Surfing', 'Temple Tours', 'Diving', 'Yoga']
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    category: 'City',
    description: 'Modern metropolis blending ancient traditions with cutting-edge technology. Experience unique culture and cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2894&auto=format&fit=crop',
    estimatedCost: 15000000,
    rating: 4.9,
    bestTimeToVisit: 'March - May, September - November',
    activities: ['Shopping', 'Food Tours', 'Museums', 'Temples']
  },
  {
    name: 'Santorini',
    country: 'Greece',
    category: 'Island',
    description: 'Iconic white-washed buildings with blue domes overlooking the Aegean Sea. Romantic sunsets and luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2835&auto=format&fit=crop',
    estimatedCost: 20000000,
    rating: 4.9,
    bestTimeToVisit: 'April - November',
    activities: ['Wine Tasting', 'Beach Clubs', 'Photography', 'Sailing']
  },
  {
    name: 'Maui',
    country: 'USA',
    category: 'Island',
    description: 'Hawaiian paradise with pristine beaches, volcanic landscapes, and world-class resorts.',
    imageUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?q=80&w=2969&auto=format&fit=crop',
    estimatedCost: 25000000,
    rating: 4.8,
    bestTimeToVisit: 'April - May, September - November',
    activities: ['Snorkeling', 'Hiking', 'Whale Watching', 'Surfing']
  },
  {
    name: 'Dubai',
    country: 'UAE',
    category: 'City',
    description: 'Futuristic city with luxury shopping, ultramodern architecture, and desert adventures.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2940&auto=format&fit=crop',
    estimatedCost: 18000000,
    rating: 4.7,
    bestTimeToVisit: 'November - March',
    activities: ['Shopping', 'Desert Safari', 'Skydiving', 'Luxury Dining']
  },
  {
    name: 'Swiss Alps',
    country: 'Switzerland',
    category: 'Mountain',
    description: 'Breathtaking mountain scenery with world-class skiing, hiking trails, and charming villages.',
    imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2940&auto=format&fit=crop',
    estimatedCost: 22000000,
    rating: 4.9,
    bestTimeToVisit: 'December - April, June - September',
    activities: ['Skiing', 'Hiking', 'Mountain Biking', 'Paragliding']
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    category: 'Beach',
    description: 'Tropical paradise with overwater bungalows, crystal-clear waters, and vibrant marine life.',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2865&auto=format&fit=crop',
    estimatedCost: 30000000,
    rating: 5.0,
    bestTimeToVisit: 'November - April',
    activities: ['Diving', 'Snorkeling', 'Spa', 'Water Sports']
  },
  {
    name: 'Patagonia',
    country: 'Chile/Argentina',
    category: 'Mountain',
    description: 'Wild and remote region with stunning glaciers, mountains, and unique wildlife.',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2940&auto=format&fit=crop',
    estimatedCost: 17000000,
    rating: 4.8,
    bestTimeToVisit: 'December - February',
    activities: ['Trekking', 'Wildlife Watching', 'Glacier Tours', 'Camping']
  },
  {
    name: 'Paris',
    country: 'France',
    category: 'City',
    description: 'The City of Light with iconic landmarks, world-class museums, and romantic ambiance.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2946&auto=format&fit=crop',
    estimatedCost: 16000000,
    rating: 4.8,
    bestTimeToVisit: 'April - June, September - October',
    activities: ['Museums', 'Fine Dining', 'Shopping', 'Architecture']
  },
  {
    name: 'Sahara Desert',
    country: 'Morocco',
    category: 'Desert',
    description: 'Vast golden sand dunes, starry nights, and authentic desert camp experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2874&auto=format&fit=crop',
    estimatedCost: 8000000,
    rating: 4.7,
    bestTimeToVisit: 'October - April',
    activities: ['Camel Trekking', 'Stargazing', 'Desert Camping', 'Photography']
  },
  {
    name: 'Amazon Rainforest',
    country: 'Brazil',
    category: 'Forest',
    description: 'World\'s largest tropical rainforest with incredible biodiversity and indigenous cultures.',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2872&auto=format&fit=crop',
    estimatedCost: 12000000,
    rating: 4.6,
    bestTimeToVisit: 'June - November',
    activities: ['Wildlife Tours', 'River Cruises', 'Jungle Trekking', 'Bird Watching']
  },
  {
    name: 'Iceland',
    country: 'Iceland',
    category: 'Island',
    description: 'Land of fire and ice with geysers, waterfalls, glaciers, and northern lights.',
    imageUrl: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?q=80&w=2940&auto=format&fit=crop',
    estimatedCost: 19000000,
    rating: 4.9,
    bestTimeToVisit: 'June - August, December - March',
    activities: ['Northern Lights', 'Hot Springs', 'Glacier Tours', 'Whale Watching']
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wanderly');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Destination.deleteMany({});
    console.log('🗑️  Cleared existing destinations');

    // Insert sample data
    await Destination.insertMany(sampleDestinations);
    console.log(`✅ Successfully seeded ${sampleDestinations.length} destinations`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();