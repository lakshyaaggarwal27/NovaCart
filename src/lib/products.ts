import smartphones from "@/assets/cat-smartphones.jpg";
import laptops from "@/assets/cat-laptops.jpg";
import gaming from "@/assets/cat-gaming.jpg";
import watches from "@/assets/cat-watches.jpg";
import cameras from "@/assets/cat-cameras.jpg";
import audio from "@/assets/cat-audio.jpg";
import accessories from "@/assets/cat-accessories.jpg";
import smarthome from "@/assets/cat-smarthome.jpg";

export type CategoryId =
  | "smartphones"
  | "laptops"
  | "gaming"
  | "watches"
  | "cameras"
  | "audio"
  | "accessories"
  | "smarthome";

export type Category = {
  id: CategoryId;
  name: string;
  image: string;
  blurb: string;
};

export const categories: Category[] = [
  { id: "smartphones", name: "Smartphones", image: smartphones, blurb: "Flagship phones" },
  { id: "laptops", name: "Laptops", image: laptops, blurb: "Pro workstations" },
  { id: "gaming", name: "Gaming", image: gaming, blurb: "Consoles & gear" },
  { id: "watches", name: "Smart Watches", image: watches, blurb: "Wearables" },
  { id: "cameras", name: "Cameras", image: cameras, blurb: "Mirrorless & DSLR" },
  { id: "audio", name: "Audio", image: audio, blurb: "Headphones & buds" },
  { id: "accessories", name: "Accessories", image: accessories, blurb: "Cables & chargers" },
  { id: "smarthome", name: "Smart Home", image: smarthome, blurb: "Connected living" },
];

export const categoryImage: Record<CategoryId, string> = {
  smartphones, laptops, gaming, watches, cameras, audio, accessories, smarthome,
};

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: CategoryId;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  badge?: "Trending" | "Best Seller" | "New" | "Flash";
  description: string;
  specs: Record<string, string>;
};

type Seed = {
  title: string;
  brand: string;
  category: CategoryId;
  price: number;
  discount: number; // percent off
  rating: number;
  reviews: number;
  stock: number;
  badge?: Product["badge"];
  description: string;
  specs: Record<string, string>;
};

const seeds: Seed[] = [
  // Smartphones (10)
  { title: "iPhone 17 Pro Max", brand: "Apple", category: "smartphones", price: 1499, discount: 8, rating: 4.9, reviews: 412, stock: 24, badge: "Trending",
    description: "Titanium flagship with the A19 Pro chip, ProMotion display, and pro-grade triple camera.",
    specs: { Display: "6.9\" ProMotion OLED", Chip: "A19 Pro", Storage: "256GB", Camera: "48MP Triple", Battery: "4800 mAh" } },
  { title: "Samsung Galaxy S26 Ultra", brand: "Samsung", category: "smartphones", price: 1399, discount: 12, rating: 4.8, reviews: 388, stock: 31, badge: "Best Seller",
    description: "200MP camera, S-Pen integration and a stunning Dynamic AMOLED 2X panel.",
    specs: { Display: "6.9\" QHD+ AMOLED", Chip: "Snapdragon 8 Elite", Storage: "512GB", Camera: "200MP Quad", Battery: "5200 mAh" } },
  { title: "Google Pixel 11 Pro", brand: "Google", category: "smartphones", price: 1199, discount: 10, rating: 4.7, reviews: 264, stock: 18,
    description: "Computational photography powered by Tensor G5 with 7 years of OS updates.",
    specs: { Display: "6.7\" LTPO OLED", Chip: "Tensor G5", Storage: "256GB", Camera: "50MP Triple", Battery: "5000 mAh" } },
  { title: "OnePlus 15 Pro", brand: "OnePlus", category: "smartphones", price: 999, discount: 15, rating: 4.6, reviews: 192, stock: 40,
    description: "100W SuperVOOC, Hasselblad cameras, and silky 120Hz gaming.",
    specs: { Display: "6.8\" AMOLED 120Hz", Chip: "Snapdragon 8 Elite", Storage: "256GB", Camera: "50MP Hasselblad", Battery: "5500 mAh" } },
  { title: "Nothing Phone 4", brand: "Nothing", category: "smartphones", price: 699, discount: 5, rating: 4.5, reviews: 148, stock: 55, badge: "New",
    description: "Iconic Glyph interface with a transparent design and refined Nothing OS.",
    specs: { Display: "6.7\" AMOLED", Chip: "Snapdragon 8s Gen 4", Storage: "256GB", Camera: "50MP Dual", Battery: "5000 mAh" } },
  { title: "Xiaomi 16 Ultra", brand: "Xiaomi", category: "smartphones", price: 1099, discount: 18, rating: 4.7, reviews: 211, stock: 22,
    description: "Leica-tuned cameras, 1\" main sensor, and 120W HyperCharge.",
    specs: { Display: "6.8\" LTPO AMOLED", Chip: "Snapdragon 8 Elite", Storage: "512GB", Camera: "50MP Leica Quad", Battery: "5300 mAh" } },
  { title: "Sony Xperia 1 VII", brand: "Sony", category: "smartphones", price: 1299, discount: 7, rating: 4.5, reviews: 96, stock: 15,
    description: "4K HDR OLED display tuned by Sony's cinema and audio engineers.",
    specs: { Display: "6.5\" 4K OLED", Chip: "Snapdragon 8 Elite", Storage: "512GB", Camera: "48MP Triple", Battery: "5000 mAh" } },
  { title: "Motorola Edge 60 Pro", brand: "Motorola", category: "smartphones", price: 599, discount: 20, rating: 4.4, reviews: 132, stock: 70, badge: "Flash",
    description: "Curved pOLED display with 165Hz refresh and 125W TurboPower charging.",
    specs: { Display: "6.7\" pOLED 165Hz", Chip: "Dimensity 9300", Storage: "256GB", Camera: "50MP Triple", Battery: "4500 mAh" } },
  { title: "Asus ROG Phone 9", brand: "Asus", category: "smartphones", price: 1199, discount: 10, rating: 4.6, reviews: 88, stock: 26,
    description: "The ultimate gaming phone with AeroActive cooling and shoulder triggers.",
    specs: { Display: "6.78\" AMOLED 165Hz", Chip: "Snapdragon 8 Elite", Storage: "512GB", Camera: "50MP Triple", Battery: "6000 mAh" } },
  { title: "Vivo X200 Pro", brand: "Vivo", category: "smartphones", price: 1099, discount: 14, rating: 4.6, reviews: 174, stock: 33,
    description: "Zeiss optics with periscope telephoto and class-leading low-light.",
    specs: { Display: "6.78\" LTPO AMOLED", Chip: "Dimensity 9400", Storage: "512GB", Camera: "50MP Zeiss Triple", Battery: "6000 mAh" } },

  // Laptops (10)
  { title: "MacBook Pro M6 16\"", brand: "Apple", category: "laptops", price: 2799, discount: 6, rating: 4.9, reviews: 322, stock: 14, badge: "Trending",
    description: "Apple silicon M6 Pro, Liquid Retina XDR display, and 24-hour battery.",
    specs: { Display: "16\" Liquid Retina XDR", Chip: "Apple M6 Pro", RAM: "32GB", Storage: "1TB SSD", Battery: "100Wh" } },
  { title: "Dell XPS 15 (2026)", brand: "Dell", category: "laptops", price: 2199, discount: 12, rating: 4.7, reviews: 188, stock: 21,
    description: "Ultra-thin chassis with Core Ultra 9 and RTX 4070 graphics.",
    specs: { Display: "15.6\" OLED 3.5K", CPU: "Intel Core Ultra 9", GPU: "RTX 4070", RAM: "32GB", Storage: "1TB SSD" } },
  { title: "HP Spectre x360 14", brand: "HP", category: "laptops", price: 1599, discount: 15, rating: 4.6, reviews: 142, stock: 28,
    description: "Convertible 2-in-1 with premium gem-cut design and OLED touch display.",
    specs: { Display: "14\" OLED Touch", CPU: "Core Ultra 7", RAM: "16GB", Storage: "1TB SSD", Battery: "17h" } },
  { title: "ASUS ROG Zephyrus G16", brand: "ASUS", category: "laptops", price: 2499, discount: 10, rating: 4.8, reviews: 264, stock: 12, badge: "Best Seller",
    description: "Slim gaming powerhouse with RTX 4080 and Nebula OLED display.",
    specs: { Display: "16\" QHD+ OLED 240Hz", CPU: "Ryzen 9 8945HS", GPU: "RTX 4080", RAM: "32GB", Storage: "2TB SSD" } },
  { title: "Lenovo Legion Pro 7i", brand: "Lenovo", category: "laptops", price: 2299, discount: 14, rating: 4.7, reviews: 198, stock: 16,
    description: "Pro-tier gaming laptop with Coldfront cooling and RTX 4080.",
    specs: { Display: "16\" QHD+ 240Hz", CPU: "Core i9 14900HX", GPU: "RTX 4080", RAM: "32GB", Storage: "1TB SSD" } },
  { title: "Microsoft Surface Laptop 7", brand: "Microsoft", category: "laptops", price: 1499, discount: 8, rating: 4.6, reviews: 121, stock: 33,
    description: "Snapdragon X Elite Copilot+ PC with all-day battery life.",
    specs: { Display: "13.8\" PixelSense", CPU: "Snapdragon X Elite", RAM: "16GB", Storage: "512GB SSD", Battery: "20h" } },
  { title: "Razer Blade 16", brand: "Razer", category: "laptops", price: 3199, discount: 10, rating: 4.7, reviews: 108, stock: 9,
    description: "Dual-mode Mini-LED display and RTX 4090 in a CNC aluminum chassis.",
    specs: { Display: "16\" Dual-Mode Mini-LED", CPU: "Core i9 14900HX", GPU: "RTX 4090", RAM: "32GB", Storage: "2TB SSD" } },
  { title: "LG Gram Pro 17", brand: "LG", category: "laptops", price: 1799, discount: 11, rating: 4.5, reviews: 76, stock: 24,
    description: "Ultra-light 17\" laptop weighing under 1.5kg with OLED panel.",
    specs: { Display: "17\" OLED", CPU: "Core Ultra 7", RAM: "16GB", Storage: "1TB SSD", Battery: "22h" } },
  { title: "Acer Predator Helios 18", brand: "Acer", category: "laptops", price: 2599, discount: 18, rating: 4.5, reviews: 92, stock: 11, badge: "Flash",
    description: "Massive 18\" Mini-LED gaming flagship with vapor chamber cooling.",
    specs: { Display: "18\" Mini-LED 250Hz", CPU: "Core i9 14900HX", GPU: "RTX 4090", RAM: "32GB", Storage: "2TB SSD" } },
  { title: "Framework Laptop 16", brand: "Framework", category: "laptops", price: 1899, discount: 5, rating: 4.6, reviews: 64, stock: 18, badge: "New",
    description: "Fully modular and upgradable laptop with swappable expansion bays.",
    specs: { Display: "16\" QHD+ 165Hz", CPU: "Ryzen 9 7940HS", GPU: "Radeon RX 7700S", RAM: "32GB", Storage: "1TB SSD" } },

  // Watches (8)
  { title: "Apple Watch Ultra 3", brand: "Apple", category: "watches", price: 799, discount: 8, rating: 4.8, reviews: 244, stock: 35, badge: "Trending",
    description: "Rugged titanium case, dual-frequency GPS, and 36-hour battery.",
    specs: { Case: "49mm Titanium", Display: "Always-On Retina", Battery: "36h", Water: "100m" } },
  { title: "Samsung Galaxy Watch 8", brand: "Samsung", category: "watches", price: 399, discount: 12, rating: 4.6, reviews: 178, stock: 48,
    description: "Advanced health sensors with sleep apnea detection and BioActive sensor.",
    specs: { Case: "44mm Aluminum", Display: "Super AMOLED", Battery: "40h", Water: "5 ATM" } },
  { title: "Garmin Fenix 9", brand: "Garmin", category: "watches", price: 899, discount: 5, rating: 4.9, reviews: 312, stock: 19,
    description: "Multisport GPS watch with solar charging and topographic maps.",
    specs: { Case: "47mm Titanium", Display: "MIP Solar", Battery: "21 days", Water: "10 ATM" } },
  { title: "Nothing Watch Pro", brand: "Nothing", category: "watches", price: 199, discount: 10, rating: 4.3, reviews: 64, stock: 88, badge: "New",
    description: "Minimalist transparent design with 14-day battery life.",
    specs: { Case: "46mm Polycarbonate", Display: "AMOLED", Battery: "14 days", Water: "5 ATM" } },
  { title: "Amazfit Balance 2", brand: "Amazfit", category: "watches", price: 249, discount: 20, rating: 4.4, reviews: 142, stock: 62, badge: "Flash",
    description: "AI fitness coach with body composition analysis and 25-day battery.",
    specs: { Case: "46mm Aluminum", Display: "AMOLED", Battery: "25 days", Water: "5 ATM" } },
  { title: "Google Pixel Watch 4", brand: "Google", category: "watches", price: 399, discount: 9, rating: 4.5, reviews: 96, stock: 41,
    description: "Fitbit health tracking with Wear OS 5 and emergency SOS.",
    specs: { Case: "41mm Aluminum", Display: "Dome AMOLED", Battery: "30h", Water: "5 ATM" } },
  { title: "Polar Vantage V4", brand: "Polar", category: "watches", price: 599, discount: 7, rating: 4.6, reviews: 58, stock: 17,
    description: "Pro athlete-grade training watch with dual-frequency GPS.",
    specs: { Case: "47mm Aluminum", Display: "AMOLED", Battery: "10 days", Water: "10 ATM" } },
  { title: "Huawei Watch GT 6", brand: "Huawei", category: "watches", price: 349, discount: 14, rating: 4.4, reviews: 88, stock: 53,
    description: "Sleek dual-chip architecture with 14-day battery and sapphire glass.",
    specs: { Case: "46mm Stainless", Display: "AMOLED", Battery: "14 days", Water: "5 ATM" } },

  // Audio (10)
  { title: "AirPods Pro 3", brand: "Apple", category: "audio", price: 249, discount: 8, rating: 4.8, reviews: 482, stock: 120, badge: "Best Seller",
    description: "Adaptive ANC, personalized spatial audio and USB-C MagSafe case.",
    specs: { Driver: "Custom Apple", ANC: "Adaptive", Battery: "6h + 30h case", Water: "IP54" } },
  { title: "Sony WH-1000XM7", brand: "Sony", category: "audio", price: 449, discount: 10, rating: 4.9, reviews: 388, stock: 44, badge: "Trending",
    description: "Industry-leading noise cancellation with 30-hour battery and LDAC.",
    specs: { Driver: "30mm", ANC: "Dual processor", Battery: "30h", Codec: "LDAC, AAC" } },
  { title: "Bose QuietComfort Ultra 2", brand: "Bose", category: "audio", price: 429, discount: 12, rating: 4.7, reviews: 256, stock: 38,
    description: "Immersive Audio with personalized noise cancellation.",
    specs: { Driver: "Proprietary", ANC: "Active", Battery: "24h", Weight: "254g" } },
  { title: "JBL Live 770NC", brand: "JBL", category: "audio", price: 199, discount: 18, rating: 4.4, reviews: 142, stock: 72, badge: "Flash",
    description: "Adaptive Noise Cancelling with 65-hour battery life.",
    specs: { Driver: "40mm", ANC: "Adaptive", Battery: "65h", Codec: "LDAC" } },
  { title: "Sennheiser Momentum 5", brand: "Sennheiser", category: "audio", price: 479, discount: 6, rating: 4.7, reviews: 96, stock: 22,
    description: "Audiophile sound with 60-hour battery and adaptive ANC.",
    specs: { Driver: "42mm", ANC: "Adaptive", Battery: "60h", Codec: "aptX Adaptive" } },
  { title: "Bose QC Earbuds Ultra", brand: "Bose", category: "audio", price: 299, discount: 10, rating: 4.6, reviews: 198, stock: 56,
    description: "True wireless earbuds with Immersive Audio and CustomTune.",
    specs: { Driver: "9.3mm", ANC: "Active", Battery: "6h + 24h case", Water: "IPX4" } },
  { title: "Samsung Galaxy Buds 4 Pro", brand: "Samsung", category: "audio", price: 229, discount: 14, rating: 4.5, reviews: 168, stock: 81,
    description: "24-bit Hi-Fi audio with intelligent ANC and seamless switching.",
    specs: { Driver: "Dual coaxial", ANC: "Active", Battery: "7h + 22h case", Water: "IP57" } },
  { title: "Sonos Ace", brand: "Sonos", category: "audio", price: 449, discount: 7, rating: 4.6, reviews: 88, stock: 24,
    description: "Premium headphones with TV Audio Swap and 30-hour battery.",
    specs: { Driver: "40mm", ANC: "Active", Battery: "30h", Codec: "aptX Lossless" } },
  { title: "Marshall Major V", brand: "Marshall", category: "audio", price: 159, discount: 15, rating: 4.4, reviews: 124, stock: 95,
    description: "Iconic rock 'n' roll design with 100+ hour battery.",
    specs: { Driver: "40mm", ANC: "No", Battery: "100h", Codec: "SBC, AAC" } },
  { title: "Beats Studio Pro 2", brand: "Beats", category: "audio", price: 349, discount: 11, rating: 4.5, reviews: 152, stock: 47,
    description: "Personalized spatial audio with USB-C lossless playback.",
    specs: { Driver: "40mm", ANC: "Active", Battery: "40h", Codec: "USB-C Lossless" } },

  // Gaming (8)
  { title: "PlayStation 6", brand: "Sony", category: "gaming", price: 599, discount: 0, rating: 4.9, reviews: 1024, stock: 8, badge: "New",
    description: "Next-gen console with 8K gaming, ray tracing 2.0 and ultra-fast SSD.",
    specs: { CPU: "AMD Zen 5", GPU: "RDNA 4", Storage: "2TB NVMe", Resolution: "Up to 8K" } },
  { title: "Xbox Series X Pro", brand: "Microsoft", category: "gaming", price: 649, discount: 5, rating: 4.8, reviews: 612, stock: 14, badge: "Trending",
    description: "Most powerful Xbox ever with 16GB GDDR7 and Quick Resume.",
    specs: { CPU: "AMD Zen 5", GPU: "RDNA 4", Storage: "2TB NVMe", Resolution: "8K" } },
  { title: "Nintendo Switch 2", brand: "Nintendo", category: "gaming", price: 399, discount: 0, rating: 4.7, reviews: 488, stock: 23, badge: "Best Seller",
    description: "Hybrid console with bigger OLED display and magnetic Joy-Con 2.",
    specs: { Display: "8\" OLED HDR", Chip: "NVIDIA Custom T239", Storage: "256GB", Battery: "9h" } },
  { title: "Steam Deck OLED 2TB", brand: "Valve", category: "gaming", price: 749, discount: 8, rating: 4.7, reviews: 312, stock: 18,
    description: "Premium handheld PC gaming with vibrant HDR OLED display.",
    specs: { Display: "7.4\" HDR OLED", Chip: "Custom AMD APU", Storage: "2TB NVMe", Battery: "12h" } },
  { title: "Logitech G Pro X Superlight 2", brand: "Logitech", category: "gaming", price: 159, discount: 12, rating: 4.8, reviews: 244, stock: 88,
    description: "Esports-grade wireless mouse with HERO 2 sensor at 60g.",
    specs: { Sensor: "HERO 2 32K DPI", Weight: "60g", Battery: "95h", Connection: "Lightspeed" } },
  { title: "Razer BlackWidow V5 Pro", brand: "Razer", category: "gaming", price: 229, discount: 10, rating: 4.6, reviews: 188, stock: 52,
    description: "Mechanical keyboard with Razer Green switches and Chroma RGB.",
    specs: { Switches: "Razer Green", Layout: "Full size", Backlight: "Chroma RGB", Wrist: "Plush leatherette" } },
  { title: "Meta Quest 4", brand: "Meta", category: "gaming", price: 599, discount: 6, rating: 4.6, reviews: 196, stock: 34, badge: "New",
    description: "Mixed reality headset with Snapdragon XR3 and 4K per eye.",
    specs: { Display: "4K per eye", Chip: "Snapdragon XR3", Storage: "512GB", Tracking: "Inside-out" } },
  { title: "ASUS ROG Ally X 2", brand: "ASUS", category: "gaming", price: 849, discount: 9, rating: 4.5, reviews: 132, stock: 21,
    description: "Windows handheld gaming PC with Ryzen Z2 Extreme.",
    specs: { Display: "7\" 1080p 144Hz", Chip: "Ryzen Z2 Extreme", Storage: "1TB NVMe", Battery: "12h" } },

  // Cameras (6)
  { title: "Sony Alpha A7 V", brand: "Sony", category: "cameras", price: 2799, discount: 7, rating: 4.8, reviews: 188, stock: 12,
    description: "Full-frame mirrorless with AI-powered autofocus and 8K video.",
    specs: { Sensor: "33MP Full-frame", Video: "8K 30p", AF: "759 AI points", Stabilization: "8 stops IBIS" } },
  { title: "Canon EOS R6 Mark III", brand: "Canon", category: "cameras", price: 2499, discount: 10, rating: 4.7, reviews: 156, stock: 16,
    description: "Hybrid mirrorless with 40fps burst and 6K RAW video.",
    specs: { Sensor: "24MP Full-frame", Video: "6K RAW", Burst: "40fps", Stabilization: "8 stops IBIS" } },
  { title: "Fujifilm X-T6", brand: "Fujifilm", category: "cameras", price: 1799, discount: 8, rating: 4.7, reviews: 122, stock: 19,
    description: "APS-C powerhouse with film simulations and weather sealing.",
    specs: { Sensor: "40MP APS-C X-Trans", Video: "6K 30p", Stabilization: "7 stops IBIS", Burst: "20fps" } },
  { title: "Nikon Z8 II", brand: "Nikon", category: "cameras", price: 3499, discount: 6, rating: 4.8, reviews: 88, stock: 9,
    description: "Pro mirrorless with stacked sensor and 8K60 N-RAW.",
    specs: { Sensor: "45MP Stacked", Video: "8K 60p N-RAW", AF: "493 points", Burst: "120fps" } },
  { title: "GoPro HERO 14 Black", brand: "GoPro", category: "cameras", price: 449, discount: 12, rating: 4.5, reviews: 244, stock: 64,
    description: "5.7K60 action cam with HyperSmooth 7.0 and 1/1.3\" sensor.",
    specs: { Video: "5.7K 60p", Stabilization: "HyperSmooth 7.0", Water: "10m", Weight: "153g" } },
  { title: "DJI Osmo Pocket 4", brand: "DJI", category: "cameras", price: 549, discount: 10, rating: 4.6, reviews: 138, stock: 47,
    description: "Pocket gimbal camera with 1\" sensor and 4K120 ProRes.",
    specs: { Sensor: "1\" CMOS", Video: "4K 120p", Gimbal: "3-axis", Battery: "166 min" } },

  // Accessories (10)
  { title: "Anker 737 Power Bank", brand: "Anker", category: "accessories", price: 149, discount: 25, rating: 4.7, reviews: 488, stock: 134, badge: "Flash",
    description: "24,000mAh 140W power bank with smart display.",
    specs: { Capacity: "24000mAh", Output: "140W PD", Ports: "2x USB-C, 1x USB-A", Display: "Smart" } },
  { title: "Apple MagSafe Charger Pro", brand: "Apple", category: "accessories", price: 49, discount: 0, rating: 4.5, reviews: 322, stock: 220,
    description: "Fast 25W MagSafe wireless charging for iPhone.",
    specs: { Power: "25W", Type: "Wireless MagSafe", Cable: "1m USB-C", Material: "Aluminum" } },
  { title: "Belkin BoostCharge 6-in-1", brand: "Belkin", category: "accessories", price: 99, discount: 12, rating: 4.5, reviews: 184, stock: 72,
    description: "USB-C hub with HDMI, Ethernet, SD card reader, and 100W PD.",
    specs: { Ports: "USB-C x2, USB-A x2, HDMI, SD", Power: "100W PD", Output: "4K60 HDMI" } },
  { title: "UGreen Nexode 300W GaN", brand: "UGreen", category: "accessories", price: 199, discount: 15, rating: 4.7, reviews: 244, stock: 56,
    description: "5-port GaN III desktop charger powers laptops and phones.",
    specs: { Power: "300W", Ports: "4x USB-C, 1x USB-A", Tech: "GaN III", Display: "Smart" } },
  { title: "Samsung 990 Pro 2TB SSD", brand: "Samsung", category: "accessories", price: 229, discount: 18, rating: 4.8, reviews: 388, stock: 98,
    description: "PCIe 4.0 NVMe SSD with up to 7,450 MB/s read speeds.",
    specs: { Capacity: "2TB", Interface: "PCIe 4.0 NVMe", Read: "7450 MB/s", Write: "6900 MB/s" } },
  { title: "Logitech MX Master 4", brand: "Logitech", category: "accessories", price: 129, discount: 10, rating: 4.8, reviews: 412, stock: 142,
    description: "Iconic productivity mouse with MagSpeed wheel and 70-day battery.",
    specs: { Sensor: "Darkfield 8000 DPI", Battery: "70 days", Connection: "Bluetooth + USB-C", Buttons: "7 customizable" } },
  { title: "Keychron Q1 Max", brand: "Keychron", category: "accessories", price: 219, discount: 8, rating: 4.7, reviews: 198, stock: 38,
    description: "Aluminum mechanical keyboard with hot-swap switches and wireless.",
    specs: { Layout: "75% QMK/VIA", Switches: "Hot-swap", Connection: "Wireless + USB-C", Material: "Aluminum" } },
  { title: "PNY 1TB MicroSD Express", brand: "PNY", category: "accessories", price: 119, discount: 14, rating: 4.5, reviews: 88, stock: 110,
    description: "Lightning-fast microSD Express for Switch 2 and pro cameras.",
    specs: { Capacity: "1TB", Type: "microSD Express", Read: "880 MB/s", Class: "U3 V90" } },
  { title: "Twelve South BookArc Flex", brand: "Twelve South", category: "accessories", price: 79, discount: 5, rating: 4.6, reviews: 64, stock: 47,
    description: "Vertical aluminum dock for MacBook in clamshell mode.",
    specs: { Material: "Aluminum", Fit: "All MacBooks", Color: "Matte Black" } },
  { title: "Peak Design Everyday Sling 6L", brand: "Peak Design", category: "accessories", price: 99, discount: 10, rating: 4.7, reviews: 122, stock: 68,
    description: "Weatherproof camera and tech sling for everyday carry.",
    specs: { Volume: "6L", Material: "Recycled nylon", Weather: "Weatherproof", Color: "Black" } },

  // Smart Home (8)
  { title: "Amazon Echo Studio 2", brand: "Amazon", category: "smarthome", price: 229, discount: 13, rating: 4.5, reviews: 244, stock: 88,
    description: "Spatial audio smart speaker with Dolby Atmos and Alexa+.",
    specs: { Audio: "Dolby Atmos", Assistant: "Alexa+", Connectivity: "Wi-Fi 6, Thread, Matter" } },
  { title: "Google Nest Hub Max 2", brand: "Google", category: "smarthome", price: 249, discount: 10, rating: 4.5, reviews: 188, stock: 64,
    description: "10\" smart display with Gemini, Face Match and video calling.",
    specs: { Display: "10\" HD", Assistant: "Gemini", Camera: "Wide-angle 6MP", Audio: "Stereo" } },
  { title: "Apple HomePod 3", brand: "Apple", category: "smarthome", price: 299, discount: 8, rating: 4.6, reviews: 122, stock: 42,
    description: "Spatial audio and room sensing with Siri Apple Intelligence.",
    specs: { Audio: "Spatial Audio", Assistant: "Siri Apple Intelligence", Connectivity: "Wi-Fi 6E, Thread, Matter" } },
  { title: "Philips Hue Festavia", brand: "Philips", category: "smarthome", price: 179, discount: 15, rating: 4.7, reviews: 322, stock: 124, badge: "Flash",
    description: "Smart string lights with Gradient effects and music sync.",
    specs: { Lights: "250 LEDs", Length: "20m", Connection: "Zigbee + Bluetooth" } },
  { title: "Nest Learning Thermostat 5", brand: "Google", category: "smarthome", price: 279, discount: 7, rating: 4.6, reviews: 188, stock: 55,
    description: "AI-powered thermostat with redesigned display and Matter support.",
    specs: { Display: "Soli Radar", Connectivity: "Wi-Fi 6, Matter, Thread", Sensors: "Humidity, Motion" } },
  { title: "Aqara Camera Hub G5 Pro", brand: "Aqara", category: "smarthome", price: 199, discount: 12, rating: 4.5, reviews: 96, stock: 73,
    description: "4K HomeKit Secure Video camera and Matter/Thread hub.",
    specs: { Video: "4K HDR", Hub: "Zigbee 3.0 + Matter", AI: "On-device", Mount: "Indoor/Outdoor" } },
  { title: "Eufy RoboVac X11 Omni", brand: "Eufy", category: "smarthome", price: 999, discount: 20, rating: 4.6, reviews: 178, stock: 28, badge: "Flash",
    description: "All-in-one robot vac and mop with auto wash, dry, and refill.",
    specs: { Suction: "12000 Pa", Mop: "Self-wash + dry", Bin: "Auto empty", Mapping: "LiDAR" } },
  { title: "Ecobee Smart Doorbell 2", brand: "Ecobee", category: "smarthome", price: 179, discount: 10, rating: 4.4, reviews: 64, stock: 96, badge: "New",
    description: "1:1 video doorbell with HomeKit Secure Video and radar motion.",
    specs: { Video: "1:1 1440p HDR", Detection: "Radar + AI", Storage: "iCloud / Local", Power: "Wired" } },
];

// Convert seed USD price to a realistic INR price ending in ...99.
function toInr(usd: number): number {
  const raw = usd * 90;
  return Math.max(99, Math.round(raw / 100) * 100 - 1);
}

function makeProduct(seed: Seed, idx: number): Product {
  const price = toInr(seed.price);
  const original = Math.round(price / (1 - seed.discount / 100));
  return {
    id: `nv-${idx + 1}`,
    title: seed.title,
    brand: seed.brand,
    category: seed.category,
    price,
    originalPrice: seed.discount > 0 ? original : price,
    rating: seed.rating,
    reviews: seed.reviews,
    stock: seed.stock,
    image: categoryImage[seed.category],
    badge: seed.badge,
    description: seed.description,
    specs: seed.specs,
  };
}

export const products: Product[] = seeds.map(makeProduct);

export const findProduct = (id: string) => products.find((p) => p.id === id);

// Indian Rupee formatting with Indian digit grouping (e.g. ₹1,24,999).
export const formatPrice = (n: number) =>
  n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
