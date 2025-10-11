const mongoose = require('mongoose');
const Destination = require('./models/Destination');
require('dotenv').config();

const indonesiaDestinations = [
  {
    name: 'Pulau Komodo',
    country: 'Indonesia',
    city: 'Nusa Tenggara Timur',
    category: 'Petualangan',
    description: 'Habitat asli komodo, kadal terbesar di dunia. Taman Nasional Komodo menawarkan trekking, diving, dan pink beach yang eksotis.',
    imageUrl: 'https://images.unsplash.com/photo-1604560929658-bbc3c2ba6a36?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1073',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 3000000,
      max: 8000000
    },
    averageRating: 4.8,
    totalReviews: 673,
    tags: ['komodo dragon', 'wildlife', 'trekking', 'diving'],
    location: {
      latitude: -8.5569,
      longitude: 119.4473
    }
  },
  {
    name: 'Gunung Bromo',
    country: 'Indonesia',
    city: 'Jawa Timur',
    category: 'Gunung',
    description: 'Gunung berapi aktif yang menawarkan pemandangan sunrise spektakuler. Lautan pasir dan kawah yang menakjubkan menciptakan landscape unik.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1720967009356-2689587a0e61?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z3VudW5nJTIwYnJvbW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 500000,
      max: 2000000
    },
    averageRating: 4.8,
    totalReviews: 1234,
    tags: ['sunrise', 'volcano', 'hiking', 'photography'],
    location: {
      latitude: -7.9425,
      longitude: 112.9533
    }
  },
  {
    name: 'Raja Ampat',
    country: 'Indonesia',
    city: 'Papua Barat',
    category: 'Pantai',
    description: 'Surga bawah laut dengan keanekaragaman hayati tertinggi di dunia. Destinasi diving kelas dunia dengan pemandangan pulau karst yang menakjubkan.',
    imageUrl: 'https://images.unsplash.com/photo-1703769605297-cc74106244d9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFqYSUyMGFtcGF0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 5000000,
      max: 15000000
    },
    averageRating: 4.9,
    totalReviews: 847,
    tags: ['diving', 'snorkeling', 'island hopping', 'paradise'],
    location: {
      latitude: -0.2315,
      longitude: 130.5256
    }
  },
  {
    name: 'Danau Toba',
    country: 'Indonesia',
    city: 'Sumatera Utara',
    category: 'Lainnya',
    description: 'Danau vulkanik terbesar di Asia Tenggara dengan Pulau Samosir di tengahnya. Budaya Batak yang kaya dan pemandangan alam yang memukau.',
    imageUrl: 'https://images.unsplash.com/photo-1642762205001-aada86f9dbe2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGFuYXUlMjB0b2JhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 300000,
      max: 1500000
    },
    averageRating: 4.7,
    totalReviews: 892,
    tags: ['lake', 'culture', 'relaxation', 'nature'],
    location: {
      latitude: 2.6845,
      longitude: 98.8756
    }
  },
  {
    name: 'Borobudur',
    country: 'Indonesia',
    city: 'Jawa Tengah',
    category: 'Sejarah',
    description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-9. Warisan dunia UNESCO dengan relief dan stupa yang menakjubkan.',
    imageUrl: 'https://images.unsplash.com/photo-1620549146396-9024d914cd99?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9yb2J1ZHVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 100000,
      max: 500000
    },
    averageRating: 4.9,
    totalReviews: 2156,
    tags: ['temple', 'unesco', 'history', 'buddhist'],
    location: {
      latitude: -7.6079,
      longitude: 110.2038
    }
  },
  {
    name: 'Bali - Tanah Lot',
    country: 'Indonesia',
    city: 'Bali',
    category: 'Pantai',
    description: 'Pulau Dewata dengan pantai indah, pura megah, dan budaya yang kaya. Surga wisata dengan segala jenis aktivitas dari surfing hingga yoga.',
    imageUrl: 'https://images.unsplash.com/photo-1724568834641-c083683d15ab?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFsaSUyMHRhbmFoJTIwbG90fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 500000,
      max: 5000000
    },
    averageRating: 4.7,
    totalReviews: 5432,
    tags: ['beach', 'surfing', 'temple', 'culture', 'yoga'],
    location: {
      latitude: -8.3405,
      longitude: 115.0920
    }
  },
  {
    name: 'Nusa Penida',
    country: 'Indonesia',
    city: 'Bali',
    category: 'Pantai',
    description: 'Pulau cantik dengan tebing dramatis dan pantai tersembunyi. Kelingking Beach dengan formasi karang T-Rex yang ikonik.',
    imageUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bnVzYSUyMHBlbmlkYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 400000,
      max: 2000000
    },
    averageRating: 4.8,
    totalReviews: 1543,
    tags: ['cliff', 'beach', 'instagram', 'snorkeling'],
    location: {
      latitude: -8.7293,
      longitude: 115.5444
    }
  },
  {
    name: 'Prambanan',
    country: 'Indonesia',
    city: 'Yogyakarta',
    category: 'Sejarah',
    description: 'Kompleks candi Hindu terbesar di Indonesia. Arsitektur megah dengan relief Ramayana yang menakjubkan.',
    imageUrl: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJhbWJhbmFufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 200000,
      max: 1000000
    },
    averageRating: 4.6,
    totalReviews: 1876,
    tags: ['culture', 'temple', 'art', 'unesco'],
    location: {
      latitude: -7.7520,
      longitude: 110.4915
    }
  },
  {
    name: 'Gili Trawangan',
    country: 'Indonesia',
    city: 'Lombok',
    category: 'Pantai',
    description: 'Pulau kecil tanpa kendaraan bermotor dengan pantai pasir putih. Spot snorkeling dan diving yang luar biasa dengan kehidupan laut yang kaya.',
    imageUrl: 'https://images.unsplash.com/photo-1619681216575-d6b3964fc278?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lsaSUyMHRyYXdhbmdhbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 400000,
      max: 3000000
    },
    averageRating: 4.7,
    totalReviews: 923,
    tags: ['beach', 'diving', 'party', 'turtle'],
    location: {
      latitude: -8.3500,
      longitude: 116.0428
    }
  },
  {
    name: 'Labuan Bajo',
    country: 'Indonesia',
    city: 'Nusa Tenggara Timur',
    category: 'Petualangan',
    description: 'Gerbang menuju Pulau Komodo dengan pemandangan sunset yang memukau. Base camp untuk island hopping di kawasan Taman Nasional Komodo.',
    imageUrl: 'https://images.unsplash.com/photo-1589309736404-2e142a2acdf0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFidWFuJTIwYmFqb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 1500000,
      max: 5000000
    },
    averageRating: 4.8,
    totalReviews: 782,
    tags: ['island hopping', 'sunset', 'sailing', 'adventure'],
    location: {
      latitude: -8.4961,
      longitude: 119.8879
    }
  },
  {
    name: 'Bunaken',
    country: 'Indonesia',
    city: 'Sulawesi Utara',
    category: 'Pantai',
    description: 'Taman laut dengan keanekaragaman terumbu karang yang luar biasa. Surga diving dengan visibility tinggi dan marine life yang kaya.',
    imageUrl: 'https://images.unsplash.com/photo-1715899735604-10c58aabd39f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVuYWtlbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 1000000,
      max: 4000000
    },
    averageRating: 4.8,
    totalReviews: 567,
    tags: ['diving', 'snorkeling', 'marine park', 'coral reef'],
    location: {
      latitude: 1.6170,
      longitude: 124.7634
    }
  },
  {
    name: 'Kawah Ijen',
    country: 'Indonesia',
    city: 'Jawa Timur',
    category: 'Gunung',
    description: 'Kawah dengan api biru yang fenomenal dan danau kawah berwarna tosca. Trekking menantang dengan pemandangan yang tidak akan terlupakan.',
    imageUrl: 'https://images.unsplash.com/photo-1536146094120-8d7fcbc4c45b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2F3YWglMjBpamVufGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600',  // ← GANTI INI
    price: {
      currency: 'IDR',
      min: 300000,
      max: 1500000
    },
    averageRating: 4.9,
    totalReviews: 654,
    tags: ['volcano', 'blue fire', 'trekking', 'sulfur'],
    location: {
      latitude: -8.0587,
      longitude: 114.2425
    }
  }
];

async function seedDestinations() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/wanderly';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.name);

    // Clear existing destinations
    const deleteResult = await Destination.deleteMany({});
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing destinations`);

    // Insert new destinations
    const inserted = await Destination.insertMany(indonesiaDestinations);
    console.log(`✅ Successfully seeded ${inserted.length} Indonesian destinations`);

    // Show summary
    console.log('\n📊 Destinations Summary:');
    console.log('='.repeat(60));
    for (const dest of inserted) {
      console.log(`✓ ${dest.name.padEnd(20)} | ${dest.city.padEnd(20)} | ⭐ ${dest.averageRating}`);
    }
    console.log('='.repeat(60));

    console.log('\n✅ Seeding completed successfully!');
    console.log('💡 Next: Restart your backend server (npm run dev)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDestinations();