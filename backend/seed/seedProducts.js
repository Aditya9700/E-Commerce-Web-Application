require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// -------------------------------------------------------------------
// Seed Data: 8 Mobiles + 8 Laptops with realistic details
// Images use placehold.co as placeholder URLs (no external dependency)
// -------------------------------------------------------------------

const products = [
  // ──────────────── MOBILES ────────────────
  {
    title: 'iPhone 15',
    description:
      'Apple iPhone 15 with 6.1-inch Super Retina XDR display, A16 Bionic chip, 48MP main camera, Dynamic Island, and USB-C connectivity. Comes in 5 stunning colors.',
    price: 79999,
    image: 'https://placehold.co/400x400/1a1a2e/ffffff?text=iPhone+15',
    category: 'mobile',
    stock: 45,
  },
  {
    title: 'Samsung Galaxy S25',
    description:
      'Samsung Galaxy S25 with Snapdragon 8 Elite processor, 6.2-inch Dynamic AMOLED 2X display, 50MP triple camera system, and 4000mAh battery with 25W fast charging.',
    price: 80999,
    image: 'https://placehold.co/400x400/0f3460/ffffff?text=Galaxy+S25',
    category: 'mobile',
    stock: 38,
  },
  {
    title: 'OnePlus 13',
    description:
      'OnePlus 13 with Snapdragon 8 Elite, 6.82-inch LTPO AMOLED display (1-120Hz), 50MP Hasselblad triple camera, 6000mAh battery, and 100W SUPERVOOC fast charging.',
    price: 69999,
    image: 'https://placehold.co/400x400/16213e/ffffff?text=OnePlus+13',
    category: 'mobile',
    stock: 52,
  },
  {
    title: 'Google Pixel 9',
    description:
      'Google Pixel 9 with Tensor G4 chip, 6.3-inch Actua display, 50MP rear camera with Google AI-powered photography, and 7 years of OS and security updates.',
    price: 74999,
    image: 'https://placehold.co/400x400/1b4332/ffffff?text=Pixel+9',
    category: 'mobile',
    stock: 30,
  },
  {
    title: 'Xiaomi 15',
    description:
      'Xiaomi 15 with Snapdragon 8 Elite, 6.36-inch LTPO AMOLED display, Leica triple camera with 50MP sensors, HyperOS 2, and 5400mAh battery with 90W HyperCharge.',
    price: 59999,
    image: 'https://placehold.co/400x400/212529/ffffff?text=Xiaomi+15',
    category: 'mobile',
    stock: 60,
  },
  {
    title: 'Nothing Phone 3',
    description:
      'Nothing Phone 3 with Snapdragon 8s Elite, iconic Glyph Interface lighting, 6.67-inch AMOLED display, 50MP triple camera, and Nothing OS 3.0 for a clean Android experience.',
    price: 54999,
    image: 'https://placehold.co/400x400/f8f9fa/000000?text=Nothing+3',
    category: 'mobile',
    stock: 25,
  },
  {
    title: 'Vivo X200',
    description:
      'Vivo X200 with Dimensity 9400 chip, 6.67-inch AMOLED display, ZEISS-tuned 50MP triple camera, 5800mAh battery with 90W FlashCharge, and IP68 water resistance.',
    price: 62999,
    image: 'https://placehold.co/400x400/264653/ffffff?text=Vivo+X200',
    category: 'mobile',
    stock: 40,
  },
  {
    title: 'OPPO Find X8',
    description:
      'OPPO Find X8 with Dimensity 9400, 6.59-inch LTPO AMOLED display, Hasselblad-tuned 50MP triple camera, 5630mAh battery with 80W SUPERVOOC, and ColorOS 15.',
    price: 67999,
    image: 'https://placehold.co/400x400/2d3a4b/ffffff?text=Find+X8',
    category: 'mobile',
    stock: 35,
  },

  // ──────────────── LAPTOPS ────────────────
  {
    title: 'MacBook Air M4',
    description:
      'Apple MacBook Air with M4 chip, 13.6-inch Liquid Retina display, 16GB unified memory, 256GB SSD, up to 18 hours battery life, and fanless design for silent performance.',
    price: 114900,
    image: 'https://placehold.co/400x400/1a1a2e/ffffff?text=MacBook+Air+M4',
    category: 'laptop',
    stock: 20,
  },
  {
    title: 'Dell XPS 13',
    description:
      'Dell XPS 13 with Intel Core Ultra 7 processor, 13.4-inch InfinityEdge OLED touch display, 32GB LPDDR5 RAM, 1TB NVMe SSD, and premium CNC machined aluminum chassis.',
    price: 129999,
    image: 'https://placehold.co/400x400/0f3460/ffffff?text=Dell+XPS+13',
    category: 'laptop',
    stock: 15,
  },
  {
    title: 'HP Victus 16',
    description:
      'HP Victus 16 gaming laptop with AMD Ryzen 7 7700HX, NVIDIA RTX 4060 8GB, 16.1-inch FHD 144Hz IPS display, 16GB DDR5 RAM, and 512GB NVMe SSD. Great entry-level gaming.',
    price: 79999,
    image: 'https://placehold.co/400x400/16213e/ffffff?text=HP+Victus',
    category: 'laptop',
    stock: 28,
  },
  {
    title: 'Lenovo Legion 5',
    description:
      'Lenovo Legion 5 with AMD Ryzen 7 7745HX, NVIDIA RTX 4070 8GB, 16-inch QHD+ 165Hz display, 32GB DDR5 RAM, 1TB SSD, and Legion ColdFront 5.0 cooling system.',
    price: 109999,
    image: 'https://placehold.co/400x400/1b4332/ffffff?text=Legion+5',
    category: 'laptop',
    stock: 18,
  },
  {
    title: 'ASUS ROG Zephyrus G14',
    description:
      'ASUS ROG Zephyrus G14 with AMD Ryzen 9 8945HS, NVIDIA RTX 4070 12GB, 14-inch QHD+ 165Hz OLED display, 32GB LPDDR5X, 1TB SSD, AniMe Matrix LED lid.',
    price: 149999,
    image: 'https://placehold.co/400x400/212529/ffffff?text=ROG+Zephyrus',
    category: 'laptop',
    stock: 12,
  },
  {
    title: 'Acer Predator Helios 16',
    description:
      'Acer Predator Helios 16 with Intel Core i9-14900HX, NVIDIA RTX 4080 12GB, 16-inch WQXGA 240Hz IPS display, 32GB DDR5 RAM, 2TB SSD, and Killer Wi-Fi 6E.',
    price: 189999,
    image: 'https://placehold.co/400x400/264653/ffffff?text=Predator+Helios',
    category: 'laptop',
    stock: 10,
  },
  {
    title: 'MSI Stealth 16',
    description:
      'MSI Stealth 16 Studio with Intel Core Ultra 9, NVIDIA RTX 4080 12GB, 16-inch QHD+ OLED 240Hz display, 64GB DDR5 RAM, 2TB NVMe SSD, and ultra-slim premium chassis.',
    price: 199999,
    image: 'https://placehold.co/400x400/2d3a4b/ffffff?text=MSI+Stealth',
    category: 'laptop',
    stock: 8,
  },
  {
    title: 'Lenovo ThinkPad X1 Carbon',
    description:
      'Lenovo ThinkPad X1 Carbon Gen 12 with Intel Core Ultra 7, 14-inch 2.8K OLED display, 32GB LPDDR5, 1TB SSD, MIL-SPEC durability, and legendary ThinkPad keyboard for professionals.',
    price: 159999,
    image: 'https://placehold.co/400x400/343a40/ffffff?text=ThinkPad+X1',
    category: 'laptop',
    stock: 14,
  },
];

// -------------------------------------------------------------------
// Run the seed script
// -------------------------------------------------------------------
const seedProducts = async () => {
  await connectDB();

  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert all seed products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${inserted.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedProducts();
