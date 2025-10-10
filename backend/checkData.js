const mongoose = require('mongoose');
require('dotenv').config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Collections:', collections.map(c => c.name));
    
    // Count destinations
    const count = await db.collection('destinations').countDocuments();
    console.log(`\n📊 Total destinations: ${count}`);
    
    // Show first destination
    const first = await db.collection('destinations').findOne();
    console.log('\n📄 First destination:', JSON.stringify(first, null, 2));
    
    // Show all destination names
    const all = await db.collection('destinations').find({}, { projection: { name: 1, category: 1, country: 1 } }).toArray();
    console.log('\n📋 All destinations:');
    all.forEach((dest, i) => {
      console.log(`   ${i + 1}. ${dest.name} (${dest.category}) - ${dest.country}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkData();