// ShopNav — Mock Data
// All prices in KZT (₸). No alcohol/tobacco/18+ products.

// ── DATABASE ARRAYS ──
let STORES = [];
let PRODUCTS = [];
let RECIPES = [];
let STOCK_PATTERNS = {};
let FRESHNESS = {};

// ── CITY SYSTEM ──
const CITIES = [
  { id: 'almaty',          name: 'Almaty',          lat: 43.238, lng: 76.945, zoom: 13 },
  { id: 'shymkent',        name: 'Shymkent',        lat: 42.317, lng: 69.595, zoom: 13 },
  { id: 'turkestan',       name: 'Turkestan',       lat: 43.297, lng: 68.268, zoom: 14 },
  { id: 'astana',          name: 'Astana',          lat: 51.169, lng: 71.449, zoom: 12 },
  { id: 'karaganda',       name: 'Karaganda',       lat: 49.802, lng: 73.102, zoom: 12 },
  { id: 'aktobe',          name: 'Aktobe',          lat: 50.284, lng: 57.167, zoom: 12 },
  { id: 'taraz',           name: 'Taraz',           lat: 42.900, lng: 71.367, zoom: 12 },
  { id: 'pavlodar',        name: 'Pavlodar',        lat: 52.300, lng: 76.950, zoom: 12 },
  { id: 'ust_kamenogorsk', name: 'Ust-Kamenogorsk', lat: 49.950, lng: 82.617, zoom: 12 },
  { id: 'semey',           name: 'Semey',           lat: 50.411, lng: 80.222, zoom: 12 },
  { id: 'atyrau',          name: 'Atyrau',          lat: 47.116, lng: 51.883, zoom: 12 },
  { id: 'kyzylorda',       name: 'Kyzylorda',       lat: 44.850, lng: 65.500, zoom: 12 },
  { id: 'uralsk',          name: 'Uralsk',          lat: 51.233, lng: 51.367, zoom: 12 },
  { id: 'kostanay',        name: 'Kostanay',        lat: 53.214, lng: 63.624, zoom: 12 },
  { id: 'petropavlovsk',   name: 'Petropavlovsk',   lat: 54.867, lng: 69.150, zoom: 12 },
  { id: 'aktau',           name: 'Aktau',           lat: 43.650, lng: 51.150, zoom: 12 },
  { id: 'kokshetau',       name: 'Kokshetau',       lat: 53.283, lng: 69.400, zoom: 12 },
  { id: 'taldykorgan',     name: 'Taldykorgan',     lat: 45.017, lng: 78.367, zoom: 12 },
  { id: 'temirtau',        name: 'Temirtau',        lat: 50.057, lng: 72.964, zoom: 12 }
];

function getSelectedCity() {
  return localStorage.getItem('shopnav_city') || 'almaty';
}

function setSelectedCity(cityId) {
  localStorage.setItem('shopnav_city', cityId);
}

function getCityInfo(cityId) {
  return CITIES.find(c => c.id === cityId) || CITIES[0];
}

// Detect nearest city from GPS coordinates using haversine
function detectCityFromCoords(lat, lng) {
  function _hav(lat1, lng1, lat2, lng2) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
  let best = CITIES[0], bestDist = Infinity;
  CITIES.forEach(c => {
    const d = _hav(lat, lng, c.lat, c.lng);
    if (d < bestDist) { bestDist = d; best = c; }
  });
  return best.id;
}

// Get stores filtered to the selected city
function getStoresForCity(cityId) {
  cityId = cityId || getSelectedCity();
  return STORES.filter(s => s.rawCity === (getCityInfo(cityId)?.name));
}

const CATEGORIES = [
  { id:'dairy', name:'cat_dairy', emoji:'🥛', count: 20, image: 'img/cat_dairy.png' },
  { id:'bakery', name:'cat_bakery', emoji:'🍞', count: 20, image: 'img/cat_bakery.png' },
  { id:'meat', name:'cat_meat', emoji:'🥩', count: 19, image: 'img/cat_meat.png' },
  { id:'veg', name:'cat_veg', emoji:'🥕', count: 8, image: 'img/cat_produce.png' },
  { id:'beverages', name:'cat_beverages', emoji:'🥤', count: 20, image: 'img/cat_beverages.png' },
  { id:'fruits', name:'cat_fruits', emoji:'🍎', count: 20, image: 'img/cat_fruits.png' },
  { id:'frozen', name:'cat_frozen', emoji:'🍕', count: 20, image: 'img/cat_frozen.png' },
  { id:'care', name:'cat_care', emoji:'🧴', count: 5, image: 'img/cat_care.png' },
  { id:'home', name:'cat_home', emoji:'🧹', count: 3, image: 'img/cat_home.png' },
  { id:'baby', name:'cat_baby', emoji:'👶', count: 20, image: 'img/cat_baby.jpg' },
  { id:'international', name:'cat_international', emoji:'🥢', count: 18, image: 'img/cat_international.jpg' },
  { id:'special_diet', name:'cat_special_diet', emoji:'🥗', count: 18, image: 'img/cat_special.jpg' },
  { id:'fitness', name:'cat_fitness', emoji:'🥑', count: 18, image: 'img/cat_fitness.png' },
  { id:'organic', name:'cat_organic', emoji:'🌿', count: 17, image: 'img/cat_organic.jpg' }
];

const _raw_STORES = [
  { id:'magnum',  name:'Magnum',       emoji:'🏪', color:'#E8445A', lat:43.238, lng:76.945, address:'Abay Ave 109, Almaty', city:'Almaty', hours:'08:00–23:00', distance:0.4 },
  { id:'small',   name:'Small',        emoji:'🛒', color:'#2D9C4A', lat:43.235, lng:76.952, address:'Seifullina St 498, Almaty', city:'Almaty', hours:'09:00–22:00', distance:0.9 },
  { id:'green',   name:'Green Market', emoji:'🌿', color:'#4A7A4D', lat:43.241, lng:76.940, address:'Al-Farabi Ave 77, Almaty', city:'Almaty', hours:'08:00–21:00', distance:1.6 },
  { id:'artem',   name:'Artem',        emoji:'🧺', color:'#C4622D', lat:43.233, lng:76.958, address:'Rozybakiev St 36, Almaty', city:'Almaty', hours:'09:00–22:00', distance:2.1 },
  { id:'kmart',   name:'K-Mart Almaty',emoji:'🥢', color:'#D32F2F', lat:43.240, lng:76.920, address:'Abay Ave 150, Almaty',   city:'Almaty', hours:'10:00–20:00', distance:1.2 },
  { id:'galmart', name:'Galmart',      emoji:'🛍️', color:'#1976D2', lat:43.232, lng:76.955, address:'Dostyk Plaza, Almaty',   city:'Almaty', hours:'09:00–23:00', distance:2.0 },
  // Turkestan stores
  { id:'magnum_turk', name:'Magnum Turkestan', emoji:'🏪', color:'#E8445A', lat:43.300, lng:68.270, address:'Tauke Khan Ave, Turkestan', city:'Turkestan', hours:'08:00–23:00', distance:1.2 },
  { id:'firkan_turk', name:'Firkan Turkestan',       emoji:'🛒', color:'#E88F44', lat:43.295, lng:68.265, address:'B. Sattarkhanov Ave, Turkestan', city:'Turkestan', hours:'09:00–22:00', distance:2.5 },
  // Shymkent stores
  { id:'magnum_shym', name:'Magnum Shymkent',  emoji:'🏪', color:'#E8445A', lat:42.315, lng:69.590, address:'Republic Ave 15, Shymkent', city:'Shymkent', hours:'08:00–23:00', distance:0.8 },
  { id:'gramad_shym', name:'Gramad Shymkent',       emoji:'🏢', color:'#2D9C4A', lat:42.320, lng:69.600, address:'Zhibek Zholy, Shymkent', city:'Shymkent', hours:'09:00–22:00', distance:1.5 },
  // Asian specialty stores
  { id:'korean_market', name:'Korean Market',  emoji:'🇰🇷', color:'#C62828', lat:43.236, lng:76.950, address:'Nazarbayev Ave 223, Almaty', city:'Almaty', hours:'10:00–21:00', distance:1.0 },
  { id:'iu_market',     name:'iU market 24',   emoji:'🏪', color:'#6A1B9A', lat:43.243, lng:76.935, address:'Abay Ave 44, Almaty',       city:'Almaty', hours:'00:00–24:00', distance:1.8 },
  { id:'emart',         name:'E-Mart',         emoji:'🇰🇷', color:'#F9A825', lat:43.230, lng:76.948, address:'Satpayev St 90, Almaty',    city:'Almaty', hours:'09:00–22:00', distance:1.4 },
  // Health & specialty store
  { id:'interfood',    name:'Interfood',      emoji:'🌱', color:'#43A047', lat:43.237, lng:76.943, address:'Tole Bi St 59, Almaty',     city:'Almaty', hours:'09:00–21:00', distance:1.3 },
  // Sports nutrition store
  { id:'powerlife',   name:'PowerLife',      emoji:'💪', color:'#FF6F00', lat:43.239, lng:76.948, address:'Zheltoksan St 115, Almaty',  city:'Almaty', hours:'10:00–21:00', distance:0.7 },
  // Shymkent specialty stores
  { id:'korean_shym',  name:'Korean Store',   emoji:'🇰🇷', color:'#C62828', lat:42.322, lng:69.585, address:'Kunayev Ave 10, Shymkent',  city:'Shymkent', hours:'10:00–20:00', distance:1.2 },
  { id:'health_shym',  name:'Healthy Food',   emoji:'🌱', color:'#43A047', lat:42.312, lng:69.598, address:'Ilyayev St 25, Shymkent',   city:'Shymkent', hours:'09:00–21:00', distance:1.1 },
  { id:'organic_shym', name:'Organic Market', emoji:'🌿', color:'#2E7D32', lat:42.308, lng:69.610, address:'Republic Ave 8, Shymkent',  city:'Shymkent', hours:'08:00–22:00', distance:1.5 },
  { id:'sports_shym',  name:'Sports Nutrition',emoji:'💪',color:'#FF6F00', lat:42.330, lng:69.580, address:'Baitursynov St 15, Shymkent',city:'Shymkent', hours:'10:00–21:00', distance:1.8 },
  // Turkestan specialty stores
  { id:'asia_turk',    name:'Asia Food Market',emoji:'🥢', color:'#D32F2F', lat:43.305, lng:68.260, address:'Yassawi St 12, Turkestan',  city:'Turkestan', hours:'10:00–20:00', distance:1.0 },
  { id:'eco_turk',     name:'Eco Food Store', emoji:'🥗', color:'#558B2F', lat:43.290, lng:68.275, address:'Taukekhan Ave 50, Turkestan', city:'Turkestan', hours:'09:00–21:00', distance:1.4 },
  { id:'fit_turk',     name:'Fitness Supps',  emoji:'🏋️', color:'#E65100', lat:43.310, lng:68.255, address:'Zhenis Park, Turkestan',   city:'Turkestan', hours:'10:00–21:00', distance:1.7 },
];

// unit: per 100g / per 100ml / per piece
const _raw_PRODUCTS = [
  { id:'p001', name:'Whole Milk 1L',        brand:'Raimbek',   category:'dairy',   image:'img/whole-milk.png', weight:'1000ml', price:{magnum:480, small:450, green:460, artem:490, magnum_turk:470, firkan_turk:446, magnum_shym:470, gramad_shym:494},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['milk','dairy','breakfast'] },
  { id:'p002', name:'Milk 800ml',           brand:'Campina',   category:'dairy',   image:'img/milk-800ml.png', weight:'800ml',  price:{magnum:390, small:370, green:0,   artem:380, magnum_turk:380, firkan_turk:361, magnum_shym:380, gramad_shym:399},           stock:{magnum:'in',small:'in',green:'out',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},  unitType:'per 100ml', tags:['milk','dairy'] },
  { id:'p003', name:'Kefir 1%  1L',         brand:'Bakers',    category:'dairy',   image:'img/kefir.png', weight:'1000ml', price:{magnum:420, small:400, green:410, artem:0, magnum_turk:410, firkan_turk:390, magnum_shym:410, gramad_shym:430},             stock:{magnum:'in',small:'in',green:'low',artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['kefir','dairy','healthy'] },
  { id:'p004', name:'Butter 200g',          brand:'President', category:'dairy',   image:'img/butter.png', weight:'200g',   price:{magnum:950, small:920, green:980, artem:900, magnum_turk:938, firkan_turk:891, magnum_shym:938, gramad_shym:985},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['butter','dairy','baking'] },
  { id:'p005', name:'Sour Cream 20% 400g',  brand:'Raimbek',   category:'dairy',   image:'img/sour-cream.png', weight:'400g',   price:{magnum:560, small:530, green:545, artem:560, magnum_turk:549, firkan_turk:522, magnum_shym:549, gramad_shym:576},           stock:{magnum:'in',small:'in',green:'in',artem:'low', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g',  tags:['sour cream','dairy'] },
  { id:'p006', name:'Cottage Cheese 200g',  brand:'Milkana',   category:'dairy',   image:'img/cottage-cheese-new.png', weight:'200g',   price:{magnum:480, small:460, green:490, artem:470, magnum_turk:475, firkan_turk:451, magnum_shym:475, gramad_shym:499},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['cottage cheese','dairy','protein'] },
  { id:'p007', name:'Cheese Edam 300g',     brand:'Hochland',  category:'dairy',   image:'img/cheese-edam-new.png', weight:'300g',   price:{magnum:1800,small:1750,green:0,   artem:0, magnum_turk:1775, firkan_turk:1686, magnum_shym:1775, gramad_shym:1864},             stock:{magnum:'in',small:'in',green:'out',artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g',  tags:['cheese','dairy'] },
  { id:'p008', name:'White Bread 550g',     brand:'Saryarka',  category:'bakery',  image:'img/white_bread_550g.png', weight:'550g',   price:{magnum:280, small:260, green:270, artem:275, magnum_turk:271, firkan_turk:257, magnum_shym:271, gramad_shym:285},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['bread','bakery','breakfast'] },
  { id:'p009', name:'Rye Bread 400g',       brand:'Zhambyl',   category:'bakery',  image:'img/rye_bread_400g.png', weight:'400g',   price:{magnum:350, small:330, green:360, artem:0, magnum_turk:347, firkan_turk:330, magnum_shym:347, gramad_shym:364},             stock:{magnum:'in',small:'in',green:'in',artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g',  tags:['rye bread','bakery','healthy'] },
  { id:'p010', name:'Buckwheat Flour 1kg',  brand:'Makfa',     category:'bakery',  image:'img/buckwheat_flour_1kg.png', weight:'1000g',  price:{magnum:850, small:790, green:920, artem:0, magnum_turk:853, firkan_turk:810, magnum_shym:853, gramad_shym:896},             stock:{magnum:'in',small:'in',green:'in',artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g',  tags:['flour','buckwheat','baking'] },
  { id:'p011', name:'All-purpose Flour 2kg',brand:'Makfa',     category:'bakery',  image:'img/all_purpose_flour_2kg.png', weight:'2000g',  price:{magnum:680, small:650, green:700, artem:660, magnum_turk:672, firkan_turk:638, magnum_shym:672, gramad_shym:706},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['flour','baking'] },
  { id:'p012', name:'Beef (1kg)',            brand:'Local Farm', category:'meat',   image:'img/beef_1kg.png', emoji:'🥩', weight:'1000g',  price:{magnum:3200,small:2950,green:3100,artem:3000, magnum_turk:3062, firkan_turk:2909, magnum_shym:3062, gramad_shym:3215},          stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['beef','meat','protein','borscht'] },
  { id:'p013', name:'Chicken Breast 1kg',   brand:'Alatau',    category:'meat',    image:'img/chicken_breast_1kg.png', emoji:'🍗', weight:'1000g',  price:{magnum:1900,small:1800,green:1950,artem:1850, magnum_turk:1875, firkan_turk:1781, magnum_shym:1875, gramad_shym:1969},          stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['chicken','meat','protein'] },
  { id:'p014', name:'Salmon Fillet 300g',   brand:'Premium',   category:'meat',    image:'img/salmon_fillet_300g.png', emoji:'🐟', weight:'300g',   price:{magnum:3500,small:0,   green:3800,artem:0, magnum_turk:3650, firkan_turk:3468, magnum_shym:3650, gramad_shym:3832},             stock:{magnum:'in',small:'out',green:'in',artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g',  tags:['fish','salmon','seafood'] },
  { id:'p015', name:'Potatoes 1kg',         brand:'Local',     category:'veg',     image:'img/veg_potatoes.png', emoji:'🥔', weight:'1000g',  price:{magnum:250, small:220, green:200, artem:230, magnum_turk:225, firkan_turk:214, magnum_shym:225, gramad_shym:236},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['potato','vegetable','borscht','plov'] },
  { id:'p016', name:'Carrots 1kg',          brand:'Local',     category:'veg',     image:'img/veg_carrots.png', emoji:'🥕', weight:'1000g',  price:{magnum:280, small:250, green:230, artem:260, magnum_turk:255, firkan_turk:242, magnum_shym:255, gramad_shym:268},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['carrot','vegetable','borscht'] },
  { id:'p017', name:'Beetroot 1kg',         brand:'Local',     category:'veg',     image:'img/veg_beetroot.png', emoji:'🫀', weight:'1000g',  price:{magnum:300, small:270, green:250, artem:280, magnum_turk:275, firkan_turk:261, magnum_shym:275, gramad_shym:289},           stock:{magnum:'in',small:'in',green:'in',artem:'low', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g',  tags:['beetroot','vegetable','borscht'] },
  { id:'p018', name:'Cabbage 1kg',          brand:'Local',     category:'veg',     image:'img/veg_cabbage.png', emoji:'🥬', weight:'1000g',  price:{magnum:200, small:180, green:170, artem:190, magnum_turk:185, firkan_turk:176, magnum_shym:185, gramad_shym:194},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['cabbage','vegetable','borscht'] },
  { id:'p019', name:'Onions 1kg',           brand:'Local',     category:'veg',     image:'img/veg_onions.png', emoji:'🧅', weight:'1000g',  price:{magnum:180, small:160, green:150, artem:170, magnum_turk:165, firkan_turk:157, magnum_shym:165, gramad_shym:173},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['onion','vegetable','borscht','plov'] },
  { id:'p020', name:'Tomato Paste 500g',    brand:'Heinz',     category:'veg',     image:'img/veg_tomato_paste.png', emoji:'🍅', weight:'500g',   price:{magnum:650, small:600, green:680, artem:620, magnum_turk:638, firkan_turk:606, magnum_shym:638, gramad_shym:670},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['tomato paste','borscht'] },
  { id:'p021', name:'Rice 2kg',             brand:'Krasnodar', category:'veg',     image:'img/veg_rice.png', emoji:'🍚', weight:'2000g',  price:{magnum:900, small:860, green:880, artem:870, magnum_turk:878, firkan_turk:834, magnum_shym:878, gramad_shym:922},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['rice','plov','grain'] },
  { id:'p022', name:'Sunflower Oil 1L',     brand:'Zolotaya',  category:'veg',     image:'img/veg_sunflower_oil.png', emoji:'🫙', weight:'1000ml', price:{magnum:750, small:720, green:760, artem:730, magnum_turk:740, firkan_turk:703, magnum_shym:740, gramad_shym:777},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['oil','cooking','plov'] },
  { id:'p023', name:'White Eggs 10pcs',     brand:'Alatau',    category:'dairy',   image:'img/white-eggs.png', weight:'10pcs',  price:{magnum:650, small:620, green:600, artem:640, magnum_turk:628, firkan_turk:597, magnum_shym:628, gramad_shym:659},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['eggs','breakfast','baking'] },
  { id:'p036', name:'Greek Yogurt 400g',    brand:'Ehrmann',   category:'dairy',   image:'img/greek-yogurt-new.png', weight:'400g', price:{magnum:650, small:620, green:640, artem:660, magnum_turk:630, firkan_turk:600, magnum_shym:630, gramad_shym:660}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['yogurt','dairy','breakfast','healthy'] },
  { id:'p037', name:'Strawberry Yogurt 150g', brand:'Lactel',  category:'dairy',   image:'img/ehrmann-yogurt.png', weight:'150g', price:{magnum:280, small:260, green:270, artem:290, magnum_turk:275, firkan_turk:260, magnum_shym:275, gramad_shym:290}, stock:{magnum:'in',small:'in',green:'in',artem:'low', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['yogurt','dairy','strawberry','breakfast'] },
  { id:'p038', name:'Drinking Yogurt 290g',  brand:'Activia',   category:'dairy',   image:'img/drinking-yogurt-new.png', weight:'290g', price:{magnum:420, small:390, green:400, artem:410, magnum_turk:410, firkan_turk:390, magnum_shym:410, gramad_shym:430}, stock:{magnum:'in',small:'in',green:'low',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['yogurt','dairy','drinking','breakfast'] },
  { id:'p039', name:'Cheese Slices 150g',    brand:'Hochland',  category:'dairy',   image:'img/cheese-slices-new.png', weight:'150g', price:{magnum:780, small:750, green:790, artem:760, magnum_turk:770, firkan_turk:730, magnum_shym:770, gramad_shym:800}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['cheese','dairy','sandwich'] },
  { id:'p040', name:'Mozzarella Cheese 125g', brand:'Galbani',  category:'dairy',   image:'img/mozzarella-cheese-new.png', weight:'125g', price:{magnum:950, small:900, green:920, artem:980, magnum_turk:930, firkan_turk:880, magnum_shym:930, gramad_shym:970}, stock:{magnum:'in',small:'in',green:'in',artem:'low', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['cheese','dairy','mozzarella','pizza'] },
  { id:'p041', name:'Cream Cheese 150g',     brand:'Almette',   category:'dairy',   image:'img/cream-cheese-new.png', weight:'150g', price:{magnum:680, small:650, green:670, artem:690, magnum_turk:665, firkan_turk:630, magnum_shym:665, gramad_shym:695}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['cheese','dairy','cream cheese','breakfast'] },
  { id:'p042', name:'Heavy Cream 20% 200ml', brand:'President', category:'dairy',   image:'img/heavy-cream-new.png', weight:'200ml', price:{magnum:580, small:550, green:560, artem:590, magnum_turk:570, firkan_turk:540, magnum_shym:570, gramad_shym:595}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['cream','dairy','cooking'] },
  { id:'p043', name:'Whipping Cream 33% 250ml', brand:'President', category:'dairy', image:'img/whipping-cream.png', weight:'250ml', price:{magnum:850, small:820, green:840, artem:880, magnum_turk:840, firkan_turk:800, magnum_shym:840, gramad_shym:880}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['cream','dairy','baking','whipping'] },
  { id:'p044', name:'Condensed Milk 380g',  brand:'Rogachev',  category:'dairy',   image:'img/condensed-milk.png', weight:'380g', price:{magnum:750, small:720, green:740, artem:760, magnum_turk:735, firkan_turk:700, magnum_shym:735, gramad_shym:770}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['milk','dairy','sweet','condensed'] },
  { id:'p045', name:'Brown Eggs 10pcs',      brand:'Alatau',    category:'dairy',   image:'img/brown-eggs.png', weight:'10pcs', price:{magnum:680, small:650, green:630, artem:670, magnum_turk:660, firkan_turk:627, magnum_shym:660, gramad_shym:690}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['eggs','breakfast','baking'] },
  { id:'p046', name:'Organic Eggs 10pcs',    brand:'EcoFarm',   category:'dairy',   image:'img/organic-eggs.png', weight:'10pcs', price:{magnum:950, small:900, green:880, artem:920, magnum_turk:925, firkan_turk:878, magnum_shym:925, gramad_shym:970}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['eggs','organic','breakfast','healthy'] },
  { id:'p047', name:'Chocolate Milk 500ml',  brand:'Raimbek',   category:'dairy',   image:'img/chocolate-milk.png', weight:'500ml', price:{magnum:520, small:490, green:500, artem:530, magnum_turk:505, firkan_turk:480, magnum_shym:505, gramad_shym:530}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['milk','dairy','chocolate','breakfast'] },
  { id:'p024', name:'Dove Shampoo 400ml',   brand:'Dove',      category:'care',    image:'img/dove-shampoo.png', weight:'400ml',  price:{magnum:2200,small:2100,green:0,   artem:2150,magnum_turk:2096, firkan_turk:1991, magnum_shym:2096, gramad_shym:2201}, stock:{magnum:'in',small:'in',green:'out',artem:'in',magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['shampoo','hair','dove'] },
  { id:'p025', name:'Head & Shoulders 400ml',brand:'H&S',      category:'care',    image:'img/head-and-shoulders.png', weight:'400ml',  price:{magnum:2400,small:2300,green:0,   artem:2350,magnum_turk:2300, firkan_turk:2185, magnum_shym:2300, gramad_shym:2415}, stock:{magnum:'in',small:'in',green:'out',artem:'in',magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['shampoo','dandruff'] },
  { id:'p026', name:'Colgate Toothpaste 150g',brand:'Colgate', category:'care',    image:'img/colgate.png', weight:'150g',   price:{magnum:950, small:900, green:0,   artem:920, magnum_turk:908, firkan_turk:863, magnum_shym:908, gramad_shym:953},  stock:{magnum:'in',small:'in',green:'out',artem:'in',magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g',  tags:['toothpaste','dental'] },
  { id:'p027', name:'Dove Body Wash 250ml',  brand:'Dove',      category:'care',   image:'img/dove-body-wash.png', weight:'250ml',  price:{magnum:1600,small:1550,green:0,   artem:1580,magnum_turk:1546, firkan_turk:1469, magnum_shym:1546, gramad_shym:1623}, stock:{magnum:'in',small:'in',green:'out',artem:'in',magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['body wash','shower','dove'] },
  { id:'p028', name:'Perfume Chanel No.5',   brand:'Chanel',    category:'care',   image:'img/chanel.png', weight:'100ml',  price:{magnum_turk:46500, firkan_turk:44175, magnum_shym:46500, gramad_shym:48825},                                            stock:{magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},                                               unitType:'per 100ml', tags:['perfume','fragrance','chanel'] },
  { id:'p401', name:'Dior Sauvage Eau de Parfum', brand:'Dior', category:'care', image:'img/dior-sauvage.png', weight:'100ml', price:{magnum:65000, small:64000, green:66000, artem:64500, magnum_turk:65000, firkan_turk:64000, magnum_shym:65000, gramad_shym:66000}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['perfume','fragrance','dior','sauvage'] },
  { id:'p402', name:'Chanel Bleu de Chanel', brand:'Chanel', category:'care', image:'img/chanel-bleu.png', weight:'100ml', price:{magnum:72000, small:71000, green:73000, artem:71500, magnum_turk:72000, firkan_turk:71000, magnum_shym:72000, gramad_shym:73000}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['perfume','fragrance','chanel','bleu'] },
  { id:'p403', name:'Versace Eros', brand:'Versace', category:'care', image:'https://upload.wikimedia.org/wikipedia/commons/2/2a/VersaceEros121.jpg', weight:'100ml', price:{magnum:48000, small:47500, green:49000, artem:48000, magnum_turk:48000, firkan_turk:47500, magnum_shym:48000, gramad_shym:49000}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['perfume','fragrance','versace','eros'] },
  { id:'p404', name:'Armani Acqua di Giò', brand:'Armani', category:'care', image:'https://upload.wikimedia.org/wikipedia/commons/e/e4/Armani_acqua_di_Gio_F.jpg', weight:'100ml', price:{magnum:55000, small:54000, green:56000, artem:54500, magnum_turk:55000, firkan_turk:54000, magnum_shym:55000, gramad_shym:56000}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['perfume','fragrance','armani','acqua','gio'] },
  { id:'p029', name:'Fairy Dish Liquid 1L',  brand:'Fairy',     category:'home',   image:'img/fairy_dish_liquid.png', weight:'1000ml', price:{magnum:1100,small:1050,green:0,   artem:1080,magnum_turk:1050, firkan_turk:998, magnum_shym:1050, gramad_shym:1102}, stock:{magnum:'in',small:'in',green:'out',artem:'in',magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['dish soap','cleaning','fairy'] },
  { id:'p030', name:'Ariel Powder 3kg',      brand:'Ariel',     category:'home',   image:'img/ariel_powder.png', weight:'3000g',  price:{magnum:3800,small:3650,green:0,   artem:3700,magnum_turk:3650, firkan_turk:3468, magnum_shym:3650, gramad_shym:3832}, stock:{magnum:'in',small:'in',green:'out',artem:'in',magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g',  tags:['laundry','powder','ariel'] },
  { id:'p031', name:'Toilet Paper 12 rolls', brand:'Only',      category:'home',   image:'img/toilet_paper_only.png', weight:'12pcs',  price:{magnum:1800,small:1700,green:0,   artem:1750,magnum_turk:1720, firkan_turk:1634, magnum_shym:1720, gramad_shym:1806}, stock:{magnum:'in',small:'in',green:'out',artem:'in',magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['toilet paper','household'] },
  { id:'p034', name:'Pampers Diapers (60pc)',brand:'Pampers',   category:'baby',    emoji:'👶', weight:'60pcs',  price:{magnum:5500,small:5200,artem:5400, magnum_turk:5367, firkan_turk:5099, magnum_shym:5367, gramad_shym:5635},                    stock:{magnum:'in',small:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},              unitType:'per piece', tags:['diapers','baby','pampers'] },
  { id:'p035', name:'Baby Food Gerber 200g', brand:'Gerber',    category:'baby',    emoji:'🍼', weight:'200g',   price:{magnum:850, small:820, artem:840, magnum_turk:837, firkan_turk:795, magnum_shym:837, gramad_shym:879},                     stock:{magnum:'in',small:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},              unitType:'per 100g',  tags:['baby food','gerber','infant'] },
  { id:'p850', name:'Baby Wipes (72pcs)',          brand:'Pampers',       category:'baby', image:'img/baby_wipes.png',              weight:'72pcs',  price:{magnum:1200, small:1100, green:1150, artem:1180, magnum_turk:1150, firkan_turk:1080, magnum_shym:1150, gramad_shym:1190}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['baby wipes','wipes','baby','hygiene'] },
  { id:'p851', name:'Huggies Newborn Diapers (36pc)', brand:'Huggies',   category:'baby', image:'img/huggies_newborn.png',          weight:'36pcs',  price:{magnum:3800, small:3600, green:3700, artem:3750, magnum_turk:3700, firkan_turk:3500, magnum_shym:3700, gramad_shym:3790}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['diapers','newborn','baby','huggies'] },
  { id:'p852', name:'Similac Infant Formula (400g)', brand:'Similac',    category:'baby', image:'img/similac_formula.png',           weight:'400g',   price:{magnum:4500, small:4300, green:4400, artem:4450, magnum_turk:4400, firkan_turk:4200, magnum_shym:4400, gramad_shym:4490}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['formula','infant','baby','similac','milk'] },
  { id:'p853', name:'NAN Infant Formula (400g)',     brand:'Nestlé',     category:'baby', image:'img/nestle_nan_formula.png',       weight:'400g',   price:{magnum:4800, small:4600, green:4700, artem:4750, magnum_turk:4700, firkan_turk:4500, magnum_shym:4700, gramad_shym:4790}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['formula','infant','baby','nestle','nan','milk'] },
  { id:'p854', name:'Gerber Rice Cereal (227g)',     brand:'Gerber',     category:'baby', image:'img/gerber_rice_cereal.png',        weight:'227g',   price:{magnum:1800, small:1700, green:1750, artem:1780, magnum_turk:1750, firkan_turk:1650, magnum_shym:1750, gramad_shym:1790}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['cereal','rice','baby','gerber','first food'] },
  { id:'p855', name:'Heinz Baby Cereal (200g)',      brand:'Heinz',      category:'baby', image:'img/heinz_baby_cereal.png',         weight:'200g',   price:{magnum:1600, small:1500, green:1550, artem:1580, magnum_turk:1550, firkan_turk:1450, magnum_shym:1550, gramad_shym:1590}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['cereal','baby','heinz','oat','wheat'] },
  { id:'p856', name:'Apple Baby Puree (100g)',       brand:'Gerber',     category:'baby', image:'img/apple_baby_puree.png',          weight:'100g',   price:{magnum:650, small:600, green:620, artem:640, magnum_turk:630, firkan_turk:590, magnum_shym:630, gramad_shym:650}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['puree','apple','baby','fruit','gerber'] },
  { id:'p857', name:'Banana Baby Puree (100g)',      brand:'Gerber',     category:'baby', image:'img/banana_baby_puree.png',         weight:'100g',   price:{magnum:650, small:600, green:620, artem:640, magnum_turk:630, firkan_turk:590, magnum_shym:630, gramad_shym:650}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['puree','banana','baby','fruit','gerber'] },
  { id:'p858', name:'Mixed Vegetable Baby Puree (100g)', brand:'Gerber', category:'baby', image:'img/mixed_veg_baby_puree.png',     weight:'100g',   price:{magnum:700, small:650, green:670, artem:690, magnum_turk:680, firkan_turk:640, magnum_shym:680, gramad_shym:700}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['puree','vegetable','baby','mixed','gerber'] },
  { id:'p859', name:'Baby Yogurt (100g)',            brand:'Agusha',     category:'baby', image:'img/baby_yogurt.png',              weight:'100g',   price:{magnum:450, small:420, green:430, artem:440, magnum_turk:430, firkan_turk:400, magnum_shym:430, gramad_shym:450}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['yogurt','baby','dairy','agusha'] },
  { id:'p860', name:'Baby Biscuits (150g)',          brand:'Heinz',      category:'baby', image:'img/baby_biscuits.png',             weight:'150g',   price:{magnum:950, small:900, green:920, artem:940, magnum_turk:930, firkan_turk:880, magnum_shym:930, gramad_shym:950}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['biscuits','baby','snack','heinz','teething'] },
  { id:'p861', name:"Johnson's Baby Shampoo (300ml)", brand:"Johnson's", category:'baby', image:'img/johnsons_baby_shampoo.png', weight:'300ml',  price:{magnum:1800, small:1700, green:1750, artem:1780, magnum_turk:1750, firkan_turk:1650, magnum_shym:1750, gramad_shym:1790}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['shampoo','baby','johnsons','bath','hair'] },
  { id:'p862', name:"Johnson's Baby Lotion (300ml)", brand:"Johnson's",  category:'baby', image:'img/johnsons_baby_lotion.png',  weight:'300ml',  price:{magnum:1900, small:1800, green:1850, artem:1880, magnum_turk:1850, firkan_turk:1750, magnum_shym:1850, gramad_shym:1890}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['lotion','baby','johnsons','moisturizer','skin'] },
  { id:'p863', name:"Johnson's Baby Oil (200ml)",    brand:"Johnson's",  category:'baby', image:'img/johnsons_baby_oil.png',     weight:'200ml',  price:{magnum:1600, small:1500, green:1550, artem:1580, magnum_turk:1550, firkan_turk:1450, magnum_shym:1550, gramad_shym:1590}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['oil','baby','johnsons','massage','skin'] },
  { id:'p864', name:"Johnson's Baby Powder (200g)",  brand:"Johnson's",  category:'baby', image:'img/johnsons_baby_powder.png',  weight:'200g',   price:{magnum:1400, small:1300, green:1350, artem:1380, magnum_turk:1350, firkan_turk:1250, magnum_shym:1350, gramad_shym:1390}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['powder','baby','johnsons','talc'] },
  { id:'p865', name:'Baby Soap Bar (100g)',          brand:"Johnson's",  category:'baby', image:'img/baby_soap.png',                weight:'100g',   price:{magnum:550, small:500, green:520, artem:540, magnum_turk:530, firkan_turk:490, magnum_shym:530, gramad_shym:550}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['soap','baby','johnsons','bath','gentle'] },
  { id:'p866', name:'Feeding Bottle (250ml)',        brand:'Philips Avent', category:'baby', image:'img/feeding_bottle.png',         weight:'250ml',  price:{magnum:3200, small:3000, green:3100, artem:3150, magnum_turk:3100, firkan_turk:2950, magnum_shym:3100, gramad_shym:3190}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['bottle','feeding','baby','avent','philips'] },
  { id:'p867', name:'Pacifier (0-6 months)',         brand:'Philips Avent', category:'baby', image:'img/pacifier.png',               weight:'1pc',    price:{magnum:1800, small:1700, green:1750, artem:1780, magnum_turk:1750, firkan_turk:1650, magnum_shym:1750, gramad_shym:1790}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['pacifier','baby','avent','philips','soother'] },
  // ── International Foods: Korean ──
  { id:'p051', name:'Traditional Korean Kimchi 500g', brand:'Jongga', category:'international', image:'img/kimchi-jar.png', weight:'500g', price:{korean_market:1800, iu_market:1950, emart:1750, magnum:2400, galmart:2200, kmart:2000}, stock:{korean_market:'in', iu_market:'in', emart:'in', magnum:'in', galmart:'in', kmart:'in'}, unitType:'per 100g', tags:['kimchi','korean','fermented','cabbage','side dish'] },
  { id:'p052', name:'Shin Ramyun Spicy 120g', brand:'Nongshim', category:'international', image:'img/shin-ramyun.png', weight:'120g', price:{korean_market:450, emart:480, iu_market:500, magnum:620, galmart:600, small:650, kmart:550}, stock:{korean_market:'in', emart:'in', iu_market:'in', magnum:'in', galmart:'in', small:'low', kmart:'in'}, unitType:'per piece', tags:['ramen','noodles','spicy','korean','shin ramyun','instant'] },
  { id:'p053', name:'Buldak Hot Chicken Ramen 140g', brand:'Samyang', category:'international', image:'img/buldak-ramen.png', weight:'140g', price:{korean_market:550, emart:580, iu_market:600, magnum:750, galmart:700, kmart:650}, stock:{korean_market:'in', emart:'in', iu_market:'in', magnum:'in', galmart:'low', kmart:'in'}, unitType:'per piece', tags:['buldak','ramen','spicy','korean','samyang','hot chicken','instant'] },
  { id:'p100', name:'Gochujang Red Pepper Paste 500g', brand:'CJ Haechandle', category:'international', image:'img/gochujang-paste.png', weight:'500g', price:{korean_market:2200, emart:2350, iu_market:2400, magnum:3100}, stock:{korean_market:'in', emart:'in', iu_market:'in', magnum:'low'}, unitType:'per 100g', tags:['gochujang','korean','paste','chili','condiment'] },
  // ── International Foods: Japanese ──
  { id:'p101', name:'Kikkoman Soy Sauce 250ml', brand:'Kikkoman', category:'international', image:'img/kikkoman-soy-sauce.png', weight:'250ml', price:{korean_market:1200, emart:1250, iu_market:1300, magnum:1750, galmart:1650, small:1700, kmart:1400}, stock:{korean_market:'in', emart:'in', iu_market:'in', magnum:'in', galmart:'in', small:'in', kmart:'in'}, unitType:'per 100ml', tags:['soy sauce','kikkoman','japanese','condiment','asian'] },
  { id:'p102', name:'Sushi Rice Premium 1kg', brand:'Hiyori', category:'international', image:'img/sushi-rice.png', weight:'1000g', price:{korean_market:2800, emart:2900, iu_market:3000, magnum:3500, galmart:3200}, stock:{korean_market:'in', emart:'in', iu_market:'low', magnum:'in', galmart:'in'}, unitType:'per 100g', tags:['sushi','rice','japanese','grain','short grain'] },
  { id:'p103', name:'Nori Seaweed Sheets 10pc', brand:'Ariake', category:'international', image:'img/nori-seaweed.png', weight:'28g', price:{korean_market:1100, emart:1150, iu_market:1200, magnum:1600, galmart:1500}, stock:{korean_market:'in', emart:'in', iu_market:'in', magnum:'in', galmart:'low'}, unitType:'per piece', tags:['nori','seaweed','japanese','sushi','wrap'] },
  { id:'p104', name:'Pocky Chocolate Sticks 45g', brand:'Glico', category:'international', image:'img/pocky.png', weight:'45g', price:{korean_market:650, emart:680, iu_market:700, magnum:850, galmart:800, small:820}, stock:{korean_market:'in', emart:'in', iu_market:'in', magnum:'in', galmart:'in', small:'in'}, unitType:'per piece', tags:['pocky','chocolate','japanese','snack','biscuit'] },
  { id:'p105', name:'Miso Paste White 1kg', brand:'Marukome', category:'international', image:'img/miso-paste.png', weight:'1000g', price:{korean_market:3200, emart:3400, iu_market:3500, galmart:4200}, stock:{korean_market:'in', emart:'in', iu_market:'low', galmart:'in'}, unitType:'per 100g', tags:['miso','paste','japanese','soup','fermented'] },
  { id:'p106', name:'Rice Vinegar 500ml', brand:'Mizkan', category:'international', image:'img/rice-vinegar.png', weight:'500ml', price:{korean_market:1500, emart:1600, iu_market:1650, magnum:2100, galmart:1950}, stock:{korean_market:'in', emart:'in', iu_market:'in', magnum:'in', galmart:'in'}, unitType:'per 100ml', tags:['rice vinegar','japanese','vinegar','sushi','condiment'] },
  // ── International Foods: Chinese ──
  { id:'p107', name:'Lee Kum Kee Oyster Sauce 510g', brand:'Lee Kum Kee', category:'international', image:'img/oyster-sauce.png', weight:'510g', price:{korean_market:1800, emart:1900, magnum:2400, galmart:2200, small:2300, kmart:2000}, stock:{korean_market:'in', emart:'in', magnum:'in', galmart:'in', small:'in', kmart:'in'}, unitType:'per 100g', tags:['oyster sauce','chinese','condiment','stir fry','cooking'] },
  { id:'p108', name:'Toasted Sesame Oil 160ml', brand:'Kadoya', category:'international', image:'img/soy-sauce.png', weight:'160ml', price:{korean_market:1600, emart:1700, iu_market:1750, magnum:2200, galmart:2050}, stock:{korean_market:'in', emart:'in', iu_market:'in', magnum:'in', galmart:'low'}, unitType:'per 100ml', tags:['sesame oil','asian','chinese','korean','cooking oil'] },
  // ── International Foods: Thai ──
  { id:'p109', name:'Coconut Milk 400ml', brand:'AROY-D', category:'international', image:'img/coconut-milk.png', weight:'400ml', price:{magnum:850, galmart:800, small:880, korean_market:750, emart:780, kmart:820}, stock:{magnum:'in', galmart:'in', small:'in', korean_market:'in', emart:'in', kmart:'in'}, unitType:'per 100ml', tags:['coconut milk','thai','curry','cooking','can'] },
  { id:'p110', name:'Sweet Chili Sauce 730g', brand:'Mae Ploy', category:'international', image:'img/sweet-chili-sauce.png', weight:'730g', price:{magnum:2200, galmart:2050, korean_market:1800, emart:1900, kmart:1950}, stock:{magnum:'in', galmart:'in', korean_market:'in', emart:'in', kmart:'in'}, unitType:'per 100g', tags:['sweet chili','thai','sauce','dipping','condiment'] },
  // ── International Foods: Mexican ──
  { id:'p111', name:'Flour Tortilla Wraps 8pc', brand:'Mission', category:'international', image:'img/tortilla-wraps.png', weight:'320g', price:{magnum:1400, galmart:1300, small:1450}, stock:{magnum:'in', galmart:'in', small:'in'}, unitType:'per piece', tags:['tortilla','wraps','mexican','burrito','taco'] },
  { id:'p112', name:'Tomato Salsa Mild 226g', brand:'Old El Paso', category:'international', image:'img/salsa-sauce.png', weight:'226g', price:{magnum:1600, galmart:1500, small:1650}, stock:{magnum:'in', galmart:'in', small:'low'}, unitType:'per 100g', tags:['salsa','mexican','dip','tomato','sauce'] },
  // ── International Foods: Italian ──
  { id:'p113', name:'Extra Virgin Olive Oil 750ml', brand:'Il Casale Toscano', category:'international', image:'img/olive-oil.png', weight:'750ml', price:{magnum:3800, galmart:3500, small:3900, green:4100}, stock:{magnum:'in', galmart:'in', small:'in', green:'in'}, unitType:'per 100ml', tags:['olive oil','italian','cooking','premium','imported'] },
  { id:'p114', name:'Parmigiano Reggiano 250g', brand:'Parmareggio', category:'international', image:'img/parmesan-cheese.png', weight:'250g', price:{magnum:5200, galmart:4800, green:5500}, stock:{magnum:'in', galmart:'low', green:'in'}, unitType:'per 100g', tags:['parmesan','cheese','italian','imported','hard cheese'] },
  // ── Special Diet: Gluten-Free ──
  { id:'p054', name:'Gluten-Free Bread 400g', brand:'Schär', category:'special_diet', image:'img/gluten-free-bread.png', weight:'400g', price:{magnum:1450, galmart:1350, small:1400, interfood:1280}, stock:{magnum:'in', galmart:'in', small:'in', interfood:'in'}, unitType:'per 100g', tags:['gluten-free','bread','diet','celiac'] },
  { id:'p055', name:'Gluten-Free Spaghetti 400g', brand:'Barilla', category:'special_diet', image:'img/gluten-free-pasta.png', weight:'400g', price:{magnum:1650, galmart:1500, small:1580, interfood:1420}, stock:{magnum:'in', galmart:'in', small:'in', interfood:'in'}, unitType:'per 100g', tags:['gluten-free','pasta','spaghetti','diet'] },
  { id:'p200', name:'Gluten-Free Rice Crackers 130g', brand:'Crisp Harvest', category:'special_diet', image:'img/gluten-free-crackers.png', weight:'130g', price:{magnum:980, galmart:920, interfood:850, small:950}, stock:{magnum:'in', galmart:'in', interfood:'in', small:'low'}, unitType:'per 100g', tags:['gluten-free','crackers','rice','snack'] },
  { id:'p201', name:'Gluten-Free Rolled Oats 500g', brand:'Bob\'s Red Mill', category:'special_diet', emoji:'🥣', weight:'500g', price:{galmart:1750, interfood:1600, magnum:1850}, stock:{galmart:'in', interfood:'in', magnum:'in'}, unitType:'per 100g', tags:['gluten-free','oats','oatmeal','breakfast'] },
  // ── Special Diet: Vegan ──
  { id:'p202', name:'Vegan Cheddar Slices 200g', brand:'Violife', category:'special_diet', image:'img/vegan-cheese.png', weight:'200g', price:{galmart:2200, interfood:1980, magnum:2400, small:2300}, stock:{galmart:'in', interfood:'in', magnum:'in', small:'low'}, unitType:'per 100g', tags:['vegan','cheese','dairy-free','plant-based'] },
  { id:'p203', name:'Firm Tofu 400g', brand:'Morinaga', category:'special_diet', image:'img/tofu.png', weight:'400g', price:{magnum:1100, galmart:980, interfood:890, small:1050}, stock:{magnum:'in', galmart:'in', interfood:'in', small:'in'}, unitType:'per 100g', tags:['tofu','vegan','plant-based','soy','protein'] },
  { id:'p204', name:'Vegan Butter Spread 450g', brand:'Flora', category:'special_diet', image:'img/vegan-butter.png', weight:'450g', price:{magnum:1650, galmart:1500, interfood:1380, small:1580}, stock:{magnum:'in', galmart:'in', interfood:'in', small:'in'}, unitType:'per 100g', tags:['vegan','butter','plant-based','dairy-free','spread'] },
  { id:'p205', name:'Coconut Yogurt 150g', brand:'Alpro', category:'special_diet', image:'img/coconut-yogurt.png', weight:'150g', price:{galmart:850, interfood:780, magnum:920}, stock:{galmart:'in', interfood:'in', magnum:'low'}, unitType:'per 100g', tags:['vegan','yogurt','coconut','dairy-free','plant-based'] },
  // ── Special Diet: Lactose-Free ──
  { id:'p056', name:'Lactose-Free Milk 1L', brand:'Parmalat', category:'special_diet', image:'img/lactose-free-milk.png', weight:'1000ml', price:{magnum:780, galmart:720, small:750, interfood:680}, stock:{magnum:'in', galmart:'in', small:'in', interfood:'in'}, unitType:'per 100ml', tags:['lactose-free','milk','dairy'] },
  { id:'p206', name:'Lactose-Free Yogurt 150g', brand:'Valio', category:'special_diet', image:'img/lactose-free-yogurt.png', weight:'150g', price:{magnum:650, galmart:590, interfood:550, small:620}, stock:{magnum:'in', galmart:'in', interfood:'in', small:'in'}, unitType:'per 100g', tags:['lactose-free','yogurt','dairy','strawberry'] },
  // ── Special Diet: Plant Milks ──
  { id:'p207', name:'Almond Milk Unsweetened 1L', brand:'Alpro', category:'special_diet', image:'img/almond-milk.png', weight:'1000ml', price:{galmart:1800, magnum:1950, small:1850, interfood:1680}, stock:{galmart:'in', magnum:'in', small:'in', interfood:'in'}, unitType:'per 100ml', tags:['almond milk','vegan','lactose-free','plant-based','dairy-free'] },
  { id:'p208', name:'Oat Milk Original 1L', brand:'Oatly', category:'special_diet', image:'img/oat-milk.png', weight:'1000ml', price:{galmart:1650, magnum:1800, interfood:1520, small:1700}, stock:{galmart:'in', magnum:'in', interfood:'in', small:'in'}, unitType:'per 100ml', tags:['oat milk','vegan','lactose-free','plant-based','dairy-free'] },
  // ── Special Diet: Sugar-Free ──
  { id:'p057', name:'Sugar-Free Dark Chocolate 100g', brand:'Lindt', category:'special_diet', image:'img/sugar-free-chocolate.png', weight:'100g', price:{magnum:1800, galmart:1650, interfood:1520, small:1750}, stock:{magnum:'in', galmart:'in', interfood:'in', small:'in'}, unitType:'per 100g', tags:['sugar-free','chocolate','dark chocolate','diet','diabetic'] },
  { id:'p209', name:'Sugar-Free Oatmeal Cookies 250g', brand:'Gullon', category:'special_diet', image:'img/sugar-free-cookies.png', weight:'250g', price:{magnum:1350, galmart:1250, interfood:1150, small:1300}, stock:{magnum:'in', galmart:'in', interfood:'in', small:'in'}, unitType:'per 100g', tags:['sugar-free','cookies','oatmeal','diet','snack'] },
  { id:'p210', name:'Stevia Sweetener 75g', brand:'Huxol', category:'special_diet', image:'img/stevia-sweetener.png', weight:'75g', price:{magnum:1200, small:1100, galmart:1300, interfood:1050}, stock:{magnum:'in', small:'in', galmart:'in', interfood:'in'}, unitType:'per 100g', tags:['sugar-free','stevia','sweetener','zero-calorie','diet'] },
  { id:'p211', name:'Erythritol Sweetener 500g', brand:'Now Foods', category:'special_diet', image:'img/erythritol-sweetener.png', weight:'500g', price:{galmart:2800, interfood:2500, magnum:3100}, stock:{galmart:'in', interfood:'in', magnum:'in'}, unitType:'per 100g', tags:['sugar-free','erythritol','sweetener','keto','zero-calorie'] },
  // ── Special Diet: Keto-Friendly ──
  { id:'p212', name:'Keto Seeded Bread 400g', brand:'Base Culture', category:'special_diet', image:'img/keto-bread.png', weight:'400g', price:{galmart:2400, interfood:2150, magnum:2650}, stock:{galmart:'in', interfood:'in', magnum:'low'}, unitType:'per 100g', tags:['keto','bread','low-carb','high-fiber','seed'] },
  { id:'p213', name:'Chia Seeds 300g', brand:'Natureland', category:'special_diet', image:'img/chia-seeds.png', weight:'300g', price:{magnum:1900, galmart:1750, interfood:1580, small:1850}, stock:{magnum:'in', galmart:'in', interfood:'in', small:'in'}, unitType:'per 100g', tags:['chia seeds','superfood','keto','vegan','omega-3','fiber'] },
  // ── Fitness & Health: Protein Powders ──
  { id:'p058', name:'Whey Protein Gold 900g', brand:'Optimum Nutrition', category:'fitness', image:'img/whey-protein.png', weight:'900g', price:{powerlife:17500, galmart:19500, magnum:20500, interfood:18800}, stock:{powerlife:'in', galmart:'low', magnum:'in', interfood:'in'}, unitType:'per 100g', tags:['whey','protein','fitness','supplement','muscle'] },
  { id:'p300', name:'Casein Protein 900g', brand:'Dymatize', category:'fitness', image:'img/casein-protein.png', weight:'900g', price:{powerlife:18900, galmart:21000, interfood:20200}, stock:{powerlife:'in', galmart:'in', interfood:'low'}, unitType:'per 100g', tags:['casein','protein','slow-release','night','recovery'] },
  // ── Fitness & Health: Supplements ──
  { id:'p301', name:'Creatine Monohydrate 300g', brand:'Optimum Nutrition', category:'fitness', image:'img/creatine.png', weight:'300g', price:{powerlife:5500, galmart:6200, interfood:5900}, stock:{powerlife:'in', galmart:'in', interfood:'in'}, unitType:'per 100g', tags:['creatine','supplement','performance','strength','gym'] },
  { id:'p302', name:'BCAA Powder 300g', brand:'BSN', category:'fitness', image:'img/bcaa.png', weight:'300g', price:{powerlife:7800, galmart:8500, interfood:8200}, stock:{powerlife:'in', galmart:'in', interfood:'low'}, unitType:'per 100g', tags:['bcaa','amino acids','recovery','muscle','workout'] },
  { id:'p303', name:'Pre-Workout Energy 300g', brand:'Cellucor C4', category:'fitness', image:'img/pre-workout.png', weight:'300g', price:{powerlife:8900, galmart:9800, interfood:9500}, stock:{powerlife:'in', galmart:'low', interfood:'in'}, unitType:'per 100g', tags:['pre-workout','energy','caffeine','pump','gym'] },
  { id:'p304', name:'Omega-3 Fish Oil 60 caps', brand:'Now Foods', category:'fitness', image:'img/omega3.png', weight:'60pcs', price:{powerlife:4200, galmart:4800, magnum:5100, interfood:4500, small:4900}, stock:{powerlife:'in', galmart:'in', magnum:'in', interfood:'in', small:'in'}, unitType:'per piece', tags:['omega-3','fish oil','heart','health','supplement'] },
  { id:'p305', name:'Collagen Peptides 300g', brand:'Vital Proteins', category:'fitness', image:'img/collagen.png', weight:'300g', price:{powerlife:9200, galmart:10500, interfood:9800}, stock:{powerlife:'in', galmart:'in', interfood:'in'}, unitType:'per 100g', tags:['collagen','beauty','skin','joints','supplement'] },
  { id:'p306', name:'Multivitamin Daily 60 tabs', brand:'Centrum', category:'fitness', image:'img/multivitamin.png', weight:'60pcs', price:{powerlife:3800, galmart:4200, magnum:4500, small:4300, interfood:4000}, stock:{powerlife:'in', galmart:'in', magnum:'in', small:'in', interfood:'in'}, unitType:'per piece', tags:['multivitamin','daily','health','vitamins','minerals'] },
  // ── Fitness & Health: Protein Foods ──
  { id:'p059', name:'Protein Bar Caramel 60g', brand:'Quest', category:'fitness', image:'img/protein-bar.png', weight:'60g', price:{powerlife:1050, magnum:1200, small:1150, galmart:1250, interfood:1100}, stock:{powerlife:'in', magnum:'in', small:'in', galmart:'in', interfood:'in'}, unitType:'per piece', tags:['protein bar','snack','fitness','caramel'] },
  { id:'p307', name:'Protein Shake RTD 330ml', brand:'Optimum Nutrition', category:'fitness', image:'img/protein-shake.png', weight:'330ml', price:{powerlife:1800, magnum:2100, galmart:2000, small:2050}, stock:{powerlife:'in', magnum:'in', galmart:'in', small:'low'}, unitType:'per 100ml', tags:['protein shake','ready to drink','fitness','convenient'] },
  { id:'p308', name:'Protein Granola 350g', brand:'Lizi\'s', category:'fitness', image:'img/protein-granola.png', weight:'350g', price:{powerlife:2600, galmart:2900, interfood:2750, magnum:3100}, stock:{powerlife:'in', galmart:'in', interfood:'in', magnum:'in'}, unitType:'per 100g', tags:['protein','granola','breakfast','crunchy','fitness'] },
  { id:'p309', name:'Greek Yogurt High Protein 200g', brand:'Ehrmann', category:'fitness', image:'img/greek-yogurt.png', weight:'200g', price:{magnum:580, small:550, galmart:620, interfood:560}, stock:{magnum:'in', small:'in', galmart:'in', interfood:'in'}, unitType:'per 100g', tags:['greek yogurt','protein','dairy','healthy','breakfast'] },
  { id:'p310', name:'Peanut Butter Natural 500g', brand:'Myprotein', category:'fitness', image:'img/peanut-butter.png', weight:'500g', price:{powerlife:2400, galmart:2800, magnum:3000, interfood:2600, small:2900}, stock:{powerlife:'in', galmart:'in', magnum:'in', interfood:'in', small:'in'}, unitType:'per 100g', tags:['peanut butter','protein','healthy fats','spread','natural'] },
  // ── Fitness & Health: Healthy Snacks ──
  { id:'p060', name:'Roasted Chickpeas 150g', brand:'Biokul', category:'fitness', image:'img/chickpeas-roasted.png', weight:'150g', price:{magnum:650, small:600, galmart:700, powerlife:580, interfood:620}, stock:{magnum:'in', small:'in', galmart:'in', powerlife:'in', interfood:'in'}, unitType:'per 100g', tags:['chickpeas','roasted','healthy','snack','protein','vegan'] },
  { id:'p311', name:'Mixed Nuts Trail Mix 200g', brand:'Alesto', category:'fitness', image:'img/mixed-nuts.png', weight:'200g', price:{magnum:1600, small:1500, galmart:1750, powerlife:1400, interfood:1550}, stock:{magnum:'in', small:'in', galmart:'in', powerlife:'in', interfood:'in'}, unitType:'per 100g', tags:['mixed nuts','trail mix','healthy fats','snack','omega'] },
  { id:'p312', name:'Fitness Oatmeal 500g', brand:'Quaker', category:'fitness', image:'img/oatmeal-fitness.png', weight:'500g', price:{magnum:780, small:720, galmart:850, interfood:750}, stock:{magnum:'in', small:'in', galmart:'in', interfood:'in'}, unitType:'per 100g', tags:['oatmeal','whole grain','breakfast','slow carbs','fiber'] },
  // ── Fitness & Health: Drinks ──
  { id:'p313', name:'Monster Energy Zero 500ml', brand:'Monster', category:'fitness', image:'img/monster-zero.png', weight:'500ml', price:{magnum:850, small:820, galmart:900, powerlife:780}, stock:{magnum:'in', small:'in', galmart:'in', powerlife:'in'}, unitType:'per 100ml', tags:['monster','energy drink','zero sugar','caffeine','workout'] },
  { id:'p314', name:'Electrolyte Isotonic 500ml', brand:'Powerade', category:'fitness', image:'img/electrolyte-drink.png', weight:'500ml', price:{magnum:550, small:520, galmart:580, powerlife:480}, stock:{magnum:'in', small:'in', galmart:'in', powerlife:'in'}, unitType:'per 100ml', tags:['electrolyte','isotonic','hydration','sports drink','workout'] },
  // Organic Products
  { id:'p062', name:'Organic Milk 1L', brand:'BioFarm', category:'organic', image:'img/organic-milk.png', weight:'1000ml', price:{magnum:950, small:980, green:1100, galmart:1200}, stock:{magnum:'in', small:'in', green:'in', galmart:'in'}, unitType:'per 100ml', tags:['organic','milk','dairy'] },
  { id:'p063', name:'Organic Yogurt 500g', brand:'Nature', category:'organic', image:'img/organic-yogurt.png', weight:'500g', price:{magnum:850, small:820, galmart:950}, stock:{magnum:'in', small:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','yogurt','dairy'] },
  { id:'p064', name:'Organic Cheese 250g', brand:'Green Valley', category:'organic', image:'img/organic-cheese.png', weight:'250g', price:{green:2800, galmart:3100, small:2900}, stock:{green:'in', galmart:'low', small:'in'}, unitType:'per 100g', tags:['organic','cheese','dairy'] },
  { id:'p065', name:'Organic Butter 200g', brand:'Pure', category:'organic', image:'img/organic-butter.png', weight:'200g', price:{magnum:1450, green:1550, galmart:1650}, stock:{magnum:'in', green:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','butter','dairy'] },
  { id:'p066', name:'Organic Eggs x10', brand:'Happy Hen', category:'organic', image:'img/organic-eggs-pack.png', weight:'10pcs', price:{magnum:1200, small:1150, green:1300, galmart:1400}, stock:{magnum:'in', small:'in', green:'low', galmart:'in'}, unitType:'per piece', tags:['organic','eggs','breakfast'] },
  { id:'p067', name:'Organic Apples 1kg', brand:'Eco', category:'organic', image:'img/organic-apples.png', weight:'1000g', price:{magnum:850, small:800, green:950, galmart:1100}, stock:{magnum:'in', small:'in', green:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','apples','fruit'] },
  { id:'p068', name:'Organic Bananas 1kg', brand:'FairTrade', category:'organic', image:'img/organic-bananas.png', weight:'1000g', price:{magnum:950, green:1050, galmart:1150}, stock:{magnum:'in', green:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','bananas','fruit'] },
  { id:'p069', name:'Organic Tomatoes 500g', brand:'Sun', category:'organic', image:'img/organic-tomatoes.png', weight:'500g', price:{magnum:1100, green:1250, galmart:1350}, stock:{magnum:'in', green:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','tomatoes','vegetable'] },
  { id:'p070', name:'Organic Carrots 1kg', brand:'Root', category:'organic', image:'img/organic-carrots.png', weight:'1000g', price:{magnum:450, small:420, green:500, artem:380}, stock:{magnum:'in', small:'in', green:'in', artem:'in'}, unitType:'per 100g', tags:['organic','carrots','vegetable'] },
  { id:'p071', name:'Organic Potatoes 1kg', brand:'Earth', category:'organic', image:'img/organic-potatoes.png', weight:'1000g', price:{magnum:380, small:350, green:400, artem:320}, stock:{magnum:'in', small:'in', green:'in', artem:'in'}, unitType:'per 100g', tags:['organic','potatoes','vegetable'] },
  { id:'p072', name:'Organic Honey 400g', brand:'Bee', category:'organic', image:'img/organic-honey.png', weight:'400g', price:{green:3500, galmart:3800, small:3600}, stock:{green:'in', galmart:'in', small:'in'}, unitType:'per 100g', tags:['organic','honey','sweetener'] },
  { id:'p073', name:'Organic Green Tea', brand:'Leaf', category:'organic', image:'img/organic-green-tea.png', weight:'100g', price:{magnum:2200, green:2400, galmart:2600}, stock:{magnum:'in', green:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','tea','drink'] },
  { id:'p074', name:'Organic Oatmeal 500g', brand:'Grain', category:'organic', image:'img/organic-oatmeal.png', weight:'500g', price:{magnum:1100, small:1050, green:1200}, stock:{magnum:'in', small:'in', green:'in'}, unitType:'per 100g', tags:['organic','oatmeal','breakfast'] },
  { id:'p075', name:'Organic Brown Rice 1kg', brand:'Health', category:'organic', image:'img/organic-brown-rice.png', weight:'1000g', price:{magnum:1500, green:1700, galmart:1850}, stock:{magnum:'in', green:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','rice','grain'] },
  { id:'p076', name:'Organic Almond Milk 1L', brand:'Nut', category:'organic', image:'img/organic-almond-milk.png', weight:'1000ml', price:{magnum:1900, small:1850, galmart:2100}, stock:{magnum:'in', small:'in', galmart:'in'}, unitType:'per 100ml', tags:['organic','almond milk','vegan'] },
  { id:'p077', name:'Organic Dark Chocolate 100g', brand:'Cacao', category:'organic', image:'img/organic-dark-chocolate.png', weight:'100g', price:{magnum:1400, green:1600, galmart:1800}, stock:{magnum:'in', green:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','chocolate','snack'] },
  { id:'p078', name:'Organic Mixed Nuts 200g', brand:'Wild', category:'organic', image:'img/organic-mixed-nuts.png', weight:'200g', price:{magnum:2500, green:2800, galmart:3100}, stock:{magnum:'in', green:'in', galmart:'in'}, unitType:'per 100g', tags:['organic','nuts','snack'] },
  
  // ── Bakery Products ──
  { id:'p501', name:'Baguette 300g', brand:'Aksay Nan', category:'bakery', image:'img/baguette.png', weight:'300g', price:{magnum:300, small:280, green:290, artem:295, magnum_turk:295, firkan_turk:285, magnum_shym:295, gramad_shym:290, galmart:320}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in', galmart:'in'}, unitType:'per 100g', tags:['bread','bakery','baguette','french'] },
  { id:'p502', name:'Whole Wheat Bread 500g', brand:'Aksay Nan', category:'bakery', image:'img/whole_wheat_bread.png', weight:'500g', price:{magnum:410, small:390, green:400, artem:395, magnum_turk:405, firkan_turk:395, magnum_shym:405, gramad_shym:400}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['bread','bakery','whole wheat','healthy'] },
  { id:'p503', name:'Toast Bread 600g', brand:'Harry\'s', category:'bakery', image:'img/toast_bread.png', weight:'600g', price:{magnum:560, small:540, green:550, artem:545, magnum_turk:555, firkan_turk:545, magnum_shym:555, gramad_shym:550}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['bread','bakery','toast','sliced'] },
  { id:'p504', name:'Sourdough Bread 700g', brand:'Magnum Bakery', category:'bakery', image:'img/sourdough_bread.png', weight:'700g', price:{magnum:760, small:730, green:750, artem:0, magnum_turk:750, firkan_turk:740, magnum_shym:750, gramad_shym:745, galmart:800}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in', galmart:'in'}, unitType:'per 100g', tags:['bread','bakery','sourdough','artisanal'] },
  { id:'p505', name:'Croissant (Pack of 4)', brand:'Magnum Bakery', category:'bakery', image:'img/croissants.png', weight:'4pcs', price:{magnum:1100, small:1050, green:1150, artem:1000, magnum_turk:1120, firkan_turk:1080, magnum_shym:1120, gramad_shym:1100, galmart:1200}, stock:{magnum:'in', small:'in', green:'in', artem:'low', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in', galmart:'in'}, unitType:'per piece', tags:['croissant','bakery','butter','pastry','breakfast'] },
  { id:'p506', name:'Cinnamon Rolls (Pack of 2)', brand:'Magnum Bakery', category:'bakery', image:'img/cinnamon_rolls.png', weight:'2pcs', price:{magnum:880, small:840, green:860, artem:0, magnum_turk:870, firkan_turk:850, magnum_shym:870, gramad_shym:860, galmart:950}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in', galmart:'in'}, unitType:'per piece', tags:['cinnamon roll','bakery','pastry','sweet','icing'] },
  { id:'p507', name:'Chocolate Chip Cookies 200g', brand:'Merba', category:'bakery', image:'img/chocolate_cookies.png', weight:'200g', price:{magnum:720, small:690, green:710, artem:730, magnum_turk:715, firkan_turk:680, magnum_shym:715, gramad_shym:725}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['cookies','bakery','chocolate','sweet','biscuit'] },
  { id:'p508', name:'Butter Cookies 300g', brand:'Danisa', category:'bakery', image:'img/butter_cookies.png', weight:'300g', price:{magnum:980, small:940, green:960, artem:950, magnum_turk:970, firkan_turk:930, magnum_shym:970, gramad_shym:990}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['cookies','bakery','butter','sweet','biscuit'] },
  { id:'p509', name:'Oatmeal Cookies 250g', brand:'Khlebny Spas', category:'bakery', image:'img/oatmeal_cookies.png', weight:'250g', price:{magnum:600, small:570, green:590, artem:580, magnum_turk:595, firkan_turk:560, magnum_shym:595, gramad_shym:610}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['cookies','bakery','oatmeal','healthy','biscuit'] },
  { id:'p510', name:'Wafer Biscuits 180g', brand:'Yashkino', category:'bakery', image:'img/wafer_biscuits.png', weight:'180g', price:{magnum:510, small:480, green:500, artem:490, magnum_turk:505, firkan_turk:475, magnum_shym:505, gramad_shym:515}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['wafer','bakery','biscuits','sweet','chocolate'] },
  { id:'p511', name:'Chocolate Sponge Cake 500g', brand:'Bayan Sulu', category:'bakery', image:'img/chocolate_cake.png', weight:'500g', price:{magnum:2800, small:2700, green:2900, artem:0, magnum_turk:2750, firkan_turk:2650, magnum_shym:2750, gramad_shym:2850, galmart:3100}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in', galmart:'in'}, unitType:'per piece', tags:['cake','bakery','chocolate','sponge cake','sweet','dessert'] },
  { id:'p512', name:'Cheesecake Slice 150g', brand:'Galmart Bakery', category:'bakery', image:'img/cheesecake_slice.png', weight:'150g', price:{magnum:980, small:940, green:960, artem:0, magnum_turk:970, firkan_turk:930, magnum_shym:970, gramad_shym:990, galmart:1050}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in', galmart:'in'}, unitType:'per piece', tags:['cheesecake','bakery','cheese','dessert','sweet','slice'] },
  { id:'p513', name:'Cupcakes (Pack of 6)', brand:'Magnum Bakery', category:'bakery', image:'img/cupcakes.png', weight:'6pcs', price:{magnum:1850, small:1750, green:1800, artem:0, magnum_turk:1820, firkan_turk:1780, magnum_shym:1820, gramad_shym:1860}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['cupcakes','bakery','sweet','dessert','sprinkles'] },
  { id:'p514', name:'Donuts (Pack of 4, glazed)', brand:'Magnum Bakery', category:'bakery', image:'img/glazed_donuts.png', weight:'4pcs', price:{magnum:1450, small:1380, green:1420, artem:0, magnum_turk:1430, firkan_turk:1390, magnum_shym:1430, gramad_shym:1470}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['donuts','bakery','glazed','sweet','dessert'] },
  { id:'p515', name:'Dry Yeast 100g', brand:'Saf-Moment', category:'bakery', image:'img/dry_yeast.png', weight:'100g', price:{magnum:450, small:420, green:440, artem:460, magnum_turk:445, firkan_turk:415, magnum_shym:445, gramad_shym:455}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['yeast','bakery','dry yeast','baking','ingredients'] },
  { id:'p516', name:'Baking Powder 100g', brand:'Dr. Oetker', category:'bakery', image:'img/baking_powder.png', weight:'100g', price:{magnum:380, small:350, green:370, artem:390, magnum_turk:375, firkan_turk:345, magnum_shym:375, gramad_shym:385}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['baking powder','bakery','baking','ingredients'] },
  
  // ── Meat & Seafood Products ──
  { id:'p601', name:'Beef Steak 500g', brand:'Local Farm', category:'meat', image:'img/beef_steak.png', weight:'500g', price:{magnum:2800, small:2700, green:2900, artem:2750, magnum_turk:2780, firkan_turk:2680, magnum_shym:2780, gramad_shym:2820}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['beef','meat','steak','protein'] },
  { id:'p602', name:'Minced Beef 1kg', brand:'Local Farm', category:'meat', image:'img/minced_beef.png', weight:'1000g', price:{magnum:3400, small:3200, green:3300, artem:3250, magnum_turk:3380, firkan_turk:3280, magnum_shym:3380, gramad_shym:3420}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['beef','meat','minced','ground beef'] },
  { id:'p603', name:'Beef Sirloin 1kg', brand:'Local Farm', category:'meat', image:'img/beef_sirloin.png', weight:'1000g', price:{magnum:4500, small:4300, green:4400, artem:0, magnum_turk:4480, firkan_turk:4350, magnum_shym:4480, gramad_shym:4520}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['beef','meat','sirloin','roast'] },
  { id:'p604', name:'Lamb Chops 700g', brand:'Local Farm', category:'meat', image:'img/lamb_chops.png', weight:'700g', price:{magnum:3300, small:3100, green:3250, artem:3200, magnum_turk:3280, firkan_turk:3150, magnum_shym:3280, gramad_shym:3320}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['lamb','meat','chops','mutton'] },
  { id:'p605', name:'Lamb Meat Boneless 1kg', brand:'Local Farm', category:'meat', image:'img/lamb_boneless.png', weight:'1000g', price:{magnum:4300, small:4100, green:4200, artem:0, magnum_turk:4280, firkan_turk:4150, magnum_shym:4280, gramad_shym:4350}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['lamb','meat','boneless','mutton'] },
  { id:'p607', name:'Chicken Thighs 1kg', brand:'Alatau', category:'meat', image:'img/chicken_thighs.png', weight:'1000g', price:{magnum:1750, small:1650, green:1700, artem:1680, magnum_turk:1720, firkan_turk:1640, magnum_shym:1720, gramad_shym:1760}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['chicken','meat','thighs','poultry'] },
  { id:'p608', name:'Whole Chicken 1.5kg', brand:'Alatau', category:'meat', image:'img/whole_chicken.png', weight:'1500g', price:{magnum:2400, small:2250, green:2350, artem:0, magnum_turk:2380, firkan_turk:2280, magnum_shym:2380, gramad_shym:2420}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per piece', tags:['chicken','meat','whole chicken','poultry'] },
  { id:'p609', name:'Chicken Wings 1kg', brand:'Alatau', category:'meat', image:'img/chicken_wings.png', weight:'1000g', price:{magnum:1550, small:1450, green:1500, artem:1480, magnum_turk:1520, firkan_turk:1440, magnum_shym:1520, gramad_shym:1560}, stock:{magnum:'in', small:'in', green:'in', artem:'low', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['chicken','meat','wings','poultry'] },
  { id:'p610', name:'Salmon Fillet 500g', brand:'Ocean Prince', category:'meat', image:'img/salmon_fillet.png', weight:'500g', price:{magnum:4900, small:4700, green:4800, artem:0, magnum_turk:4850, firkan_turk:4750, magnum_shym:4850, gramad_shym:4950, galmart:5200}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in', galmart:'in'}, unitType:'per 100g', tags:['salmon','fish','seafood','fillet','protein'] },
  { id:'p611', name:'Salmon Steak 1kg', brand:'Ocean Prince', category:'meat', image:'img/salmon_steak.png', weight:'1000g', price:{magnum:8800, small:8500, green:8650, artem:0, magnum_turk:8750, firkan_turk:8450, magnum_shym:8750, gramad_shym:8850, galmart:9200}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in', galmart:'in'}, unitType:'per 100g', tags:['salmon','fish','seafood','steak'] },
  { id:'p612', name:'Frozen Tilapia 1kg', brand:'Ocean Prince', category:'meat', image:'img/frozen_tilapia.png', weight:'1000g', price:{magnum:2650, small:2450, green:2550, artem:2500, magnum_turk:2600, firkan_turk:2480, magnum_shym:2600, gramad_shym:2680}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['tilapia','fish','seafood','frozen'] },
  { id:'p613', name:'Shrimp Frozen Peeled 500g', brand:'Polar', category:'meat', image:'img/shrimp_peeled.png', weight:'500g', price:{magnum:3500, small:3300, green:3400, artem:0, magnum_turk:3450, firkan_turk:3350, magnum_shym:3450, gramad_shym:3550}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['shrimp','seafood','prawns','frozen','peeled'] },
  { id:'p614', name:'Mackerel Fish 1kg', brand:'Ocean Prince', category:'meat', image:'img/mackerel_fish.jpg', weight:'1000g', price:{magnum:2000, small:1850, green:1950, artem:1900, magnum_turk:1980, firkan_turk:1880, magnum_shym:1980, gramad_shym:2020}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['mackerel','fish','seafood'] },
  { id:'p615', name:'Tuna Fillet 500g', brand:'Premium', category:'meat', image:'img/tuna_fillet.png', weight:'500g', price:{magnum:5300, small:5100, green:5200, artem:0, magnum_turk:5250, firkan_turk:5150, magnum_shym:5250, gramad_shym:5350}, stock:{magnum:'in', small:'in', green:'in', artem:'out', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['tuna','fish','seafood','fillet'] },
  { id:'p616', name:'Beef Sausages 500g', brand:'Becker & K', category:'meat', image:'img/beef_sausages.png', weight:'500g', price:{magnum:1800, small:1650, green:1750, artem:1700, magnum_turk:1780, firkan_turk:1680, magnum_shym:1780, gramad_shym:1820}, stock:{magnum:'in', small:'in', green:'in', artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100g', tags:['sausage','meat','beef','halal'] },
  { id:'p701', name:'Cucumbers (1kg)',            brand:'Local',     category:'veg',     image:'img/veg_cucumbers.png', emoji:'🥒', weight:'1000g',  price:{magnum:350, small:320, green:300, artem:330, magnum_turk:325, firkan_turk:314, magnum_shym:325, gramad_shym:336},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['cucumber','vegetable','fresh','salad'] },
  { id:'p702', name:'Cabbage (1 head)',          brand:'Local',     category:'veg',     image:'img/veg_cabbage_head.png', emoji:'🥬', weight:'1pc',    price:{magnum:300, small:280, green:250, artem:270, magnum_turk:275, firkan_turk:260, magnum_shym:275, gramad_shym:285},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['cabbage','vegetable','fresh','head'] },
  { id:'p703', name:'Bell Peppers (mix pack)',   brand:'Local',     category:'veg',     image:'img/veg_bell_peppers.png', emoji:'🫑', weight:'500g',   price:{magnum:800, small:750, green:700, artem:780, magnum_turk:760, firkan_turk:740, magnum_shym:760, gramad_shym:790},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['pepper','bell pepper','vegetable','mix'] },
  { id:'p704', name:'Spinach (200g)',            brand:'Local',     category:'veg',     image:'img/veg_spinach.png', emoji:'🌿', weight:'200g',   price:{magnum:450, small:420, green:400, artem:430, magnum_turk:425, firkan_turk:410, magnum_shym:425, gramad_shym:440},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['spinach','greens','vegetable','healthy'] },
  { id:'p705', name:'Broccoli (500g)',           brand:'Local',     category:'veg',     image:'img/veg_broccoli.png', emoji:'🥦', weight:'500g',   price:{magnum:650, small:600, green:580, artem:620, magnum_turk:610, firkan_turk:590, magnum_shym:610, gramad_shym:630},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['broccoli','vegetable','healthy','fresh'] },
  { id:'p706', name:'Cauliflower (1 head)',      brand:'Local',     category:'veg',     image:'img/veg_cauliflower.png', emoji:'🥦', weight:'1pc',    price:{magnum:700, small:650, green:600, artem:680, magnum_turk:660, firkan_turk:640, magnum_shym:660, gramad_shym:690},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['cauliflower','vegetable','head','fresh'] },
  { id:'p707', name:'Eggplant (1kg)',            brand:'Local',     category:'veg',     image:'img/veg_eggplant.png', emoji:'🍆', weight:'1000g',  price:{magnum:750, small:700, green:650, artem:720, magnum_turk:710, firkan_turk:690, magnum_shym:710, gramad_shym:730},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['eggplant','aubergine','vegetable'] },
  { id:'p708', name:'Garlic (250g)',             brand:'Local',     category:'veg',     image:'img/veg_garlic.png', emoji:'🧄', weight:'250g',   price:{magnum:400, small:380, green:350, artem:390, magnum_turk:375, firkan_turk:360, magnum_shym:375, gramad_shym:390},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['garlic','vegetable','seasoning'] },
  { id:'p709', name:'Green Beans (500g)',        brand:'Local',     category:'veg',     image:'img/veg_green_beans.png', emoji:'🫛', weight:'500g',   price:{magnum:600, small:550, green:500, artem:580, magnum_turk:560, firkan_turk:540, magnum_shym:560, gramad_shym:590},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['beans','green beans','vegetable'] },
  { id:'p710', name:'Zucchini (1kg)',            brand:'Local',     category:'veg',     image:'img/veg_zucchini.png', emoji:'🥒', weight:'1000g',  price:{magnum:500, small:450, green:400, artem:480, magnum_turk:460, firkan_turk:440, magnum_shym:460, gramad_shym:490},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100g',  tags:['zucchini','vegetable','squash'] },
  { id:'p711', name:'Radish (bunch)',            brand:'Local',     category:'veg',     image:'img/veg_radish.png', emoji:'🌱', weight:'1pc',    price:{magnum:350, small:320, green:300, artem:340, magnum_turk:330, firkan_turk:310, magnum_shym:330, gramad_shym:345},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['radish','vegetable','bunch','fresh'] },
  { id:'p712', name:'Lettuce (1 head)',          brand:'Local',     category:'veg',     image:'img/veg_lettuce.png', emoji:'🥬', weight:'1pc',    price:{magnum:400, small:360, green:320, artem:380, magnum_turk:365, firkan_turk:340, magnum_shym:365, gramad_shym:390},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['lettuce','salad','greens','head','vegetable'] },
  { id:'p405', name:'Mouthwash (500ml)',          brand:'Colgate',   category:'care',    image:'img/care_mouthwash_v2.png', emoji:'🧴', weight:'500ml',  price:{magnum:1500, small:1400, green:1450, artem:1480, magnum_turk:1450, firkan_turk:1380, magnum_shym:1450, gramad_shym:1490},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['mouthwash','care','dental','hygiene'] },
  { id:'p406', name:'Deodorant spray (150ml)',    brand:'Rexona',    category:'care',    image:'img/care_deodorant_spray_v2.png', emoji:'🧴', weight:'150ml',  price:{magnum:1200, small:1100, green:1150, artem:1180, magnum_turk:1150, firkan_turk:1080, magnum_shym:1150, gramad_shym:1190},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['deodorant','spray','care','hygiene'] },
  { id:'p407', name:'Roll-on deodorant (50ml)',   brand:'Nivea',     category:'care',    image:'img/care_roll_on_deodorant_v2.png', emoji:'🧴', weight:'50ml',   price:{magnum:900,  small:850,  green:880,  artem:890,  magnum_turk:870,  firkan_turk:820,  magnum_shym:870,  gramad_shym:895},            stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['deodorant','roll-on','care','hygiene'] },
  { id:'p408', name:'Shower gel / Body wash (250ml)', brand:'Nivea', category:'care',    image:'img/care_shower_gel_v2.png', emoji:'🧴', weight:'250ml',  price:{magnum:1300, small:1200, green:1250, artem:1280, magnum_turk:1250, firkan_turk:1180, magnum_shym:1250, gramad_shym:1290},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['shower gel','body wash','shower','care'] },
  { id:'p409', name:'Hand soap liquid (300ml)',   brand:'Safeguard', category:'care',    image:'img/care_hand_soap_v2.png', emoji:'🧴', weight:'300ml',  price:{magnum:1000, small:900,  green:950,  artem:980,  magnum_turk:950,  firkan_turk:880,  magnum_shym:950,  gramad_shym:990},            stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['soap','liquid soap','hand soap','care','hygiene'] },
  { id:'p410', name:'Face cleanser (200ml)',      brand:'L\'Oreal',  category:'care',    image:'img/care_face_cleanser_v2.png', emoji:'🧴', weight:'200ml',  price:{magnum:2500, small:2400, green:2450, artem:2480, magnum_turk:2450, firkan_turk:2380, magnum_shym:2450, gramad_shym:2490},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['face cleanser','skincare','care','face'] },
  { id:'p411', name:'Facial moisturizer cream (100ml)', brand:'Nivea', category:'care',  image:'img/care_facial_moisturizer_v2.png', emoji:'🧴', weight:'100ml',  price:{magnum:2200, small:2100, green:2150, artem:2180, magnum_turk:2150, firkan_turk:2080, magnum_shym:2150, gramad_shym:2190},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['moisturizer','cream','skincare','care','face'] },
  { id:'p412', name:'Sunscreen SPF 50 (100ml)',   brand:'Nivea',     category:'care',    image:'img/care_sunscreen_v2.png', emoji:'🧴', weight:'100ml',  price:{magnum:3800, small:3600, green:3700, artem:3750, magnum_turk:3700, firkan_turk:3550, magnum_shym:3700, gramad_shym:3790},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['sunscreen','spf','care','summer','protection'] },
  { id:'p413', name:'Hair conditioner (250ml)',   brand:'Dove',      category:'care',    image:'img/care_hair_conditioner_v2.png', emoji:'🧴', weight:'250ml',  price:{magnum:1800, small:1700, green:1750, artem:1780, magnum_turk:1750, firkan_turk:1680, magnum_shym:1750, gramad_shym:1790},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['conditioner','hair','care'] },
  { id:'p414', name:'Hair styling gel (150ml)',   brand:'Taft',      category:'care',    image:'img/care_hair_styling_gel_v2.png', emoji:'🧴', weight:'150ml',  price:{magnum:1400, small:1300, green:1350, artem:1380, magnum_turk:1350, firkan_turk:1280, magnum_shym:1350, gramad_shym:1390},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['styling gel','hair gel','hair','care'] },
  { id:'p415', name:'Hair wax / pomade (100ml)',  brand:'Taft',      category:'care',    image:'img/care_hair_wax_v2.png', emoji:'🧴', weight:'100ml',  price:{magnum:1600, small:1500, green:1550, artem:1580, magnum_turk:1550, firkan_turk:1480, magnum_shym:1550, gramad_shym:1590},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['hair wax','pomade','hair','care'] },
  { id:'p416', name:'Shaving foam (200ml)',       brand:'Gillette',  category:'care',    image:'img/care_shaving_foam_v2.png', emoji:'🧴', weight:'200ml',  price:{magnum:1700, small:1600, green:1650, artem:1680, magnum_turk:1650, firkan_turk:1580, magnum_shym:1650, gramad_shym:1690},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['shaving foam','shave','gillette','care'] },
  { id:'p417', name:'Razor blades pack',          brand:'Gillette',  category:'care',    image:'img/care_razor_blades_v2.png', emoji:'🪒', weight:'4pcs',   price:{magnum:4500, small:4300, green:4400, artem:4450, magnum_turk:4400, firkan_turk:4250, magnum_shym:4400, gramad_shym:4490},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['razor','blades','shave','gillette','care'] },
  { id:'p801', name:'Laundry detergent (2L)',      brand:'YokoSun',   category:'home',   image:'img/yokosun_laundry_detergent.png', weight:'2000ml', price:{magnum:3200, small:3000, green:3100, artem:3150, magnum_turk:3100, firkan_turk:2950, magnum_shym:3100, gramad_shym:3180}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['laundry','detergent','cleaning','household'] },
  { id:'p802', name:'Fabric softener (1L)',        brand:'Forest Clean', category:'home', image:'img/forest_clean_softener.png', weight:'1000ml', price:{magnum:1800, small:1700, green:1750, artem:1780, magnum_turk:1750, firkan_turk:1680, magnum_shym:1750, gramad_shym:1790}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['fabric softener','laundry','household'] },
  { id:'p803', name:'Dishwashing liquid (750ml)',  brand:'Cif',       category:'home',   image:'img/cif_dish_liquid.png', weight:'750ml',  price:{magnum:950, small:900, green:920, artem:940, magnum_turk:930, firkan_turk:880, magnum_shym:930, gramad_shym:960},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['dish soap','dishwashing','cleaning','household'] },
  { id:'p804', name:'Multi-surface cleaner spray (500ml)', brand:'Dettol', category:'home', image:'img/dettol_surface_cleaner.png', weight:'500ml', price:{magnum:1100, small:1000, green:1050, artem:1080, magnum_turk:1050, firkan_turk:980, magnum_shym:1050, gramad_shym:1090}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['cleaner','spray','multi-surface','household'] },
  { id:'p805', name:'Glass cleaner (500ml)',      brand:'Магия Чистоты', category:'home', image:'img/magiya_chistoty_glass_cleaner.png', weight:'500ml',  price:{magnum:1200, small:1100, green:1150, artem:1180, magnum_turk:1150, firkan_turk:1080, magnum_shym:1150, gramad_shym:1190},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['glass cleaner','cleaning','spray','household'] },
  { id:'p806', name:'Floor cleaner liquid (1L)',   brand:'Frosch',    category:'home',   image:'img/frosch_universal_cleaner.png', weight:'1000ml', price:{magnum:1600, small:1500, green:1550, artem:1580, magnum_turk:1550, firkan_turk:1480, magnum_shym:1550, gramad_shym:1595}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, unitType:'per 100ml', tags:['floor cleaner','cleaning','liquid','household'] },
  { id:'p807', name:'Bleach (1L)',                brand:'Domestos',  category:'home',   image:'img/domestos_bleach.png', weight:'1000ml', price:{magnum:1300, small:1200, green:1250, artem:1280, magnum_turk:1250, firkan_turk:1180, magnum_shym:1250, gramad_shym:1290},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['bleach','disinfectant','cleaning','household'] },
  { id:'p808', name:'Trash bags (30 pcs)',        brand:'Zoro',      category:'home',   image:'img/zoro_trash_bags.png', weight:'30pcs',  price:{magnum:850, small:800, green:820, artem:840, magnum_turk:830, firkan_turk:790, magnum_shym:830, gramad_shym:860},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['trash bags','garbage','bags','household'] },
  { id:'p809', name:'Aluminum foil (1 roll)',     brand:'Generic',   category:'home',   image:'img/aluminium_foil.png', weight:'1roll',  price:{magnum:750, small:700, green:720, artem:740, magnum_turk:730, firkan_turk:690, magnum_shym:730, gramad_shym:760},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['foil','aluminum','baking','kitchen','household'] },
  { id:'p810', name:'Plastic food wrap (1 roll)', brand:'Generic',   category:'home',   image:'img/cling_wrap.png', weight:'1roll',  price:{magnum:650, small:600, green:620, artem:640, magnum_turk:630, firkan_turk:590, magnum_shym:630, gramad_shym:660},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['cling wrap','plastic wrap','kitchen','household'] },
  { id:'p811', name:'Sponges (5-pack)',           brand:'Generic',   category:'home',   image:'img/sponges_pack.png', weight:'5pcs',   price:{magnum:450, small:400, green:420, artem:440, magnum_turk:430, firkan_turk:390, magnum_shym:430, gramad_shym:460},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['sponges','cleaning','dishwashing','household'] },
  { id:'p812', name:'Air freshener spray (300ml)', brand:'Master FRESH', category:'home',   image:'img/master_fresh_air_freshener.png', weight:'300ml',  price:{magnum:1100, small:1000, green:1050, artem:1080, magnum_turk:1050, firkan_turk:980, magnum_shym:1050, gramad_shym:1090},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per 100ml', tags:['air freshener','spray','household'] },
  { id:'p813', name:'Rubber cleaning gloves (1 pair)', brand:'Generic',  category:'home',   image:'img/rubber_gloves.png', weight:'1pair',  price:{magnum:600, small:550, green:570, artem:590, magnum_turk:580, firkan_turk:540, magnum_shym:580, gramad_shym:610},           stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'},   unitType:'per piece', tags:['gloves','cleaning gloves','rubber','household'] },
  // Beverages
  { id:'p901', name:'Coca-Cola 1.5L', brand:'Coca-Cola', category:'beverages', image:'img/coca-cola.png', emoji:'🥤', weight:'1.5L', price:{magnum:480, small:450, green:460, artem:490, magnum_turk:470, firkan_turk:440, magnum_shym:470, gramad_shym:490}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:45, description:'Classic refreshing carbonated soft drink.', unitType:'per 100ml', tags:['coke','beverages','cola','soda','cold','sweet'] },
  { id:'p902', name:'Pepsi 1.5L', brand:'Pepsi', category:'beverages', image:'img/pepsi.png', emoji:'🥤', weight:'1.5L', price:{magnum:460, small:440, green:450, artem:480, magnum_turk:450, firkan_turk:430, magnum_shym:450, gramad_shym:480}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:38, description:'Deliciously refreshing carbonated cola beverage.', unitType:'per 100ml', tags:['pepsi','beverages','cola','soda','cold','sweet'] },
  { id:'p903', name:'Orange Juice 1L', brand:'Sady Pridonya', category:'beverages', image:'img/orange-juice.png', emoji:'🧃', weight:'1L', price:{magnum:650, small:620, green:640, artem:660, magnum_turk:630, firkan_turk:610, magnum_shym:630, gramad_shym:660}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:28, description:'100% natural orange juice, rich in Vitamin C.', unitType:'per 100ml', tags:['juice','orange juice','beverages','breakfast','cold','orange'] },
  { id:'p904', name:'Apple Juice 1L', brand:'Gracio', category:'beverages', image:'img/apple-juice.png', emoji:'🧃', weight:'1L', price:{magnum:720, small:690, green:700, artem:740, magnum_turk:710, firkan_turk:680, magnum_shym:710, gramad_shym:730}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:33, description:'Crisp and sweet 100% apple juice with no added sugar.', unitType:'per 100ml', tags:['juice','apple juice','beverages','breakfast','cold','apple'] },
  { id:'p905', name:'Mineral Water 500ml', brand:'Borjomi', category:'beverages', image:'img/mineral-water.png', emoji:'💧', weight:'500ml', price:{magnum:350, small:320, green:340, artem:360, magnum_turk:340, firkan_turk:310, magnum_shym:340, gramad_shym:360}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:50, description:'Naturally carbonated mineral water from Georgia.', unitType:'per 100ml', tags:['water','mineral water','beverages','sparkling','healthy'] },
  { id:'p906', name:'Sparkling Water 1.5L', brand:'Tassay', category:'beverages', image:'img/sparkling-water.png', emoji:'💧', weight:'1.5L', price:{magnum:220, small:200, green:210, artem:230, magnum_turk:215, firkan_turk:195, magnum_shym:215, gramad_shym:225}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:62, description:'Pure carbonated drinking water from Kazakhstan.', unitType:'per 100ml', tags:['water','sparkling','beverages','hydration'] },
  { id:'p907', name:'Green Tea 25 bags', brand:'Piala Gold', category:'beverages', image:'img/green-tea.png', emoji:'🍵', weight:'25pcs', price:{magnum:450, small:420, green:430, artem:460, magnum_turk:440, firkan_turk:410, magnum_shym:440, gramad_shym:450}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:40, description:'Refreshing and rich green tea, perfect for health.', unitType:'per piece', tags:['green tea','tea','beverages','hot','healthy'] },
  { id:'p908', name:'Black Tea 25 bags', brand:'Richard', category:'beverages', image:'img/black-tea.png', emoji:'☕', weight:'25pcs', price:{magnum:550, small:520, green:540, artem:560, magnum_turk:540, firkan_turk:510, magnum_shym:540, gramad_shym:560}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:42, description:'Classic English royal blend black tea bags.', unitType:'per piece', tags:['black tea','tea','beverages','hot','morning'] },
  { id:'p909', name:'Coffee 190g', brand:'Nescafe Gold', category:'beverages', image:'img/instant-coffee.png', emoji:'☕', weight:'190g', price:{magnum:2600, small:2450, green:2500, artem:2700, magnum_turk:2550, firkan_turk:2400, magnum_shym:2550, gramad_shym:2650}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:25, description:'Premium freeze-dried soluble coffee for a rich taste.', unitType:'per 100g', tags:['coffee','beverages','instant','morning','caffeine'] },
  { id:'p910', name:'Energy Drink 250ml', brand:'Red Bull', category:'beverages', image:'img/energy-drink.png', emoji:'⚡', weight:'250ml', price:{magnum:750, small:720, green:740, artem:760, magnum_turk:735, firkan_turk:700, magnum_shym:735, gramad_shym:760}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:30, description:'Vitalizes body and mind, perfect for active days.', unitType:'per 100ml', tags:['energy','red bull','beverages','energy drink','caffeine'] },
  { id:'p911', name:'Lemonade 500ml', brand:'Natakhtari', category:'beverages', image:'img/lemonade.png', emoji:'🍋', weight:'500ml', price:{magnum:420, small:390, green:400, artem:430, magnum_turk:410, firkan_turk:380, magnum_shym:410, gramad_shym:430}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:27, description:'Traditional Georgian tarragon or lemon flavored carbonated soft drink.', unitType:'per 100ml', tags:['lemonade','soda','beverages','sweet','natakhtari'] },
  { id:'p912', name:'Iced Tea 500ml', brand:'Lipton', category:'beverages', image:'img/iced-tea.png', emoji:'🧋', weight:'500ml', price:{magnum:320, small:300, green:310, artem:330, magnum_turk:310, firkan_turk:290, magnum_shym:310, gramad_shym:330}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:44, description:'Cool iced tea with refreshing lemon or peach flavor.', unitType:'per 100ml', tags:['iced tea','lipton','tea','beverages','cold','sweet'] },
  { id:'p913', name:'Mango Juice 1L', brand:'Gracio', category:'beverages', image:'img/mango-juice.png', emoji:'🥭', weight:'1L', price:{magnum:850, small:820, green:840, artem:880, magnum_turk:840, firkan_turk:800, magnum_shym:840, gramad_shym:870}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:18, description:'Rich and exotic mango nectar juice.', unitType:'per 100ml', tags:['juice','mango','beverages','exotic','sweet'] },
  { id:'p914', name:'Grape Juice 1L', brand:'Sady Pridonya', category:'beverages', image:'img/grape-juice.png', emoji:'🍇', weight:'1L', price:{magnum:650, small:620, green:640, artem:660, magnum_turk:630, firkan_turk:600, magnum_shym:630, gramad_shym:650}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:22, description:'Delicious 100% red grape juice, rich in antioxidants.', unitType:'per 100ml', tags:['juice','grape juice','beverages','red grape','sweet'] },
  { id:'p915', name:'Protein Drink 330ml', brand:'Optimum Nutrition', category:'beverages', image:'img/protein-drink.png', emoji:'💪', weight:'330ml', price:{magnum:1800, small:1750, green:1780, artem:1850, magnum_turk:1790, firkan_turk:1700, magnum_shym:1790, gramad_shym:1820}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:15, description:'High-protein ready-to-drink shake, chocolate flavor.', unitType:'per 100ml', tags:['protein','shake','fitness','beverages','chocolate','supplement'] },
  { id:'p916', name:'Milkshake 950g', brand:'Chudo', category:'beverages', image:'img/milkshake.png', emoji:'🥛', weight:'950g', price:{magnum:780, small:750, green:760, artem:790, magnum_turk:770, firkan_turk:730, magnum_shym:770, gramad_shym:790}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:20, description:'Sweet and creamy strawberry milkshake.', unitType:'per 100g', tags:['milkshake','dairy','beverages','sweet','strawberry'] },
  { id:'p917', name:'Coconut Water 330ml', brand:'Foco', category:'beverages', image:'img/coconut-water.png', emoji:'🥥', weight:'330ml', price:{magnum:580, small:550, green:560, artem:590, magnum_turk:570, firkan_turk:530, magnum_shym:570, gramad_shym:590}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:31, description:'Pure, natural hydrating coconut water from Thailand.', unitType:'per 100ml', tags:['coconut','water','beverages','hydration','healthy'] },
  { id:'p918', name:'Soda Water 1L', brand:'Schweppes', category:'beverages', image:'img/soda-water.png', emoji:'💧', weight:'1L', price:{magnum:450, small:420, green:430, artem:460, magnum_turk:440, firkan_turk:410, magnum_shym:440, gramad_shym:460}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:36, description:'Crisp soda water, ideal for refreshing mixers.', unitType:'per 100ml', tags:['soda','water','mixer','beverages','sparkling','tonic'] },
  { id:'p919', name:'Hot Chocolate 10 bags', brand:'MacChocolate', category:'beverages', image:'img/hot-chocolate.png', emoji:'🍫', weight:'10pcs', price:{magnum:650, small:620, green:630, artem:670, magnum_turk:640, firkan_turk:600, magnum_shym:640, gramad_shym:660}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:24, description:'Instant hot chocolate powder packets, rich cocoa taste.', unitType:'per piece', tags:['chocolate','cocoa','hot chocolate','sweet','hot','beverages'] },
  { id:'p920', name:'Sports Drink 500ml', brand:'Gatorade', category:'beverages', image:'img/sports-drink.png', emoji:'🏃', weight:'500ml', price:{magnum:680, small:650, green:660, artem:690, magnum_turk:670, firkan_turk:630, magnum_shym:670, gramad_shym:690}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:29, description:'Electrolyte sport drink for quick rehydration.', unitType:'per 100ml', tags:['sports drink','gatorade','beverages','hydration','fitness'] },
  // Fruits
  { id:'p921', name:'Apples 1kg', brand:'Local', category:'fruits', image:'img/apples.png', emoji:'🍎', weight:'1000g', price:{magnum:450, small:420, green:400, artem:430, magnum_turk:420, firkan_turk:395, magnum_shym:420, gramad_shym:440}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:55, description:'Fresh, sweet, and crispy red apples.', unitType:'per 100g', tags:['apples','fruits','healthy','fresh','local'] },
  { id:'p922', name:'Bananas 1kg', brand:'Ecuador', category:'fruits', image:'img/bananas.png', emoji:'🍌', weight:'1000g', price:{magnum:720, small:690, green:710, artem:680, magnum_turk:700, firkan_turk:670, magnum_shym:700, gramad_shym:710}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:65, description:'Fresh ripe yellow bananas imported from Ecuador.', unitType:'per 100g', tags:['bananas','fruits','fresh','healthy','potassium'] },
  { id:'p923', name:'Oranges 1kg', brand:'Egypt', category:'fruits', image:'img/oranges.png', emoji:'🍊', weight:'1000g', price:{magnum:850, small:790, green:820, artem:800, magnum_turk:810, firkan_turk:780, magnum_shym:810, gramad_shym:840}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:48, description:'Sweet and juicy fresh oranges, perfect for juice.', unitType:'per 100g', tags:['oranges','fruits','healthy','fresh','citrus','vitamin c'] },
  { id:'p924', name:'Grapes 1kg', brand:'Local', category:'fruits', image:'img/grapes.png', emoji:'🍇', weight:'1000g', price:{magnum:1200, small:1100, green:1150, artem:1080, magnum_turk:1120, firkan_turk:1050, magnum_shym:1120, gramad_shym:1180}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:34, description:'Fresh seedless table grapes, sweet and delicious.', unitType:'per 100g', tags:['grapes','fruits','sweet','fresh','healthy'] },
  { id:'p925', name:'Strawberries 250g', brand:'Greenhouse', category:'fruits', image:'img/strawberries.png', emoji:'🍓', weight:'250g', price:{magnum:980, small:940, green:960, artem:990, magnum_turk:960, firkan_turk:920, magnum_shym:960, gramad_shym:980}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:21, description:'Sweet, juicy, and fragrant fresh greenhouse strawberries.', unitType:'per 100g', tags:['strawberries','berries','fruits','fresh','dessert','sweet'] },
  { id:'p926', name:'Lemons 500g', brand:'Local', category:'fruits', image:'img/lemons.png', emoji:'🍋', weight:'500g', price:{magnum:550, small:520, green:530, artem:540, magnum_turk:535, firkan_turk:500, magnum_shym:535, gramad_shym:550}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:42, description:'Zesty fresh lemons, rich in Vitamin C.', unitType:'per 100g', tags:['lemons','fruits','sour','fresh','citrus','healthy'] },
  { id:'p927', name:'Watermelon 1kg', brand:'Southern', category:'fruits', image:'img/watermelon.png', emoji:'🍉', weight:'1000g', price:{magnum:250, small:220, green:200, artem:230, magnum_turk:220, firkan_turk:190, magnum_shym:220, gramad_shym:240}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:70, description:'Extremely sweet and refreshing southern watermelon.', unitType:'per 100g', tags:['watermelon','fruits','fresh','summer','healthy','hydration'] },
  { id:'p928', name:'Pineapple 1pc', brand:'Costa Rica', category:'fruits', image:'img/pineapple.png', emoji:'🍍', weight:'1pc', price:{magnum:1450, small:1380, green:1400, artem:1480, magnum_turk:1410, firkan_turk:1350, magnum_shym:1410, gramad_shym:1450}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:16, description:'Sweet and tangy tropical fresh pineapple.', unitType:'per piece', tags:['pineapple','fruits','fresh','tropical','sweet'] },
  { id:'p929', name:'Mango 1pc', brand:'Thailand', category:'fruits', image:'img/mango.png', emoji:'🥭', weight:'1pc', price:{magnum:1200, small:1100, green:1150, artem:1250, magnum_turk:1160, firkan_turk:1080, magnum_shym:1160, gramad_shym:1220}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:19, description:'Ripe, soft, and sweet Thai honey mango.', unitType:'per piece', tags:['mango','fruits','tropical','sweet','fresh','imported'] },
  { id:'p930', name:'Pears 1kg', brand:'Conference', category:'fruits', image:'img/pears.png', emoji:'🍐', weight:'1000g', price:{magnum:950, small:890, green:920, artem:900, magnum_turk:910, firkan_turk:860, magnum_shym:910, gramad_shym:940}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:38, description:'Sweet, aromatic, and juicy Conference pears.', unitType:'per 100g', tags:['pears','fruits','healthy','fresh','sweet'] },
  { id:'p931', name:'Kiwi 1kg', brand:'Iran', category:'fruits', image:'img/kiwi.png', emoji:'🥝', weight:'1000g', price:{magnum:900, small:850, green:880, artem:870, magnum_turk:875, firkan_turk:820, magnum_shym:875, gramad_shym:895}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:32, description:'Tart and sweet green kiwi fruits, rich in Vitamin C.', unitType:'per 100g', tags:['kiwi','fruits','healthy','fresh','sour'] },
  { id:'p932', name:'Blueberries 125g', brand:'Imported', category:'fruits', image:'img/blueberries.png', emoji:'🫐', weight:'125g', price:{magnum:850, small:800, green:820, artem:880, magnum_turk:830, firkan_turk:790, magnum_shym:830, gramad_shym:860}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:25, description:'Premium fresh blueberries, sweet and healthy.', unitType:'per 100g', tags:['blueberries','berries','fruits','fresh','healthy','superfood'] },
  { id:'p933', name:'Peaches 1kg', brand:'Local', category:'fruits', image:'img/peaches.png', emoji:'🍑', weight:'1000g', price:{magnum:1100, small:1050, green:1080, artem:1000, magnum_turk:1070, firkan_turk:990, magnum_shym:1070, gramad_shym:1095}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:28, description:'Sweet, soft, and juicy local fresh peaches.', unitType:'per 100g', tags:['peaches','fruits','fresh','sweet','summer'] },
  { id:'p934', name:'Plums 1kg', brand:'Local', category:'fruits', image:'img/plums.png', emoji:'🍑', weight:'1000g', price:{magnum:750, small:700, green:720, artem:740, magnum_turk:730, firkan_turk:680, magnum_shym:730, gramad_shym:750}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:37, description:'Sweet and slightly sour dark blue plums.', unitType:'per 100g', tags:['plums','fruits','fresh','sweet','local'] },
  { id:'p935', name:'Cherries 1kg', brand:'Local', category:'fruits', image:'img/cherries.png', emoji:'🍒', weight:'1000g', price:{magnum:1800, small:1700, green:1750, artem:1680, magnum_turk:1720, firkan_turk:1600, magnum_shym:1720, gramad_shym:1790}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:23, description:'Ripe, dark-red sweet cherries, locally harvested.', unitType:'per 100g', tags:['cherries','fruits','sweet','fresh','summer'] },
  { id:'p936', name:'Avocados 2pcs', brand:'Hass', category:'fruits', image:'img/avocados.png', emoji:'🥑', weight:'2pcs', price:{magnum:1500, small:1450, green:1480, artem:1550, magnum_turk:1475, firkan_turk:1400, magnum_shym:1475, gramad_shym:1520}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:30, description:'Creamy, ripe Hass avocados, rich in healthy fats.', unitType:'per piece', tags:['avocado','fruits','healthy','fresh','fats','salad'] },
  { id:'p937', name:'Pomegranate 1kg', brand:'Local', category:'fruits', image:'img/pomegranate.png', emoji:'❤️', weight:'1000g', price:{magnum:1300, small:1200, green:1250, artem:1280, magnum_turk:1250, firkan_turk:1180, magnum_shym:1250, gramad_shym:1290}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:26, description:'Ripe red pomegranate with juicy and sweet seeds.', unitType:'per 100g', tags:['pomegranate','fruits','red','sweet','fresh'] },
  { id:'p938', name:'Papaya 1pc', brand:'Imported', category:'fruits', image:'img/papaya.png', emoji:'🥭', weight:'1pc', price:{magnum:2800, small:2600, green:2700, artem:2900, magnum_turk:2750, firkan_turk:2500, magnum_shym:2750, gramad_shym:2850}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:12, description:'Sweet, soft, and tropical orange papaya.', unitType:'per piece', tags:['papaya','fruits','tropical','sweet','fresh','imported'] },
  { id:'p939', name:'Dragon Fruit 1pc', brand:'Vietnam', category:'fruits', image:'img/dragon-fruit.png', emoji:'🐉', weight:'1pc', price:{magnum:2200, small:2100, green:2150, artem:2300, magnum_turk:2180, firkan_turk:2000, magnum_shym:2180, gramad_shym:2250}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:15, description:'Fresh red pitahaya (dragon fruit) with white flesh.', unitType:'per piece', tags:['dragon fruit','fruits','tropical','fresh','imported'] },
  { id:'p940', name:'Tangerines 1kg', brand:'Local', category:'fruits', image:'img/tangerines.png', emoji:'🍊', weight:'1000g', price:{magnum:780, small:750, green:760, artem:790, magnum_turk:770, firkan_turk:720, magnum_shym:770, gramad_shym:795}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:41, description:'Sweet, juicy, and easy-to-peel tangerines.', unitType:'per 100g', tags:['tangerines','fruits','fresh','citrus','sweet'] },
  // Frozen Foods
  { id:'p941', name:'Frozen Pizza', brand:'Ristorante', category:'frozen', image:'img/frozen_pizza.png', emoji:'🍕', weight:'340g', price:{magnum:1600, small:1500, green:1550, artem:1580, magnum_turk:1550, firkan_turk:1480, magnum_shym:1550, gramad_shym:1595}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:35, description:'Delicious thin-crust mozzarella & tomato pizza.', unitType:'per 100g', tags:['pizza','frozen','convenience','dinner','mozzarella'] },
  { id:'p943', name:'Ice Cream', brand:'Baskin Robbins', category:'frozen', image:'img/ice_cream.png', emoji:'🍨', weight:'500ml', price:{magnum:2800, small:2650, green:2700, artem:2900, magnum_turk:2720, firkan_turk:2600, magnum_shym:2720, gramad_shym:2820}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:26, description:'Rich and creamy vanilla bean ice cream tub.', unitType:'per 100ml', tags:['ice cream','frozen','sweet','dessert','vanilla'] },
  { id:'p945', name:'Frozen Berries', brand:'Hortex', category:'frozen', image:'img/frozen_berries.png', emoji:'🫐', weight:'300g', price:{magnum:1100, small:1050, green:1080, artem:1120, magnum_turk:1090, firkan_turk:1000, magnum_shym:1090, gramad_shym:1115}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:30, description:'Frozen mixed berries (strawberries, raspberries, blueberries).', unitType:'per 100g', tags:['berries','frozen','mix','sweet','healthy','dessert'] },
  { id:'p946', name:'Chicken Nuggets', brand:'Sadia', category:'frozen', image:'img/chicken_nuggets.png', emoji:'🍗', weight:'500g', price:{magnum:1450, small:1380, green:1420, artem:1400, magnum_turk:1420, firkan_turk:1350, magnum_shym:1420, gramad_shym:1460}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:40, description:'Crispy breaded chicken breast nuggets.', unitType:'per 100g', tags:['chicken','nuggets','frozen','snack','dinner'] },
  { id:'p947', name:'Frozen Dumplings', brand:'Siberian', category:'frozen', image:'img/frozen_dumplings.png', emoji:'🥟', weight:'800g', price:{magnum:1800, small:1700, green:1750, artem:1780, magnum_turk:1760, firkan_turk:1680, magnum_shym:1760, gramad_shym:1820}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:33, description:'Traditional Siberian style beef pelmeni (dumplings).', unitType:'per 100g', tags:['pelmeni','dumplings','frozen','russian','beef'] },
  { id:'p948', name:'Frozen Fish Fillet', brand:'Premium', category:'frozen', image:'img/frozen_fish_fillet.png', emoji:'🐟', weight:'600g', price:{magnum:2400, small:2250, green:2350, artem:2300, magnum_turk:2335, firkan_turk:2200, magnum_shym:2335, gramad_shym:2390}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:22, description:'Boneless, skinless white fish fillets, quick frozen.', unitType:'per 100g', tags:['fish','seafood','frozen','healthy','fillet'] },
  { id:'p949', name:'Frozen Shrimp', brand:'Ocean', category:'frozen', image:'img/frozen_shrimp.png', emoji:'🦐', weight:'500g', price:{magnum:3200, small:2950, green:3100, artem:3050, magnum_turk:3080, firkan_turk:2900, magnum_shym:3080, gramad_shym:3180}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:18, description:'Peeled and deveined tail-on frozen shrimp.', unitType:'per 100g', tags:['shrimp','seafood','frozen','premium'] },
  { id:'p951', name:'Ready Meals', brand:'Hortex', category:'frozen', image:'img/ready_meals.png', emoji:'🍱', weight:'400g', price:{magnum:1250, small:1180, green:1200, artem:1220, magnum_turk:1210, firkan_turk:1150, magnum_shym:1210, gramad_shym:1260}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:29, description:'Quick frozen pasta with chicken and vegetables.', unitType:'per 100g', tags:['meal','ready meal','frozen','convenience','dinner'] },
  { id:'p954', name:'Frozen Chicken Wings', brand:'Alatau', category:'frozen', image:'img/frozen_chicken_wings.png', emoji:'🍗', weight:'1000g', price:{magnum:1850, small:1750, green:1800, artem:1820, magnum_turk:1810, firkan_turk:1720, magnum_shym:1810, gramad_shym:1860}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:25, description:'Frozen chicken wings, ready for baking or frying.', unitType:'per 100g', tags:['chicken','wings','frozen','meat','snack'] },
  { id:'p955', name:'Frozen Meatballs', brand:'Sadia', category:'frozen', image:'img/frozen_meatballs.png', emoji:'🍖', weight:'500g', price:{magnum:1350, small:1280, green:1300, artem:1320, magnum_turk:1310, firkan_turk:1240, magnum_shym:1310, gramad_shym:1360}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:31, description:'Seasoned beef meatballs, great for spaghetti.', unitType:'per 100g', tags:['meatballs','beef','frozen','dinner'] },
  { id:'p956', name:'Frozen Spinach', brand:'Hortex', category:'frozen', image:'img/frozen_spinach.png', emoji:'🥬', weight:'400g', price:{magnum:550, small:500, green:520, artem:540, magnum_turk:530, firkan_turk:490, magnum_shym:530, gramad_shym:560}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:48, description:'Whole leaf frozen spinach, packed with iron.', unitType:'per 100g', tags:['spinach','greens','frozen','healthy','vegetables'] },
  { id:'p957', name:'Frozen Broccoli', brand:'Hortex', category:'frozen', image:'img/frozen_broccoli.png', emoji:'🥦', weight:'400g', price:{magnum:680, small:630, green:650, artem:660, magnum_turk:655, firkan_turk:610, magnum_shym:655, gramad_shym:685}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:41, description:'Freshly frozen green broccoli florets.', unitType:'per 100g', tags:['broccoli','vegetables','frozen','healthy'] },
  { id:'p959', name:'Frozen Mozzarella Sticks', brand:'Sadia', category:'frozen', image:'img/frozen_mozzarella_sticks.png', emoji:'🧀', weight:'250g', price:{magnum:1150, small:1080, green:1100, artem:1120, magnum_turk:1110, firkan_turk:1050, magnum_shym:1110, gramad_shym:1160}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:35, description:'Crispy breaded mozzarella cheese sticks.', unitType:'per 100g', tags:['cheese','mozzarella','frozen','snack','appetizer'] },
  { id:'f001', name:'Frozen Peas', brand:'Hortex', category:'frozen', image:'img/frozen_peas.png', emoji:'🟢', weight:'400g', price:{magnum:580, small:550, green:570, artem:590, magnum_turk:580, firkan_turk:550, magnum_shym:580, gramad_shym:600}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:50, description:'Sweet frozen green peas.', unitType:'per 100g', tags:['peas','vegetables','frozen','healthy'] },
  { id:'f002', name:'Frozen Corn', brand:'Hortex', category:'frozen', image:'img/frozen_corn.png', emoji:'🌽', weight:'400g', price:{magnum:620, small:590, green:600, artem:630, magnum_turk:620, firkan_turk:590, magnum_shym:620, gramad_shym:640}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:45, description:'Sweet frozen corn kernels.', unitType:'per 100g', tags:['corn','vegetables','frozen','healthy'] },
  { id:'f003', name:'Frozen Fried Rice', brand:'Asian Kitchen', category:'frozen', image:'img/frozen_fried_rice.png', emoji:'🍚', weight:'400g', price:{magnum:1100, small:1050, green:1080, artem:1120, magnum_turk:1100, firkan_turk:1050, magnum_shym:1100, gramad_shym:1150}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:35, description:'Ready to heat vegetable fried rice.', unitType:'per 100g', tags:['rice','fried rice','frozen','convenience'] },
  { id:'f004', name:'Mixed Vegetables', brand:'Hortex', category:'frozen', image:'img/mixed_vegetables.png', emoji:'🥗', weight:'400g', price:{magnum:700, small:660, green:680, artem:710, magnum_turk:700, firkan_turk:660, magnum_shym:700, gramad_shym:730}, stock:{magnum:'in',small:'in',green:'in',artem:'in', magnum_turk:'in', firkan_turk:'in', magnum_shym:'in', gramad_shym:'in'}, stockQuantity:50, description:'Classic mixed vegetables.', unitType:'per 100g', tags:['vegetables','mix','frozen','healthy'] },

];

// ── DYNAMIC DATA ENRICHMENT ──
// Auto-populate price and stock for the new Shymkent and Turkestan specialty stores
(function enrichProducts() {
  const storeMap = {
    'international': ['korean_shym', 'asia_turk'],
    'special_diet':  ['health_shym', 'eco_turk'],
    'fitness':       ['sports_shym', 'fit_turk'],
    'organic':       ['organic_shym', 'eco_turk']
  };

  _raw_PRODUCTS.forEach(p => {
    // Find an existing price to base the new price on (fallback to 1000 if none)
    const existingPrices = Object.values(p.price).filter(v => v > 0);
    const basePrice = existingPrices.length > 0 ? existingPrices[0] : 1000;

    const targetStores = storeMap[p.category];
    if (targetStores) {
      targetStores.forEach(storeId => {
        // Add a slight randomization to the price (-5% to +5%)
        const variation = 0.95 + (Math.random() * 0.1);
        p.price[storeId] = Math.round(basePrice * variation);
        
        // Randomly assign stock status
        p.stock[storeId] = Math.random() > 0.15 ? 'in' : 'low';
      });
    }
  });
})();

// ── RECIPES ──
const _raw_RECIPES = [
  {
    "id": "beshbarmak",
    "name": "Beshbarmak",
    "emoji": "\ud83c\udf72",
    "category": "Kazakh Cuisine",
    "servings": "6",
    "ingredients": [
      "p012",
      "p011",
      "p023",
      "p019"
    ],
    "quantities": {
      "p012": "1.5 kg",
      "p011": "500 g",
      "p023": "2 pcs",
      "p019": "400 g"
    }
  },
  {
    "id": "plov",
    "name": "Kazakh Plov",
    "emoji": "\ud83c\udf5b",
    "category": "Kazakh Cuisine",
    "servings": "6",
    "ingredients": [
      "g003",
      "p012",
      "p016",
      "p019",
      "p022"
    ],
    "quantities": {
      "g003": "1 kg",
      "p012": "800 g",
      "p016": "800 g",
      "p019": "300 g",
      "p022": "200 ml"
    }
  },
  {
    "id": "kuyrdak",
    "name": "Kuyrdak",
    "emoji": "\ud83e\udd69",
    "category": "Kazakh Cuisine",
    "servings": "4",
    "ingredients": [
      "p012",
      "p015",
      "p019",
      "p004"
    ],
    "quantities": {
      "p012": "1 kg",
      "p015": "600 g",
      "p019": "400 g",
      "p004": "100 g"
    }
  },
  {
    "id": "manti",
    "name": "Manti",
    "emoji": "\ud83e\udd5f",
    "category": "Kazakh Cuisine",
    "servings": "4",
    "ingredients": [
      "p602",
      "p019",
      "p011",
      "p004"
    ],
    "quantities": {
      "p602": "600 g",
      "p019": "500 g",
      "p011": "400 g",
      "p004": "50 g"
    }
  },
  {
    "id": "baursaks",
    "name": "Baursaks",
    "emoji": "\ud83e\udd6f",
    "category": "Kazakh Cuisine",
    "servings": "8",
    "ingredients": [
      "p011",
      "p001",
      "p022"
    ],
    "quantities": {
      "p011": "1 kg",
      "p001": "500 ml",
      "p022": "300 ml"
    }
  },
  {
    "id": "lagman",
    "name": "Lagman",
    "emoji": "\ud83c\udf5c",
    "category": "Kazakh Cuisine",
    "servings": "4",
    "ingredients": [
      "p055",
      "p012",
      "p019",
      "p020"
    ],
    "quantities": {
      "p055": "600 g",
      "p012": "400 g",
      "p019": "200 g",
      "p020": "50 g"
    }
  },
  {
    "id": "kespe",
    "name": "Kespe Soup",
    "emoji": "\ud83c\udf5c",
    "category": "Kazakh Cuisine",
    "servings": "4",
    "ingredients": [
      "p011",
      "p012",
      "p019"
    ],
    "quantities": {
      "p011": "300 g",
      "p012": "500 g",
      "p019": "100 g"
    }
  },
  {
    "id": "shelpek",
    "name": "Shelpek",
    "emoji": "\ud83e\uded3",
    "category": "Kazakh Cuisine",
    "servings": "7",
    "ingredients": [
      "p011",
      "p001",
      "p004",
      "p022"
    ],
    "quantities": {
      "p011": "500 g",
      "p001": "200 ml",
      "p004": "50 g",
      "p022": "300 ml"
    }
  },
  {
    "id": "shurpa",
    "name": "Shurpa",
    "emoji": "\ud83c\udf72",
    "category": "Kazakh Cuisine",
    "servings": "4",
    "ingredients": [
      "p604",
      "p015",
      "p016",
      "p019"
    ],
    "quantities": {
      "p604": "800 g",
      "p015": "500 g",
      "p016": "300 g",
      "p019": "200 g"
    }
  },
  {
    "id": "syrne",
    "name": "Syrne",
    "emoji": "\ud83c\udf56",
    "category": "Kazakh Cuisine",
    "servings": "6",
    "ingredients": [
      "p604",
      "p019",
      "p015"
    ],
    "quantities": {
      "p604": "1.8 kg",
      "p019": "800 g",
      "p015": "1 kg"
    }
  },
  {
    "id": "kazy_platter",
    "name": "Kazy Platter",
    "emoji": "\ud83e\udd69",
    "category": "Kazakh Cuisine",
    "servings": "8",
    "ingredients": [
      "p604",
      "p019",
      "p008"
    ],
    "quantities": {
      "p604": "1 kg",
      "p019": "150 g",
      "p008": "2 pcs"
    }
  },
  {
    "id": "baursak_honey",
    "name": "Sweet Baursaks",
    "emoji": "\ud83c\udf6f",
    "category": "Kazakh Cuisine",
    "servings": "6",
    "ingredients": [
      "p011",
      "p001",
      "p022"
    ],
    "quantities": {
      "p011": "500 g",
      "p001": "200 ml",
      "p022": "500 ml"
    }
  },
  {
    "id": "oatmeal_berries",
    "name": "Oatmeal with Berries",
    "emoji": "\ud83e\udd63",
    "category": "Breakfast",
    "servings": "2",
    "ingredients": [
      "p201",
      "p001",
      "p925"
    ],
    "quantities": {
      "p201": "150 g",
      "p001": "500 ml",
      "p925": "100 g"
    }
  },
  {
    "id": "shakshuka",
    "name": "Shakshuka",
    "emoji": "\ud83c\udf73",
    "category": "Breakfast",
    "servings": "3",
    "ingredients": [
      "p023",
      "p069",
      "p019"
    ],
    "quantities": {
      "p023": "6 pcs",
      "p069": "400 g",
      "p019": "150 g"
    }
  },
  {
    "id": "french_toast",
    "name": "Classic French Toast",
    "emoji": "\ud83c\udf5e",
    "category": "Breakfast",
    "servings": "2",
    "ingredients": [
      "p503",
      "p023",
      "p001",
      "p004"
    ],
    "quantities": {
      "p503": "4 slices",
      "p023": "3 pcs",
      "p001": "100 ml",
      "p004": "30 g"
    }
  },
  {
    "id": "classic_omelette",
    "name": "Classic Omelette",
    "emoji": "\ud83e\udd5a",
    "category": "Breakfast",
    "servings": "1",
    "ingredients": [
      "p023",
      "p001",
      "p064",
      "p004"
    ],
    "quantities": {
      "p023": "3 pcs",
      "p001": "30 ml",
      "p064": "50 g",
      "p004": "15 g"
    }
  },
  {
    "id": "pancakes_syrup",
    "name": "Pancakes with Syrup",
    "emoji": "\ud83e\udd5e",
    "category": "Breakfast",
    "servings": "3",
    "ingredients": [
      "p011",
      "p001",
      "p023",
      "p004"
    ],
    "quantities": {
      "p011": "250 g",
      "p001": "300 ml",
      "p023": "1 pc",
      "p004": "40 g"
    }
  },
  {
    "id": "avocado_toast",
    "name": "Avocado Toast",
    "emoji": "\ud83e\udd51",
    "category": "Breakfast",
    "servings": "2",
    "ingredients": [
      "p504",
      "p023",
      "p022"
    ],
    "quantities": {
      "p504": "2 slices",
      "p023": "2 pcs",
      "p022": "15 ml"
    }
  },
  {
    "id": "eggs_benedict",
    "name": "Eggs Benedict",
    "emoji": "\ud83e\udd5a",
    "category": "Breakfast",
    "servings": "2",
    "ingredients": [
      "p503",
      "p023",
      "p004",
      "p926"
    ],
    "quantities": {
      "p503": "2 pcs",
      "p023": "4 pcs",
      "p004": "150 g",
      "p926": "1 pc"
    }
  },
  {
    "id": "crepes_berries",
    "name": "Crepes with Berries",
    "emoji": "\ud83e\udd5e",
    "category": "Breakfast",
    "servings": "3",
    "ingredients": [
      "p011",
      "p001",
      "p023",
      "p925"
    ],
    "quantities": {
      "p011": "150 g",
      "p001": "350 ml",
      "p023": "2 pcs",
      "p925": "150 g"
    }
  },
  {
    "id": "waffles_cream",
    "name": "Belgian Waffles",
    "emoji": "\ud83e\uddc7",
    "category": "Breakfast",
    "servings": "2",
    "ingredients": [
      "p011",
      "p001",
      "p023"
    ],
    "quantities": {
      "p011": "200 g",
      "p001": "200 ml",
      "p023": "1 pc"
    }
  },
  {
    "id": "caesar_salad",
    "name": "Chicken Caesar Salad",
    "emoji": "\ud83e\udd57",
    "category": "Lunch",
    "servings": "2",
    "ingredients": [
      "p013",
      "p008",
      "p064"
    ],
    "quantities": {
      "p013": "300 g",
      "p008": "100 g",
      "p064": "50 g"
    }
  },
  {
    "id": "tomato_soup",
    "name": "Tomato Basil Soup",
    "emoji": "\ud83c\udf72",
    "category": "Lunch",
    "servings": "4",
    "ingredients": [
      "p069",
      "p042"
    ],
    "quantities": {
      "p069": "1000 g",
      "p042": "200 ml"
    }
  },
  {
    "id": "beef_quesadilla",
    "name": "Beef Quesadilla",
    "emoji": "\ud83c\udf2e",
    "category": "Lunch",
    "servings": "2",
    "ingredients": [
      "p503",
      "p602",
      "p064"
    ],
    "quantities": {
      "p503": "4 pcs",
      "p602": "250 g",
      "p064": "150 g"
    }
  },
  {
    "id": "cobb_salad",
    "name": "Cobb Salad",
    "emoji": "\ud83e\udd57",
    "category": "Lunch",
    "servings": "2",
    "ingredients": [
      "p013",
      "p023"
    ],
    "quantities": {
      "p013": "200 g",
      "p023": "2 pcs"
    }
  },
  {
    "id": "minestrone_soup",
    "name": "Minestrone Soup",
    "emoji": "\ud83c\udf72",
    "category": "Lunch",
    "servings": "4",
    "ingredients": [
      "p016",
      "p055"
    ],
    "quantities": {
      "p016": "150 g",
      "p055": "100 g"
    }
  },
  {
    "id": "club_sandwich",
    "name": "Club Sandwich",
    "emoji": "\ud83e\udd6a",
    "category": "Lunch",
    "servings": "1",
    "ingredients": [
      "p503",
      "p013"
    ],
    "quantities": {
      "p503": "3 slices",
      "p013": "120 g"
    }
  },
  {
    "id": "greek_salad",
    "name": "Greek Salad",
    "emoji": "\ud83e\udd57",
    "category": "Lunch",
    "servings": "2",
    "ingredients": [
      "p069",
      "p064",
      "p022"
    ],
    "quantities": {
      "p069": "300 g",
      "p064": "150 g",
      "p022": "30 ml"
    }
  },
  {
    "id": "broccoli_cheddar_soup",
    "name": "Broccoli Cheddar Soup",
    "emoji": "\ud83c\udf72",
    "category": "Lunch",
    "servings": "4",
    "ingredients": [
      "p064",
      "p001",
      "p011",
      "p004"
    ],
    "quantities": {
      "p064": "200 g",
      "p001": "500 ml",
      "p011": "30 g",
      "p004": "50 g"
    }
  },
  {
    "id": "lentil_soup",
    "name": "Lentil Soup",
    "emoji": "\ud83e\udd63",
    "category": "Lunch",
    "servings": "4",
    "ingredients": [
      "p016",
      "p019"
    ],
    "quantities": {
      "p016": "100 g",
      "p019": "100 g"
    }
  },
  {
    "id": "beef_stroganoff",
    "name": "Beef Stroganoff",
    "emoji": "\ud83c\udf5b",
    "category": "Dinner",
    "servings": "4",
    "ingredients": [
      "p603",
      "p019",
      "p005",
      "p055"
    ],
    "quantities": {
      "p603": "600 g",
      "p019": "150 g",
      "p005": "200 g",
      "p055": "400 g"
    }
  },
  {
    "id": "grilled_salmon",
    "name": "Grilled Salmon",
    "emoji": "\ud83d\udc1f",
    "category": "Dinner",
    "servings": "2",
    "ingredients": [
      "p014",
      "p926",
      "p022"
    ],
    "quantities": {
      "p014": "400 g",
      "p926": "1 pc",
      "p022": "20 ml"
    }
  },
  {
    "id": "spaghetti_bolognese",
    "name": "Spaghetti Bolognese",
    "emoji": "\ud83c\udf5d",
    "category": "Dinner",
    "servings": "4",
    "ingredients": [
      "p055",
      "p602",
      "p069",
      "p019"
    ],
    "quantities": {
      "p055": "400 g",
      "p602": "500 g",
      "p069": "800 g",
      "p019": "150 g"
    }
  },
  {
    "id": "chicken_alfredo",
    "name": "Chicken Alfredo",
    "emoji": "\ud83c\udf5d",
    "category": "Dinner",
    "servings": "3",
    "ingredients": [
      "p055",
      "p013",
      "p042",
      "p004"
    ],
    "quantities": {
      "p055": "350 g",
      "p013": "400 g",
      "p042": "250 ml",
      "p004": "50 g"
    }
  },
  {
    "id": "chicken_curry",
    "name": "Chicken Curry",
    "emoji": "\ud83c\udf5b",
    "category": "Dinner",
    "servings": "4",
    "ingredients": [
      "p013",
      "p019",
      "p021"
    ],
    "quantities": {
      "p013": "500 g",
      "p019": "150 g",
      "p021": "300 g"
    }
  },
  {
    "id": "beef_stirfry",
    "name": "Beef Stir-Fry",
    "emoji": "\ud83c\udf72",
    "category": "Dinner",
    "servings": "3",
    "ingredients": [
      "p012",
      "p016",
      "p101",
      "p021"
    ],
    "quantities": {
      "p012": "450 g",
      "p016": "150 g",
      "p101": "50 ml",
      "p021": "250 g"
    }
  },
  {
    "id": "shepherds_pie",
    "name": "Shepherd's Pie",
    "emoji": "\ud83e\udd67",
    "category": "Dinner",
    "servings": "4",
    "ingredients": [
      "p602",
      "p015",
      "p016",
      "p019",
      "p004"
    ],
    "quantities": {
      "p602": "500 g",
      "p015": "800 g",
      "p016": "100 g",
      "p019": "100 g",
      "p004": "50 g"
    }
  },
  {
    "id": "baked_cod",
    "name": "Baked Cod",
    "emoji": "\ud83d\udc1f",
    "category": "Dinner",
    "servings": "3",
    "ingredients": [
      "p948",
      "p015",
      "p004",
      "p926"
    ],
    "quantities": {
      "p948": "500 g",
      "p015": "600 g",
      "p004": "60 g",
      "p926": "1 pc"
    }
  },
  {
    "id": "baked_chicken_veg",
    "name": "Baked Chicken with Veg",
    "emoji": "\ud83c\udf57",
    "category": "Dinner",
    "servings": "4",
    "ingredients": [
      "p013",
      "p015",
      "p016"
    ],
    "quantities": {
      "p013": "800 g",
      "p015": "600 g",
      "p016": "400 g"
    }
  },
  {
    "id": "beef_chili",
    "name": "Beef Chili",
    "emoji": "\ud83c\udf36\ufe0f",
    "category": "Dinner",
    "servings": "4",
    "ingredients": [
      "p602",
      "p069",
      "p064"
    ],
    "quantities": {
      "p602": "500 g",
      "p069": "400 g",
      "p064": "100 g"
    }
  },
  {
    "id": "double_cheeseburger",
    "name": "Double Cheeseburger",
    "emoji": "\ud83c\udf54",
    "category": "Fast Food",
    "servings": "2",
    "ingredients": [
      "p503",
      "p602",
      "p064"
    ],
    "quantities": {
      "p503": "2 buns",
      "p602": "400 g",
      "p064": "4 slices"
    }
  },
  {
    "id": "chicken_tenders",
    "name": "Chicken Tenders",
    "emoji": "\ud83c\udf57",
    "category": "Fast Food",
    "servings": "3",
    "ingredients": [
      "p013",
      "p011",
      "p023",
      "p022"
    ],
    "quantities": {
      "p013": "600 g",
      "p011": "150 g",
      "p023": "2 pcs",
      "p022": "800 ml"
    }
  },
  {
    "id": "pepperoni_pizza",
    "name": "Pepperoni Pizza",
    "emoji": "\ud83c\udf55",
    "category": "Fast Food",
    "servings": "4",
    "ingredients": [
      "p941",
      "p064"
    ],
    "quantities": {
      "p941": "1 pc",
      "p064": "250 g"
    }
  },
  {
    "id": "french_fries",
    "name": "Classic French Fries",
    "emoji": "\ud83c\udf5f",
    "category": "Fast Food",
    "servings": "3",
    "ingredients": [
      "p015",
      "p022"
    ],
    "quantities": {
      "p015": "1000 g",
      "p022": "1000 ml"
    }
  },
  {
    "id": "loaded_nachos",
    "name": "Loaded Nachos",
    "emoji": "\ud83c\udf7f",
    "category": "Fast Food",
    "servings": "4",
    "ingredients": [
      "p602",
      "p064",
      "p005"
    ],
    "quantities": {
      "p602": "200 g",
      "p064": "200 ml",
      "p005": "100 g"
    }
  },
  {
    "id": "beef_tacos",
    "name": "Beef Tacos",
    "emoji": "\ud83c\udf2e",
    "category": "Fast Food",
    "servings": "3",
    "ingredients": [
      "p602",
      "p064"
    ],
    "quantities": {
      "p602": "350 g",
      "p064": "100 g"
    }
  },
  {
    "id": "hot_dog",
    "name": "Classic Hot Dog",
    "emoji": "\ud83c\udf2d",
    "category": "Fast Food",
    "servings": "2",
    "ingredients": [
      "p503",
      "p022"
    ],
    "quantities": {
      "p503": "2 buns",
      "p022": "15 ml"
    }
  },
  {
    "id": "onion_rings",
    "name": "Crispy Onion Rings",
    "emoji": "\ud83e\uddc5",
    "category": "Fast Food",
    "servings": "3",
    "ingredients": [
      "p019",
      "p011",
      "p022"
    ],
    "quantities": {
      "p019": "400 g",
      "p011": "150 g",
      "p022": "500 ml"
    }
  },
  {
    "id": "lava_cake",
    "name": "Chocolate Lava Cake",
    "emoji": "\ud83e\uddc1",
    "category": "Desserts",
    "servings": "2",
    "ingredients": [
      "p004",
      "p011",
      "p023"
    ],
    "quantities": {
      "p004": "60 g",
      "p011": "30 g",
      "p023": "2 pcs"
    }
  },
  {
    "id": "cheesecake",
    "name": "Classic Cheesecake",
    "emoji": "\ud83c\udf70",
    "category": "Desserts",
    "servings": "8",
    "ingredients": [
      "p063",
      "p004",
      "p023"
    ],
    "quantities": {
      "p063": "600 g",
      "p004": "80 g",
      "p023": "3 pcs"
    }
  },
  {
    "id": "apple_crisp",
    "name": "Warm Apple Crisp",
    "emoji": "\ud83c\udf4e",
    "category": "Desserts",
    "servings": "4",
    "ingredients": [
      "p921",
      "p011",
      "p201",
      "p004"
    ],
    "quantities": {
      "p921": "600 g",
      "p011": "100 g",
      "p201": "80 g",
      "p004": "75 g"
    }
  },
  {
    "id": "chocolate_cookies",
    "name": "Chocolate Chip Cookies",
    "emoji": "\ud83c\udf6a",
    "category": "Desserts",
    "servings": "12",
    "ingredients": [
      "p011",
      "p004",
      "p023"
    ],
    "quantities": {
      "p011": "280 g",
      "p004": "170 g",
      "p023": "2 pcs"
    }
  },
  {
    "id": "panna_cotta",
    "name": "Berry Panna Cotta",
    "emoji": "\ud83c\udf6e",
    "category": "Desserts",
    "servings": "4",
    "ingredients": [
      "p042",
      "p945"
    ],
    "quantities": {
      "p042": "500 ml",
      "p945": "200 g"
    }
  },
  {
    "id": "tiramisu",
    "name": "Classic Tiramisu",
    "emoji": "\ud83c\udf70",
    "category": "Desserts",
    "servings": "6",
    "ingredients": [
      "p001"
    ],
    "quantities": {
      "p001": "500 ml"
    }
  },
  {
    "id": "brownies",
    "name": "Fudgy Brownies",
    "emoji": "\ud83c\udf6b",
    "category": "Desserts",
    "servings": "9",
    "ingredients": [
      "p004",
      "p023",
      "p011"
    ],
    "quantities": {
      "p004": "110 g",
      "p023": "2 pcs",
      "p011": "60 g"
    }
  },
  {
    "id": "fruit_tart",
    "name": "Glazed Fruit Tart",
    "emoji": "\ud83c\udf53",
    "category": "Desserts",
    "servings": "8",
    "ingredients": [
      "p011",
      "p004",
      "p925"
    ],
    "quantities": {
      "p011": "300 g",
      "p004": "150 g",
      "p925": "200 g"
    }
  },
  {
    "id": "lemon_bars",
    "name": "Lemon Bars",
    "emoji": "\ud83c\udf4b",
    "category": "Desserts",
    "servings": "8",
    "ingredients": [
      "p926",
      "p011",
      "p004",
      "p023"
    ],
    "quantities": {
      "p926": "150 ml",
      "p011": "180 g",
      "p004": "110 g",
      "p023": "4 pcs"
    }
  }
];

// ── HELPER FUNCTIONS ──

function getProductById(id) {
  if (!Array.isArray(PRODUCTS)) return null;
  return PRODUCTS.find(p => p && p.id === id) || null;
}

function getStoreById(id) {
  if (!Array.isArray(STORES)) return null;
  return STORES.find(s => s && s.id === id) || null;
}

function getStoresForProduct(product, cityId) {
  if (!product || !product.price) return [];
  try {
    const cityStores = getStoresForCity(cityId);
    if (!Array.isArray(cityStores)) return [];
    return cityStores.filter(s => s && product.price[s.id] > 0);
  } catch (e) {
    console.error("Error in getStoresForProduct:", e);
    return [];
  }
}

// Fallback: get stores across ALL cities (for data integrity checks)
function getStoresForProductAllCities(product) {
  if (!product || !product.price || !Array.isArray(STORES)) return [];
  return STORES.filter(s => s && product.price[s.id] > 0);
}

function getCheapestStore(product, cityId) {
  if (!product || !product.price) return null;
  try {
    const stores = getStoresForProduct(product, cityId);
    if (!stores || !stores.length) return null;
    return stores.reduce((cheapest, s) => {
      if (!s) return cheapest;
      if (!cheapest || product.price[s.id] < product.price[cheapest]) return s.id;
      return cheapest;
    }, null);
  } catch (e) {
    console.error("Error in getCheapestStore:", e);
    return null;
  }
}

function searchProducts(query) {
  if (!query || typeof query !== 'string' || !Array.isArray(PRODUCTS)) return [];
  const q = query.toLowerCase();
  return PRODUCTS.filter(p => {
    if (!p || !p.name || !p.brand) return false;
    return p.name.toLowerCase().includes(q) || 
           p.brand.toLowerCase().includes(q) || 
           (Array.isArray(p.tags) && p.tags.some(t => t && t.toLowerCase().includes(q)));
  });
}

function getUnitPrice(product, storeId) {
  if (!product || !product.price) return null;
  const price = product.price[storeId];
  const wt = product.rawWeight || product.weight;
  if (!price || !wt) return null;
  try {
    const match = wt.match(/(\d+)(g|ml|pcs)/);
    if (!match) return { value: price, label: 'per piece' };
    const amount = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'pcs') return { value: price, label: 'per piece' };
    const value = Math.round((price / amount) * 100);
    return { value, label: `per 100${unit}` };
  } catch (e) {
    console.error("Error in getUnitPrice:", e);
    return null;
  }
}

function generatePriceHistory(current) {
  const days = [];
  let price = current;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const variation = (Math.random() - 0.48) * current * 0.06;
    price = Math.max(current * 0.85, Math.min(current * 1.15, price + variation));
    days.push({ date: d.toLocaleDateString('en-KZ', {month:'short',day:'numeric'}), price: Math.round(price) });
  }
  days[days.length - 1].price = current;
  return days;
}

// ── STOCK PATTERNS (mock insights) ──
const _raw_STOCK_PATTERNS = {
  magnum: { insight:'Usually restocked Tuesday & Friday mornings', icon:'📦' },
  small:  { insight:'Fresh dairy delivered daily before 9am', icon:'🌅' },
  green:  { insight:'Best selection of imported goods on Thursdays', icon:'🌍' },
  artem:  { insight:'Weekend sales every Saturday', icon:'🏷️' },
  korean_market: { insight:'New Korean products arrive every Monday', icon:'🇰🇷' },
  iu_market:     { insight:'Open 24 hours — late-night Asian snacks', icon:'🌙' },
  emart:         { insight:'Best prices on Korean ramen & sauces', icon:'🍜' },
  interfood:     { insight:'Wide range of diet & allergen-free products', icon:'🌱' },
  powerlife:     { insight:'Best prices on sports supplements & protein', icon:'💪' },
};

// ── FRESHNESS REPORTS (mock crowdsourced) ──
const _raw_FRESHNESS = {
  p001: { fresh:12, warn:1, lastReport:'2 hrs ago' },
  p002: { fresh:8,  warn:3, lastReport:'4 hrs ago' },
  p006: { fresh:5,  warn:0, lastReport:'1 hr ago'  },
};

// ── CITY SELECTOR & MODALS INJECTION ──
document.addEventListener("DOMContentLoaded", () => {

  // ── INJECT CITY SELECTOR INTO NAVBAR ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const currentCity = getSelectedCity();
    const cityInfo = getCityInfo(currentCity);

    const citySelectorHTML = `
      <div class="city-selector" id="citySelectorWrap" style="position:relative;margin-left:.5rem;">
        <button id="citySelectorBtn" class="city-selector-btn" onclick="toggleCityDropdown(event)" style="
          display:inline-flex;align-items:center;gap:6px;
          padding:5px 14px 5px 10px;
          background:var(--blue-l);border:1.5px solid rgba(59,110,168,.25);
          border-radius:100px;font-size:.82rem;font-weight:600;
          color:var(--blue);cursor:pointer;white-space:nowrap;
          transition:all .2s ease;
        ">
          <span style="font-size:14px">📍</span>
          <span id="cityLabel">${t('city_' + currentCity)}</span>
          <span style="font-size:10px;opacity:.6">▾</span>
        </button>
        <div id="cityDropdown" style="
          display:none;position:absolute;top:calc(100% + 8px);left:0;
          background:var(--white);border:1px solid var(--sand);
          border-radius:14px;box-shadow:0 12px 48px rgba(0,0,0,.14);
          z-index:1001;min-width:220px;
          animation:fadeUp .2s ease;
        ">
          <div style="padding:10px 14px 6px;font-size:.72rem;font-weight:600;color:var(--muted);letter-spacing:.1em;text-transform:uppercase">Select City</div>
          <div style="max-height:240px;overflow-y:auto;border-bottom:1px solid var(--sand)">
            ${CITIES.map(c => `
              <div class="city-option" onclick="selectCity('${c.id}')" style="
                padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:10px;
                font-size:.88rem;font-weight:500;transition:background .15s;
                ${c.id === currentCity ? 'background:var(--blue-l);color:var(--blue);font-weight:700;' : 'color:var(--ink);'}
              " onmouseover="this.style.background=this.style.background||'var(--warm)'"
                 onmouseout="this.style.background='${c.id === currentCity ? 'var(--blue-l)' : ''}'">
                <span style="font-size:14px">${c.id === currentCity ? '✓' : '○'}</span>
                <span>${t('city_' + c.id) || c.name}</span>
              </div>
            `).join('')}
          </div>
          <div style="padding:8px 14px">
            <button onclick="autoDetectCity()" style="
              width:100%;padding:8px;border:1.5px dashed var(--sand);
              border-radius:8px;background:none;cursor:pointer;
              font-size:.82rem;color:var(--muted);font-weight:500;
              transition:all .2s;display:flex;align-items:center;gap:6px;justify-content:center;
            " onmouseover="this.style.borderColor='var(--blue)';this.style.color='var(--blue)'"
               onmouseout="this.style.borderColor='var(--sand)';this.style.color='var(--muted)'">
              <span>📡</span> Auto-detect Location
            </button>
          </div>
        </div>
      </div>
    `;

    // Insert after the logo
    const logo = navbar.querySelector('.navbar-logo');
    if (logo) {
      logo.insertAdjacentHTML('afterend', citySelectorHTML);
    }
  }

  const modalHTML = `
    <!-- AUTH MODAL -->
    <div class="global-modal-overlay" id="authModalOverlay">
      <div class="global-modal-content">
        <div class="global-modal-close" onclick="closeAuthModal()">✕</div>
        <div class="modal-tabs">
          <div class="modal-tab active" onclick="switchAuthTab('login')" id="tab-login">Login</div>
          <div class="modal-tab" onclick="switchAuthTab('register')" id="tab-register">Register</div>
        </div>
        
        <div class="modal-panel active" id="panel-login">
          <h2 class="modal-title">Welcome back</h2>
          <p class="modal-desc">Login to sync your carts and wishlists.</p>
          <div class="input-group mb-2">
            <label class="input-label">Email</label>
            <input type="email" class="input" id="loginEmail" placeholder="you@example.com">
          </div>
          <div class="input-group mb-3">
            <label class="input-label">Password</label>
            <input type="password" class="input" id="loginPass" placeholder="••••••••">
          </div>
          <button class="btn btn-primary w-full" onclick="doLogin()">Login</button>
        </div>

        <div class="modal-panel" id="panel-register">
          <h2 class="modal-title">Create an account</h2>
          <p class="modal-desc">Save your favorite products and preferences.</p>
          <div class="input-group mb-2">
            <label class="input-label">Email</label>
            <input type="email" class="input" id="regEmail" placeholder="you@example.com">
          </div>
          <div class="input-group mb-3">
            <label class="input-label">Password</label>
            <input type="password" class="input" id="regPass" placeholder="••••••••">
          </div>
          <button class="btn btn-primary w-full" onclick="doRegister()">Register</button>
        </div>
        
        <div class="modal-panel" id="panel-profile">
          <div class="profile-avatar">👤</div>
          <h2 class="modal-title text-center" id="profileEmailDisplay">User</h2>
          <p class="modal-desc text-center mb-3">You are currently logged in.</p>
          <button class="btn btn-ghost w-full" onclick="doLogout()">Logout</button>
        </div>
      </div>
    </div>

    <!-- WISHLIST MODAL -->
    <div class="global-modal-overlay" id="wishlistModalOverlay">
      <div class="global-modal-content">
        <div class="global-modal-close" onclick="closeWishlistModal()">✕</div>
        <h2 class="modal-title">My Wishlist</h2>
        <p class="modal-desc">Products you've saved for later.</p>
        <div id="wishlistContainer"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const navActions = document.querySelector('.navbar-actions');
  if (navActions) {
    const icons = navActions.querySelectorAll('a');
    if (icons.length >= 2) {
      const heartIcon = icons[0];
      const profileIcon = icons[1];
      
      heartIcon.onclick = (e) => { e.preventDefault(); openWishlistModal(); };
      profileIcon.onclick = (e) => { e.preventDefault(); openAuthModal(); };
      
      updateNavbarHeart();
      updateAuthNavbar();
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('global-modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  // Check if selected city has stores
  const currentCity = getSelectedCity();
  const cityStores = getStoresForCity(currentCity);
  if (cityStores.length === 0) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : (localStorage.getItem('ff_lang') || 'en');
    
    const comingSoonLoc = {
      en: {
        title: `Coming Soon to ${t('city_' + currentCity) || currentCity}!`,
        desc: "We don't have supermarket prices or store mapping for this city yet. Switch to one of our active cities to explore ShopNav.",
        btn: "Switch to Almaty"
      },
      ru: {
        title: `Скоро в городе ${t('city_' + currentCity) || currentCity}!`,
        desc: "У нас пока нет цен на супермаркеты или карт магазинов для этого города. Переключитесь на один из активных городов, чтобы изучить ShopNav.",
        btn: "Переключиться на Алматы"
      },
      kk: {
        title: `${t('city_' + currentCity) || currentCity} қаласына жақын арада келеді!`,
        desc: "Бұл қала үшін бізде супермаркет бағалары немесе дүкен карталары әлі жоқ. ShopNav мүмкіндіктерін көру үшін белсенді қалалардың біріне ауысыңыз.",
        btn: "Алматыға ауысу"
      },
      ko: {
        title: `${t('city_' + currentCity) || currentCity} 출시 예정!`,
        desc: "이 도시는 아직 마트 가격 정보나 지도 매핑이 지원되지 않습니다. ShopNav의 기능을 둘러보려면 활성화된 도시로 변경해 주세요.",
        btn: "알마티로 변경"
      }
    };
    
    const trans = comingSoonLoc[lang] || comingSoonLoc['en'];
    
    // Build select options
    const selectOptions = CITIES.map(c => {
      const isActive = ['almaty', 'shymkent', 'turkestan'].includes(c.id);
      const activeBadge = isActive ? ' (Active)' : ' (Coming Soon)';
      const cityName = t('city_' + c.id) || c.name;
      return `<option value="${c.id}" ${c.id === currentCity ? 'selected disabled' : ''}>${cityName}${activeBadge}</option>`;
    }).join('');

    const comingSoonOverlayHTML = `
      <div id="comingSoonOverlay" style="
        position: fixed; inset: 0; 
        background: rgba(26, 61, 28, 0.45); 
        backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
        z-index: 99999; display: flex; align-items: center; justify-content: center;
        padding: 1.5rem; font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          background: var(--white); border: 1px solid var(--sand);
          border-radius: 24px; max-width: 420px; width: 100%;
          padding: 2.5rem 2rem; text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
          animation: fadeUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        ">
          <div style="font-size: 3.5rem; margin-bottom: 1rem; display: inline-block; animation: pulse 2s infinite;">📍</div>
          <h2 style="
            font-size: 1.5rem; font-weight: 800; color: var(--forest);
            margin-bottom: 0.6rem; line-height: 1.2;
          ">${trans.title}</h2>
          <p style="
            font-size: 0.88rem; color: var(--muted); line-height: 1.6;
            margin-bottom: 1.75rem; text-align: left;
          ">
            ${trans.desc}
          </p>
          
          <div style="text-align: left; margin-bottom: 1.25rem;">
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">Select City</label>
            <select onchange="selectCity(this.value)" style="
              width: 100%; padding: 12px 14px; border: 1.5px solid var(--sand);
              border-radius: 12px; font-weight: 600; font-size: 0.9rem;
              color: var(--ink); outline: none; background: var(--warm);
              cursor: pointer; transition: border-color 0.2s;
            " onfocus="this.style.borderColor='var(--blue)'" onblur="this.style.borderColor='var(--sand)'">
              <option value="" disabled selected>Choose a city...</option>
              ${selectOptions}
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button onclick="selectCity('almaty')" class="btn btn-primary" style="width: 100%; font-weight: 700; height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>🏪</span> ${trans.btn}
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', comingSoonOverlayHTML);
  }
});

function updateAuthNavbar() {
  const navActions = document.querySelector('.navbar-actions');
  if (!navActions) return;
  
  const userStr = localStorage.getItem('ff_user');
  const getStartedBtn = navActions.querySelector('.nav-cta');
  let profileAvatar = navActions.querySelector('.nav-profile-btn');
  
  if (userStr) {
    const user = JSON.parse(userStr);
    const firstLetter = (user.email || 'U').charAt(0).toUpperCase();
    
    // Hide Get Started button
    if (getStartedBtn) {
      getStartedBtn.style.display = 'none';
    }
    
    // Create profile avatar if it doesn't exist
    if (!profileAvatar) {
      profileAvatar = document.createElement('button');
      profileAvatar.className = 'nav-profile-btn';
      profileAvatar.onclick = (e) => {
        e.preventDefault();
        openAuthModal();
      };
      navActions.appendChild(profileAvatar);
    }
    
    profileAvatar.textContent = firstLetter;
    profileAvatar.setAttribute('title', user.email);
    profileAvatar.style.display = 'inline-flex';
  } else {
    // Show Get Started button
    if (getStartedBtn) {
      getStartedBtn.style.display = 'inline-flex';
    }
    // Hide profile avatar if it exists
    if (profileAvatar) {
      profileAvatar.style.display = 'none';
    }
  }
}

function showModalMessage(panelId, message, type = 'success') {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  
  let msgEl = panel.querySelector('.modal-inline-message');
  if (!msgEl) {
    msgEl = document.createElement('div');
    msgEl.className = 'modal-inline-message';
    const desc = panel.querySelector('.modal-desc');
    if (desc) {
      desc.insertAdjacentElement('afterend', msgEl);
    } else {
      panel.insertBefore(msgEl, panel.firstChild);
    }
  }
  
  msgEl.className = `modal-inline-message toast toast-${type}`;
  msgEl.innerHTML = `
    <span style="font-size: 1.15rem; line-height: 1;">${type === 'success' ? '✨' : '⚠️'}</span>
    <div>${message}</div>
  `;
}

function openAuthModal() {
  document.getElementById('authModalOverlay').classList.add('open');
  const userStr = localStorage.getItem('ff_user');
  if (userStr) {
    switchAuthTab('profile');
    const user = JSON.parse(userStr);
    document.getElementById('profileEmailDisplay').textContent = user.email;
    const profileAvatarEl = document.querySelector('#panel-profile .profile-avatar');
    if (profileAvatarEl) {
      profileAvatarEl.textContent = (user.email || 'U').charAt(0).toUpperCase();
    }
  } else {
    switchAuthTab('login');
  }
}

function closeAuthModal() {
  document.getElementById('authModalOverlay').classList.remove('open');
  // Clear modal message and reset fields after transition
  setTimeout(() => {
    document.querySelectorAll('.modal-inline-message').forEach(m => m.remove());
    const regEmail = document.getElementById('regEmail');
    const regPass = document.getElementById('regPass');
    const loginEmail = document.getElementById('loginEmail');
    const loginPass = document.getElementById('loginPass');
    if (regEmail) regEmail.value = '';
    if (regPass) regPass.value = '';
    if (loginEmail) loginEmail.value = '';
    if (loginPass) loginPass.value = '';
  }, 380);
}

function switchAuthTab(tab) {
  document.querySelectorAll('#authModalOverlay .modal-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#authModalOverlay .modal-panel').forEach(p => p.classList.remove('active'));
  
  // Clear modal message
  document.querySelectorAll('.modal-inline-message').forEach(m => m.remove());
  
  const tabEl = document.getElementById('tab-'+tab);
  if (tabEl) tabEl.classList.add('active');
  
  const panelEl = document.getElementById('panel-'+tab);
  if (panelEl) panelEl.classList.add('active');
}

function doRegister() {
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value;
  if (!email || !pass) return showModalMessage('panel-register', t('alert_fill_fields'), 'danger');
  
  localStorage.setItem('ff_account', JSON.stringify({ email, pass }));
  localStorage.setItem('ff_user', JSON.stringify({ email }));
  
  showModalMessage('panel-register', t('alert_register_success'), 'success');
  updateAuthNavbar();
  
  setTimeout(() => {
    closeAuthModal();
  }, 1500);
}

function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  if (!email || !pass) return showModalMessage('panel-login', t('alert_fill_fields'), 'danger');
  
  const acc = JSON.parse(localStorage.getItem('ff_account'));
  
  if (acc && acc.email === email && acc.pass === pass) {
    localStorage.setItem('ff_user', JSON.stringify({ email }));
    showModalMessage('panel-login', t('alert_login_success'), 'success');
    updateAuthNavbar();
    
    setTimeout(() => {
      closeAuthModal();
    }, 1500);
  } else {
    showModalMessage('panel-login', t('alert_login_fail'), 'danger');
  }
}

function doLogout() {
  localStorage.removeItem('ff_user');
  updateAuthNavbar();
  showToast(t('alert_logout') || 'Logged out.');
  closeAuthModal();
}

function renderWishlist() {
  var container = document.getElementById('wishlistContainer');
  var favs = JSON.parse(localStorage.getItem('ff_favs') || '[]');
  if (favs.length === 0) {
    container.innerHTML = `<div class="wl-empty"><div class="wl-empty-icon">🤍</div><div>${t('wishlist_empty')}</div></div>`;
    return;
  }
  container.innerHTML = favs.map(function(id) {
    var p = getProductById(id);
    if (!p) return '';
    var imgHtml = p.image ? '<img src="' + p.image + '">' : (p.emoji || '');
    return '<div class="wishlist-item" onclick="window.location.href=\'product.html?id=' + p.id + '\'">' +
      '<div class="wl-img">' + imgHtml + '</div>' +
      '<div class="wl-info">' +
        '<div class="wl-name">' + p.name + '</div>' +
        '<div class="wl-brand">' + p.brand + '</div>' +
      '</div>' +
      '<div class="wl-remove" onclick="event.stopPropagation();removeFromWishlist(\'' + p.id + '\')">&times;</div>' +
    '</div>';
  }).join('');
}

function removeFromWishlist(id) {
  var favs = JSON.parse(localStorage.getItem('ff_favs') || '[]');
  favs = favs.filter(function(f) { return f !== id; });
  localStorage.setItem('ff_favs', JSON.stringify(favs));
  renderWishlist();
  updateNavbarHeart();
  var favBtn = document.getElementById('favBtn');
  if (favBtn && typeof prod !== 'undefined' && prod && prod.id === id) {
    favBtn.textContent = '🤍';
  }
  var cards = document.querySelectorAll('.product-card-fav');
  if (cards) cards.forEach(function(c) {
    var oc = c.getAttribute('onclick') || '';
    if (oc.indexOf("'" + id + "'") !== -1) {
      c.textContent = '🤍';
      c.classList.remove('active');
    }
  });
}

function doLogout() {
  localStorage.removeItem('ff_user');
  alert(t('alert_logout'));
  closeAuthModal();
}

function openWishlistModal() {
  document.getElementById('wishlistModalOverlay').classList.add('open');
  renderWishlist();
}
function closeWishlistModal() { document.getElementById('wishlistModalOverlay').classList.remove('open'); }

window.globalLikes = {};

function fetchGlobalLikes() {
  fetch('/api/likes')
    .then(r => r.json())
    .then(data => {
      if (data && data.success) {
        window.globalLikes = data.likes;
        updateAllLikesUI();
      }
    })
    .catch(err => console.error('Failed to fetch likes', err));
}

function updateAllLikesUI() {
  document.querySelectorAll('.like-count').forEach(el => {
    const pid = el.getAttribute('data-product-id');
    const count = window.globalLikes[pid] || 0;
    el.textContent = count > 0 ? ` ${count}` : '';
  });
}

async function apiToggleLike(productId, isLike) {
  const action = isLike ? 'increment' : 'decrement';
  try {
    const res = await fetch(`/api/likes/${productId}/${action}`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      window.globalLikes[productId] = data.likesCount;
      updateAllLikesUI();
    }
  } catch (err) {
    console.error('Failed to update like for', productId, err);
  }
}

function updateNavbarHeart() {
  const navActions = document.querySelector('.navbar-actions');
  if (navActions) {
    const icons = navActions.querySelectorAll('a');
    if (icons.length >= 2) {
      const favs = JSON.parse(localStorage.getItem('ff_favs') || '[]');
      icons[0].textContent = favs.length > 0 ? '❤️' : '🤍';
    }
  }
}
// Patch togFav / toggleFav after all page scripts have run
window.addEventListener('load', function() {
  fetchGlobalLikes();
  // product.html uses togFav()
  if (typeof window.togFav === 'function') {
    const _orig = window.togFav;
    window.togFav = function() { _orig(); updateNavbarHeart(); };
  }
  // search.html uses toggleFav(id, el)
  if (typeof window.toggleFav === 'function') {
    const _orig2 = window.toggleFav;
    window.toggleFav = function(id, el) { _orig2(id, el); updateNavbarHeart(); };
  }
});

// ── CITY SELECTOR FUNCTIONS ──
function toggleCityDropdown(e) {
  e && e.stopPropagation();
  const dd = document.getElementById('cityDropdown');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}

function selectCity(cityId) {
  localStorage.setItem('shopnav_city_manual', 'true');
  setSelectedCity(cityId);
  location.reload();
}

function autoDetectCity() {
  const dd = document.getElementById('cityDropdown');
  if (dd) dd.innerHTML = '<div style="padding:1.5rem;text-align:center;font-size:.85rem;color:var(--muted)">📡 Detecting location…</div>';
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    if (dd) dd.style.display = 'none';
    return;
  }
  localStorage.removeItem('shopnav_city_manual');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const detectedCity = detectCityFromCoords(pos.coords.latitude, pos.coords.longitude);
      setSelectedCity(detectedCity);
      location.reload();
    },
    () => {
      alert('Location access denied. Please select a city manually.');
      if (dd) dd.style.display = 'none';
      location.reload();
    },
    { timeout: 10000, maximumAge: 60000 }
  );
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('citySelectorWrap');
  const dd = document.getElementById('cityDropdown');
  if (dd && wrap && !wrap.contains(e.target)) {
    dd.style.display = 'none';
  }
});

// ── LOCALIZATION AND DICTIONARIES INJECTION ──

const STORE_TRANSLATIONS = {
  magnum: {
    name: { en: 'Magnum', ru: 'Магнум', kk: 'Магнум', ko: '매그넘' },
    address: { en: 'Abay Ave 109, Almaty', ru: 'пр. Абая 109, Алматы', kk: 'Абай даңғылы 109, Алматы', ko: '알마티 아바이대로 109' }
  },
  small: {
    name: { en: 'Small', ru: 'Смолл', kk: 'Смолл', ko: '스몰' },
    address: { en: 'Seifullina St 498, Almaty', ru: 'ул. Сейфуллина 498, Алматы', kk: 'Сейфуллин көшесі 498, Алматы', ko: '알마티 세이풀리나거리 498' }
  },
  green: {
    name: { en: 'Green Market', ru: 'Зеленый Базар', kk: 'Көк Базар', ko: '그린 마켓' },
    address: { en: 'Al-Farabi Ave 77, Almaty', ru: 'пр. Аль-Фараби 77, Алматы', kk: 'Әл-Фараби даңғылы 77, Алматы', ko: '알마티 알 파라비대로 77' }
  },
  artem: {
    name: { en: 'Artem', ru: 'Артем', kk: 'Артем', ko: '아르템' },
    address: { en: 'Rozybakiev St 36, Almaty', ru: 'ул. Розыбакиева 36, Алматы', kk: 'Розыбакиев көшесі 36, Алматы', ko: '알마티 로지바키예바거리 36' }
  },
  kmart: {
    name: { en: 'K-Mart Almaty', ru: 'К-Март Алматы', kk: 'К-Март Алматы', ko: 'K-마트 알마티' },
    address: { en: 'Abay Ave 150, Almaty', ru: 'пр. Абая 150, Алматы', kk: 'Абай даңғылы 150, Алматы', ko: '알마티 아바이대로 150' }
  },
  galmart: {
    name: { en: 'Galmart', ru: 'Галмарт', kk: 'Галмарт', ko: '갈마트' },
    address: { en: 'Dostyk Plaza, Almaty', ru: 'Достык Плаза, Алматы', kk: 'Достық Плаза, Алматы', ko: '알마티 도스틱 플라자' }
  },
  magnum_turk: {
    name: { en: 'Magnum Turkestan', ru: 'Магнум Туркестан', kk: 'Магнум Түркістан', ko: '매그넘 투르케스탄' },
    address: { en: 'Tauke Khan Ave, Turkestan', ru: 'пр. Тауке хана, Туркестан', kk: 'Тәуке хан даңғылы, Түркістан', ko: '투르케스탄 타우ке한대로' }
  },
  firkan_turk: {
    name: { en: 'Firkan Turkestan', ru: 'Фиркан Туркестан', kk: 'Фиркан Түркістан', ko: '피르칸 투르케스탄' },
    address: { en: 'B. Sattarkhanov Ave, Turkestan', ru: 'пр. Б. Саттарханова, Туркестан', kk: 'Б. Саттарханов даңғылы, Түркістан', ko: '투르케스탄 사타르하노프대로' }
  },
  magnum_shym: {
    name: { en: 'Magnum Shymkent', ru: 'Магнум Шымкент', kk: 'Магнум Шымкент', ko: '매그넘 쉼켄트' },
    address: { en: 'Republic Ave 15, Shymkent', ru: 'пр. Республики 15, Шымкент', kk: 'Республика даңғылы 15, Шымкент', ko: '쉼켄트 리퍼블릭대로 15' }
  },
  gramad_shym: {
    name: { en: 'Gramad Shymkent', ru: 'Грамад Шымкент', kk: 'Грамад Шымкент', ko: '그라마드 쉼켄트' },
    address: { en: 'Zhibek Zholy, Shymkent', ru: 'Жибек Жолы, Шымкент', kk: 'Жібек Жолы, Шымкент', ko: '쉼켄트 지벡 졸리' }
  },
  korean_market: {
    name: { en: 'Korean Market', ru: 'Корейский Маркет', kk: 'Корей Маркеті', ko: '코리안 마켓' },
    address: { en: 'Nazarbayev Ave 223, Almaty', ru: 'пр. Назарбаева 223, Алматы', kk: 'Назарбаев даңғылы 223, Алматы', ko: '알마티 나자르바예브대로 223' }
  },
  iu_market: {
    name: { en: 'iU market 24', ru: 'АйЮ маркет 24', kk: 'АйЮ маркет 24', ko: '아이유 마켓 24' },
    address: { en: 'Abay Ave 44, Almaty', ru: 'пр. Абая 44, Алматы', kk: 'Абай даңғылы 44, Алматы', ko: '알마티 아바이대로 44' }
  },
  emart: {
    name: { en: 'E-Mart', ru: 'И-Март', kk: 'И-Март', ko: '이마트' },
    address: { en: 'Satpayev St 90, Almaty', ru: 'ул. Сатпаева 90, Алматы', kk: 'Сәтбаев көшесі 90, Алматы', ko: '알마티 사트파예바거리 90' }
  },
  interfood: {
    name: { en: 'Interfood', ru: 'Интерфуд', kk: 'Интерфуд', ko: '인터푸드' },
    address: { en: 'Tole Bi St 59, Almaty', ru: 'ул. Толе би 59, Алматы', kk: 'Төле би көшесі 59, Алматы', ko: '알ма티 톨레ви거리 59' }
  },
  powerlife: {
    name: { en: 'PowerLife', ru: 'ПауэрЛайф', kk: 'ПауэрЛайф', ko: '파워라이프' },
    address: { en: 'Zheltoksan St 115, Almaty', ru: 'ул. Желтоксан 115, Алматы', kk: 'Желтоқсан көшесі 115, Алматы', ko: '알마티 젤톡산거리 115' }
  },
  korean_shym: {
    name: { en: 'Korean Store', ru: 'Корейский Магазин', kk: 'Корей Дүкені', ko: '한국 상점' },
    address: { en: 'Kunayev Ave 10, Shymkent', ru: 'пр. Кунаева 10, Шымкент', kk: 'Қонаев даңғылы 10, Шымкент', ko: '쉼켄트 쿠나예브대로 10' }
  },
  health_shym: {
    name: { en: 'Healthy Food', ru: 'Здоровая Еда', kk: 'Салауатты Тағам', ko: '헬시 푸드' },
    address: { en: 'Ilyayev St 25, Shymkent', ru: 'ул. Иляева 25, Шымкент', kk: 'Іляев көшесі 25, Шымкент', ko: '쉼켄트 일랴예ба거리 25' }
  },
  organic_shym: {
    name: { en: 'Organic Market', ru: 'Органик Маркет', kk: 'Органикалық Маркет', ko: '오가닉 마켓' },
    address: { en: 'Republic Ave 8, Shymkent', ru: 'пр. Республики 8, Шымкент', kk: 'Республика даңғылы 8, Шымкент', ko: '쉼켄트 리퍼бли릭대로 8' }
  },
  sports_shym: {
    name: { en: 'Sports Nutrition', ru: 'Спортивное Питание', kk: 'Спорттық Тағамдар', ko: '스포츠 뉴트리션' },
    address: { en: 'Baitursynov St 15, Shymkent', ru: 'ул. Байтурсынова 15, Шымкент', kk: 'Байтұрсынов көшесі 15, Шымкент', ko: '쉼켄트 바이투르시노프거리 15' }
  },
  asia_turk: {
    name: { en: 'Asia Food Market', ru: 'Азиатский Рынок Еды', kk: 'Азия Тағамдары Маркеті', ko: '아시아 푸드 마켓' },
    address: { en: 'Yassawi St 12, Turkestan', ru: 'ул. Яссави 12, Туркестан', kk: 'Яссауи көшесі 12, Түркістан', ko: '투르케스탄 야사위거리 12' }
  },
  eco_turk: {
    name: { en: 'Eco Food Store', ru: 'Эко Продукты', kk: 'Эко Тағамдар Дүкені', ko: '에코 푸드 스토어' },
    address: { en: 'Taukekhan Ave 50, Turkestan', ru: 'пр. Тауке хана 50, Туркестан', kk: 'Тәуке хан даңғылы 50, Түркістан', ko: '투르케스탄 Тауке хан даңғылы 50' }
  },
  fit_turk: {
    name: { en: 'Fitness Supps', ru: 'Фитнес Добавки', kk: 'Фитнес Өнімдері', ko: '피트니스 서플스' },
    address: { en: 'Zhenis Park, Turkestan', ru: 'Парк Женис, Туркестан', kk: 'Жеңіс саябағы, Түркістан', ko: '투르케스탄 제니스 공원' }
  }
};

const PRODUCT_TRANSLATIONS = {
  p001: {
    name: { en: 'Whole Milk 1L', ru: 'Цельное молоко 1л', kk: 'Майлы сүт 1л', ko: '전지분유 1L' },
    brand: { en: 'Raimbek', ru: 'Раимбек', kk: 'Раимбек', ko: '라임벡' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['milk','dairy','breakfast'], ru: ['молоко','молочные продукты','завтрак'], kk: ['сүт','сүт өнімдері','таңғы ас'], ko: ['우유','유제품','아침 식사'] }
  },
  p002: {
    name: { en: 'Milk 800ml', ru: 'Молоко 800мл', kk: 'Сүт 800мл', ko: '우유 800ml' },
    brand: { en: 'Campina', ru: 'Кампина', kk: 'Кампина', ko: '캄피나' },
    weight: { en: '800ml', ru: '800мл', kk: '800мл', ko: '800ml' },
    tags: { en: ['milk','dairy'], ru: ['молоко','молочные продукты'], kk: ['сүт','сүт өнімдері'], ko: ['우유','유제품'] }
  },
  p003: {
    name: { en: 'Kefir 1% 1L', ru: 'Кефир 1% 1л', kk: 'Кефир 1% 1л', ko: '케피어 1% 1L' },
    brand: { en: 'Bakers', ru: 'Бейкерс', kk: 'Бейкерс', ko: '베이커스' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['kefir','dairy','healthy'], ru: ['кефир','молочные продукты','здоровое питание'], kk: ['кефир','сүт өнімдері','пайдалы'], ko: ['케피어','유제품','건강식'] }
  },
  p004: {
    name: { en: 'Butter 200g', ru: 'Сливочное масло 200г', kk: 'Сары май 200г', ko: '버터 200g' },
    brand: { en: 'President', ru: 'Президент', kk: 'Президент', ko: '프레지던트' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['butter','dairy','baking'], ru: ['масло','молочные продукты','выпечка'], kk: ['май','сүт өнімдері','наубайхана'], ko: ['버터','유제품','베이킹'] }
  },
  p005: {
    name: { en: 'Sour Cream 20% 400g', ru: 'Сметана 20% 400г', kk: 'Қаймақ 20% 400г', ko: '사워크림 20% 400g' },
    brand: { en: 'Raimbek', ru: 'Раимбек', kk: 'Раимбек', ko: '라임벡' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['sour cream','dairy'], ru: ['сметана','молочные продукты'], kk: ['қаймақ','сүт өнімдері'], ko: ['사워크림','유제품'] }
  },
  p006: {
    name: { en: 'Cottage Cheese 200g', ru: 'Творог 200г', kk: 'Творог 200г', ko: '코티지 치즈 200g' },
    brand: { en: 'Milkana', ru: 'Милкана', kk: 'Милкана', ko: '밀카나' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['cottage cheese','dairy','protein'], ru: ['творог','молочные продукты','белок'], kk: ['творог','сүт өнімдері','ақуыз'], ko: ['코티지 치즈','유제품','단백질'] }
  },
  p007: {
    name: { en: 'Cheese Edam 300g', ru: 'Сыр Эдам 300г', kk: 'Эдам сыры 300г', ko: '에담 치즈 300g' },
    brand: { en: 'Hochland', ru: 'Хохланд', kk: 'Хохланд', ko: '호흘란트' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['cheese','dairy'], ru: ['сыр','молочные продукты'], kk: ['сыр','сүт өнімдері'], ko: ['치즈','유제품'] }
  },
  p008: {
    name: { en: 'White Bread 550g', ru: 'Белый хлеб 550г', kk: 'Ақ нан 550г', ko: '식빵 550g' },
    brand: { en: 'Saryarka', ru: 'Сарыарка', kk: 'Сарыарқа', ko: '사ры아르카' },
    weight: { en: '550g', ru: '550г', kk: '550г', ko: '550g' },
    tags: { en: ['bread','bakery','breakfast'], ru: ['хлеб','выпечка','завтрак'], kk: ['нан','наубайхана','таңғы ас'], ko: ['빵','베이커리','아침 식사'] }
  },
  p009: {
    name: { en: 'Rye Bread 400g', ru: 'Ржаной хлеб 400г', kk: 'Қара нан 400г', ko: '호밀빵 400g' },
    brand: { en: 'Zhambyl', ru: 'Жамбыл', kk: 'Жамбыл', ko: '잠빌' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['rye bread','bakery','healthy'], ru: ['ржаной хлеб','выпечка','здоровое питание'], kk: ['қара нан','наубайхана','пайдалы'], ko: ['호밀빵','베이커리','건강식'] }
  },
  p010: {
    name: { en: 'Buckwheat Flour 1kg', ru: 'Гречневая мука 1кг', kk: 'Қарақұмық ұны 1кг', ko: '메밀가루 1kg' },
    brand: { en: 'Makfa', ru: 'Макфа', kk: 'Макфа', ko: '막파' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['flour','buckwheat','baking'], ru: ['мука','гречка','выпечка'], kk: ['ұн','қарақұмық','наубайхана'], ko: ['밀가루','메밀','베이킹'] }
  },
  p011: {
    name: { en: 'All-purpose Flour 2kg', ru: 'Пшеничная мука 2кг', kk: 'Бидай ұны 2кг', ko: '밀가루 2kg' },
    brand: { en: 'Makfa', ru: 'Макфа', kk: 'Макфа', ko: '막파' },
    weight: { en: '2000g', ru: '2000г', kk: '2000г', ko: '2000g' },
    tags: { en: ['flour','baking'], ru: ['мука','выпечка'], kk: ['ұн','наубайхана'], ko: ['밀가루','베이킹'] }
  },
  p012: {
    name: { en: 'Beef (1kg)', ru: 'Говядина (1кг)', kk: 'Сиыр еті (1кг)', ko: '소고기 (1kg)' },
    brand: { en: 'Local Farm', ru: 'Местная ферма', kk: 'Жергілікті ферма', ko: '현지 농장' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['beef','meat','protein','borscht'], ru: ['говядина','мясо','белок','борщ'], kk: ['сиыр еті','ет','ақуыз','борщ'], ko: ['소고기','고기','단백질','보르시'] }
  },
  p013: {
    name: { en: 'Chicken Breast 1kg', ru: 'Куриное филе 1кг', kk: 'Тауық еті 1кг', ko: '닭가슴살 1kg' },
    brand: { en: 'Alatau', ru: 'Алатау', kk: 'Алатау', ko: '알라타우' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['chicken','meat','protein'], ru: ['курица','мясо','белок'], kk: ['тауық','ет','ақуыз'], ko: ['닭고기','고기','단백질'] }
  },
  p014: {
    name: { en: 'Salmon Fillet 300g', ru: 'Филе лосося 300г', kk: 'Албырт филесі 300г', ko: '연어 필레 300g' },
    brand: { en: 'Premium', ru: 'Премиум', kk: 'Премиум', ko: '프리미엄' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['fish','salmon','seafood'], ru: ['рыба','лосось','морепродукты'], kk: ['балық','албырт','теңіз өнімдері'], ko: ['생선','연어','해산물'] }
  },
  p015: {
    name: { en: 'Potatoes 1kg', ru: 'Картофель 1кг', kk: 'Картоп 1кг', ko: '감자 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['potato','vegetable','borscht','plov'], ru: ['картошка','овощи','борщ','плов'], kk: ['картоп','көкөністер','борщ','палау'], ko: ['감자','야채','보르시','파라우'] }
  },
  p016: {
    name: { en: 'Carrots 1kg', ru: 'Морковь 1кг', kk: 'Сәбіз 1кг', ko: '당근 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['carrot','vegetable','borscht'], ru: ['морковь','овощи','борщ'], kk: ['сәбіз','көкөністер','борщ'], ko: ['당근','야채','보르시'] }
  },
  p017: {
    name: { en: 'Beetroot 1kg', ru: 'Свекла 1кг', kk: 'Қызылша 1кг', ko: '비트 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['beetroot','vegetable','borscht'], ru: ['свекла','овощи','борщ'], kk: ['қызылша','көкөністер','борщ'], ko: ['비트','야채','보르시'] }
  },
  p018: {
    name: { en: 'Cabbage 1kg', ru: 'Капуста 1кг', kk: 'Капуста 1кг', ko: '양배추 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['cabbage','vegetable','borscht'], ru: ['капуста','овощи','борщ'], kk: ['капуста','көкөністер','борщ'], ko: ['양배추','야채','보르시'] }
  },
  p019: {
    name: { en: 'Onions 1kg', ru: 'Лук 1кг', kk: 'Пияз 1кг', ko: '양파 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['onion','vegetable','borscht','plov'], ru: ['лук','овощи','борщ','плов'], kk: ['пияз','көкөністер','борщ','палау'], ko: ['양파','야채','보르시','파라우'] }
  },
  p020: {
    name: { en: 'Tomato Paste 500g', ru: 'Томатная паста 500г', kk: 'Томат пастасы 500г', ko: '토마토 페이스트 500g' },
    brand: { en: 'Heinz', ru: 'Хайнц', kk: 'Хайнц', ko: '하인즈' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['tomato paste','borscht'], ru: ['томатная паста','борщ'], kk: ['томат пастасы','борщ'], ko: ['토마토 페이스트','보르시'] }
  },
  p021: {
    name: { en: 'Rice 2kg', ru: 'Рис 2кг', kk: 'Күріш 2кг', ko: '쌀 2kg' },
    brand: { en: 'Krasnodar', ru: 'Краснодар', kk: 'Краснодар', ko: '크라스노다르' },
    weight: { en: '2000g', ru: '2000г', kk: '2000г', ko: '2000g' },
    tags: { en: ['rice','plov','grain'], ru: ['рис','плов','крупа'], kk: ['күріш','палау','дән'], ko: ['쌀','파라우','곡물'] }
  },
  p022: {
    name: { en: 'Sunflower Oil 1L', ru: 'Подсолнечное масло 1л', kk: 'Күнбағыс майы 1л', ko: '식용유 1L' },
    brand: { en: 'Zolotaya', ru: 'Золотая', kk: 'Золотая', ko: '조ро타야' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['oil','cooking','plov'], ru: ['масло','готовка','плов'], kk: ['май','тағам дайындау','палау'], ko: ['식용유','요리','파라우'] }
  },
  p023: {
    name: { en: 'White Eggs 10pcs', ru: 'Яйца белые 10 шт', kk: 'Ақ жұмыртқа 10 дана', ko: '백색 계란 10구' },
    brand: { en: 'Alatau', ru: 'Алатау', kk: 'Алатау', ko: '알латау' },
    weight: { en: '10pcs', ru: '10 шт', kk: '10 дана', ko: '10구' },
    tags: { en: ['eggs','breakfast','baking'], ru: ['яйца','завтрак','выпечка'], kk: ['жұмыртқа','таңғы ас','наубайхана'], ko: ['계란','아침 식사','베이킹'] }
  },
  p036: {
    name: { en: 'Greek Yogurt 400g', ru: 'Греческий йогурт 400г', kk: 'Грек йогурты 400г', ko: '그릭 요거트 400g' },
    brand: { en: 'Ehrmann', ru: 'Эрманн', kk: 'Эрманн', ko: '에르만' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['yogurt','dairy','breakfast','healthy'], ru: ['йогурт','молочные продукты','завтрак','здоровое питание'], kk: ['йогурт','сүт өнімдері','таңғы ас','пайдалы'], ko: ['요거트','유제품','아침 식사','건강식'] }
  },
  p037: {
    name: { en: 'Strawberry Yogurt 150g', ru: 'Клубничный йогурт 150г', kk: 'Құлпынай йогурты 150г', ko: '딸기 요거트 150g' },
    brand: { en: 'Lactel', ru: 'Лактель', kk: 'Лактель', ko: '락텔' },
    weight: { en: '150g', ru: '150г', kk: '150г', ko: '150g' },
    tags: { en: ['yogurt','dairy','strawberry','breakfast'], ru: ['йогурт','молочные продукты','клубника','завтрак'], kk: ['йогурт','сүт өнімдері','құлпынай','таңғы ас'], ko: ['요거트','유제품','딸기','아침 식사'] }
  },
  p038: {
    name: { en: 'Drinking Yogurt 290g', ru: 'Питьевой йогурт 290г', kk: 'Ішетін йогурт 290г', ko: '드링킹 요거트 290g' },
    brand: { en: 'Activia', ru: 'Активиа', kk: 'Активиа', ko: '액티비아' },
    weight: { en: '290g', ru: '290г', kk: '290г', ko: '290g' },
    tags: { en: ['yogurt','dairy','drinking','breakfast'], ru: ['йогурт','молочные продукты','питьевой','завтрак'], kk: ['йогурт','сүт өнімдері','ішетін','таңғы ас'], ko: ['요거트','유제품','드링킹','아침 식사'] }
  },
  p039: {
    name: { en: 'Cheese Slices 150g', ru: 'Нарезной сыр 150г', kk: 'Тілімделген сыр 150г', ko: '슬라이스 치즈 150g' },
    brand: { en: 'Hochland', ru: 'Хохланд', kk: 'Хохланд', ko: '호흘란т' },
    weight: { en: '150g', ru: '150г', kk: '150г', ko: '150g' },
    tags: { en: ['cheese','dairy','sandwich'], ru: ['сыр','молочные продукты','бутерброд'], kk: ['сыр','сүт өнімдері','бутерброд'], ko: ['치즈','유제품','샌드위치'] }
  },
  p040: {
    name: { en: 'Mozzarella Cheese 125g', ru: 'Сыр Моцарелла 125г', kk: 'Моцарелла сыры 125г', ko: '모짜렐라 치즈 125g' },
    brand: { en: 'Galbani', ru: 'Гальбани', kk: 'Гальбани', ko: '갈바니' },
    weight: { en: '125g', ru: '125г', kk: '125г', ko: '125g' },
    tags: { en: ['cheese','dairy','mozzarella','pizza'], ru: ['сыр','молочные продукты','моцарелла','пицца'], kk: ['сыр','сүт өнімдері','моцарелла','пицца'], ko: ['치즈','유제품','모짜렐라','피자'] }
  },
  p041: {
    name: { en: 'Cream Cheese 150g', ru: 'Творожный сыр 150г', kk: 'Сүзбелі сыр 150г', ko: '크림 치즈 150g' },
    brand: { en: 'Almette', ru: 'Альметте', kk: 'Альметте', ko: '알메т' },
    weight: { en: '150g', ru: '150г', kk: '150г', ko: '150g' },
    tags: { en: ['cheese','dairy','cream cheese','breakfast'], ru: ['сыр','молочные продукты','творожный сыр','завтрак'], kk: ['сыр','сүт өнімдері','сүзбелі сыр','таңғы ас'], ko: ['치즈','유제품','크림 치즈','아침 식사'] }
  },
  p042: {
    name: { en: 'Heavy Cream 20% 200ml', ru: 'Сливки 20% 200мл', kk: 'Сливки 20% 200мл', ko: '생크림 20% 200ml' },
    brand: { en: 'President', ru: 'Президент', kk: 'Президент', ko: '프рези던т' },
    weight: { en: '200ml', ru: '200мл', kk: '200мл', ko: '200ml' },
    tags: { en: ['cream','dairy','cooking'], ru: ['сливки','молочные продукты','кулинария'], kk: ['сливки','сүт өнімдері','тағам дайындау'], ko: ['크림','유제품','요리'] }
  },
  p043: {
    name: { en: 'Whipping Cream 33% 250ml', ru: 'Сливки для взбивания 33% 250мл', kk: 'Көпіршітуге арналған сливки 33% 250мл', ko: '휘핑크림 33% 250ml' },
    brand: { en: 'President', ru: 'Президент', kk: 'Президент', ko: '프рези던т' },
    weight: { en: '250ml', ru: '250мл', kk: '250мл', ko: '250ml' },
    tags: { en: ['cream','dairy','baking','whipping'], ru: ['сливки','молочные продукты','выпечка','взбивание'], kk: ['сливки','сүт өнімдері','наубайхана','көпіршіту'], ko: ['크림','유제품','베이킹','휘핑'] }
  },
  p044: {
    name: { en: 'Condensed Milk 380g', ru: 'Сгущенное молоко 380г', kk: 'Қоюландырылған сүт 380г', ko: '연유 380g' },
    brand: { en: 'Rogachev', ru: 'Рогачев', kk: 'Рогачев', ko: '로гачеф' },
    weight: { en: '380g', ru: '380г', kk: '380г', ko: '380g' },
    tags: { en: ['milk','dairy','sweet','condensed'], ru: ['молоко','молочные продукты','сладкое','сгущенка'], kk: ['сүт','сүт өнімдері','тәтті','қоюландырылған'], ko: ['우유','유제품','단것','연유'] }
  },
  p045: {
    name: { en: 'Brown Eggs 10pcs', ru: 'Яйца коричневые 10 шт', kk: 'Қоңыр жұмыртқа 10 дана', ko: '갈색 계란 10구' },
    brand: { en: 'Alatau', ru: 'Алатау', kk: 'Алатау', ko: '알латау' },
    weight: { en: '10pcs', ru: '10 шт', kk: '10 дана', ko: '10구' },
    tags: { en: ['eggs','breakfast','baking'], ru: ['яйца','завтрак','выпечка'], kk: ['жұмыртқа','таңғы ас','наубайхана'], ko: ['계란','아침 식사','베이킹'] }
  },
  p046: {
    name: { en: 'Organic Eggs 10pcs', ru: 'Органические яйца 10 шт', kk: 'Органикалық жұмыртқа 10 дана', ko: '유기농 계란 10구' },
    brand: { en: 'EcoFarm', ru: 'ЭкоФарм', kk: 'ЭкоФарм', ko: '에ко팜' },
    weight: { en: '10pcs', ru: '10 шт', kk: '10 дана', ko: '10구' },
    tags: { en: ['eggs','organic','breakfast','healthy'], ru: ['яйца','органические продукты','завтрак','здоровое питание'], kk: ['жұмыртқа','органикалық','таңғы ас','пайдалы'], ko: ['계란','유기농','아침 식사','건강식'] }
  },
  p047: {
    name: { en: 'Chocolate Milk 500ml', ru: 'Шоколадное молоко 500мл', kk: 'Шоколадты сүт 500мл', ko: '초ко 우유 500ml' },
    brand: { en: 'Raimbek', ru: 'Раимбек', kk: 'Раимбек', ko: '라им벡' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    tags: { en: ['milk','dairy','chocolate','breakfast'], ru: ['молоко','молочные продукты','шоколадное','завтрак'], kk: ['сүт','сүт өнімдері','шоколадты','таңғы ас'], ko: ['우유','유제품','초콜릿','아침 식사'] }
  },
  p024: {
    name: { en: 'Dove Shampoo 400ml', ru: 'Шампунь Dove 400мл', kk: 'Dove сусабыны 400мл', ko: '도브 샴푸 400ml' },
    brand: { en: 'Dove', ru: 'Дав', kk: 'Дав', ko: '도브' },
    weight: { en: '400ml', ru: '400мл', kk: '400мл', ko: '400ml' },
    tags: { en: ['shampoo','hair','dove'], ru: ['шампунь','волосы','dove'], kk: ['сусабын','шаш','dove'], ko: ['샴푸','헤어','도브'] }
  },
  p025: {
    name: { en: 'Head & Shoulders 400ml', ru: 'Шампунь Head & Shoulders 400мл', kk: 'Head & Shoulders сусабыны 400мл', ko: '헤드앤숄더 샴푸 400ml' },
    brand: { en: 'H&S', ru: 'Хэд энд Шолдерс', kk: 'Хэд энд Шолдерс', ko: '헤드앤숄더' },
    weight: { en: '400ml', ru: '400мл', kk: '400мл', ko: '400ml' },
    tags: { en: ['shampoo','dandruff'], ru: ['шампунь','перхоть'], kk: ['сусабын','қайызғақ'], ko: ['샴푸','비듬'] }
  },
  p026: {
    name: { en: 'Colgate Toothpaste 150g', ru: 'Зубная паста Colgate 150г', kk: 'Colgate тіс пастасы 150г', ko: '콜게이트 치약 150g' },
    brand: { en: 'Colgate', ru: 'Колгейт', kk: 'Колгейт', ko: '콜게이트' },
    weight: { en: '150g', ru: '150г', kk: '150г', ko: '150g' },
    tags: { en: ['toothpaste','dental'], ru: ['зубная паста','зубы'], kk: ['тіс пастасы','тіс күтімі'], ko: ['치약','구강'] }
  },
  p027: {
    name: { en: 'Dove Body Wash 250ml', ru: 'Гель для душа Dove 250мл', kk: 'Dove душ гелі 250мл', ko: '도브 바디워시 250ml' },
    brand: { en: 'Dove', ru: 'Дав', kk: 'Дав', ko: '도브' },
    weight: { en: '250ml', ru: '250мл', kk: '250мл', ko: '250ml' },
    tags: { en: ['body wash','shower','dove'], ru: ['гель для душа','душ','dove'], kk: ['душ гелі','душ','dove'], ko: ['바디워시','샤워','도브'] }
  },
  p028: {
    name: { en: 'Perfume Chanel No.5', ru: 'Духи Chanel No.5', kk: 'Иіссу Chanel No.5', ko: '샤넬 No.5 향수' },
    brand: { en: 'Chanel', ru: 'Шанель', kk: 'Шанель', ko: '샤넬' },
    weight: { en: '100ml', ru: '100мл', kk: '100мл', ko: '100ml' },
    tags: { en: ['perfume','fragrance','chanel'], ru: ['духи','аромат','chanel'], kk: ['иіссу','жұпар иіс','chanel'], ko: ['향수','화장품','샤넬'] }
  },
  p029: {
    name: { en: 'Fairy Dish Liquid 1L', ru: 'Средство для посуды Fairy 1л', kk: 'Fairy ыдыс жуғыш 1л', ko: '페어리 주방세제 1L' },
    brand: { en: 'Fairy', ru: 'Фейри', kk: 'Фейри', ko: '페어리' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['dish soap','cleaning','fairy'], ru: ['моющее средство','уборка','fairy'], kk: ['ыдыс жуғыш','тазалық','fairy'], ko: ['주방세제','청소','페어리'] }
  },
  p030: {
    name: { en: 'Ariel Powder 3kg', ru: 'Стиральный порошок Ariel 3кг', kk: 'Ariel кір жуғыш ұнтағы 3кг', ko: '아리엘 세탁세제 3kg' },
    brand: { en: 'Ariel', ru: 'Ариэль', kk: 'Ариэль', ko: '아리엘' },
    weight: { en: '3000g', ru: '3000г', kk: '3000г', ko: '3000g' },
    tags: { en: ['laundry','powder','ariel'], ru: ['стирка','порошок','ariel'], kk: ['кір жуу','ұнтақ','ariel'], ko: ['세탁','세제','아리엘'] }
  },
  p031: {
    name: { en: 'Toilet Paper 12 rolls', ru: 'Туалетная бумага 12 рулонов', kk: 'Дәретхана қағазы 12 орам', ko: '화장지 12롤' },
    brand: { en: 'Only', ru: 'Онли', kk: 'Онли', ko: '온리' },
    weight: { en: '12pcs', ru: '12 шт', kk: '12 дана', ko: '12롤' },
    tags: { en: ['toilet paper','household'], ru: ['туалетная бумага','хозяйственные товары'], kk: ['дәретхана қағазы','үйге арналған'], ko: ['화장지','생필품'] }
  },
  p034: {
    name: { en: 'Pampers Diapers (60pc)', ru: 'Подгузники Pampers (60 шт)', kk: 'Pampers жөргектері (60 дана)', ko: '기저귀 (60매)' },
    brand: { en: 'Pampers', ru: 'Памперс', kk: 'Памперс', ko: '팜퍼스' },
    weight: { en: '60pcs', ru: '60 шт', kk: '60 дана', ko: '60매' },
    tags: { en: ['diapers','baby','pampers'], ru: ['подгузники','дети','pampers'], kk: ['жөргектер','балаларға','pampers'], ko: ['기저귀','아동','팜퍼스'] }
  },
  p035: {
    name: { en: 'Baby Food Gerber 200g', ru: 'Детское питание Gerber 200г', kk: 'Gerber балалар тағамы 200г', ko: '거버 이유식 200g' },
    brand: { en: 'Gerber', ru: 'Гербер', kk: 'Гербер', ko: '거버' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['baby food','gerber','infant'], ru: ['детское питание','гербер','младенцы'], kk: ['балалар тағамы','гербер','сәбилер'], ko: ['이유식','거버','영유아'] }
  },
  p850: {
    name: { en: 'Baby Wipes (72pcs)', ru: 'Влажные салфетки (72 шт)', kk: 'Дымқыл сүлгілер (72 дана)', ko: '아기 물티슈 (72매)' },
    brand: { en: 'Pampers', ru: 'Памперс', kk: 'Памперс', ko: '팜перс' },
    weight: { en: '72pcs', ru: '72 шт', kk: '72 дана', ko: '72매' },
    tags: { en: ['baby wipes','wipes','baby','hygiene'], ru: ['влажные салфетки','салфетки','дети','гигиена'], kk: ['дымқыл сүлгілер','сүлгілер','балалар','гигиена'], ko: ['물티슈','아기','위생'] }
  },
  p851: {
    name: { en: 'Huggies Newborn Diapers (36pc)', ru: 'Подгузники для новорожденных Huggies (36 шт)', kk: 'Жаңа туған нәрестелерге арналған Huggies жөргектері (36 дана)', ko: '하기스 신생아 기저귀 (36매)' },
    brand: { en: 'Huggies', ru: 'Хаггис', kk: 'Хаггис', ko: '하기스' },
    weight: { en: '36pcs', ru: '36 шт', kk: '36 дана', ko: '36매' },
    tags: { en: ['diapers','newborn','baby','huggies'], ru: ['подгузники','новорожденные','дети','huggies'], kk: ['жөргектер','нәрестелер','балалар','huggies'], ko: ['기저귀','신생아','아기','하기스'] }
  },
  p852: {
    name: { en: 'Similac Infant Formula (400g)', ru: 'Детская смесь Similac (400г)', kk: 'Similac балалар қоспасы (400г)', ko: '시밀락 영유아 분유 (400g)' },
    brand: { en: 'Similac', ru: 'Симилак', kk: 'Симилак', ko: '시밀락' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['formula','infant','baby','similac','milk'], ru: ['детская смесь','смесь','дети','similac','молоко'], kk: ['балалар қоспасы','қоспа','балалар','similac','сүт'], ko: ['분유','영유아','아기','시밀락','우유'] }
  },
  p853: {
    name: { en: 'NAN Infant Formula (400g)', ru: 'Детская смесь NAN (400г)', kk: 'NAN балалар қоспасы (400г)', ko: '네슬레 난 영유아 분유 (400g)' },
    brand: { en: 'Nestlé', ru: 'Нестле', kk: 'Нестле', ko: '네슬레' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['formula','infant','baby','nestle','nan','milk'], ru: ['детская смесь','смесь','дети','nestle','nan','молоко'], kk: ['балалар қоспасы','қоспа','балалар','nestle','nan','сүт'], ko: ['분유','영유아','아기','네슬레','난','우유'] }
  },
  p854: {
    name: { en: 'Gerber Rice Cereal (227g)', ru: 'Рисовая каша Gerber (227г)', kk: 'Gerber күріш ботқасы (227г)', ko: '거버 쌀 미음 (227g)' },
    brand: { en: 'Gerber', ru: 'Гербер', kk: 'Гербер', ko: '거버' },
    weight: { en: '227g', ru: '227г', kk: '227г', ko: '227g' },
    tags: { en: ['cereal','rice','baby','gerber','first food'], ru: ['каша','рис','дети','gerber','первый прикорм'], kk: ['ботқа','күріш','балалар','gerber','алғашқы қорек'], ko: ['미음','쌀','아기','거버','이유식'] }
  },
  p855: {
    name: { en: 'Heinz Baby Cereal (200g)', ru: 'Детская каша Heinz (200г)', kk: 'Heinz балалар ботқасы (200г)', ko: '하인즈 아기 시리얼 (200g)' },
    brand: { en: 'Heinz', ru: 'Хайнц', kk: 'Хайнц', ko: '하인즈' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['cereal','baby','heinz','oat','wheat'], ru: ['каша','дети','heinz','овсяная','пшеничная'], kk: ['ботқа','балалар','heinz','сұлы','бидай'], ko: ['시리얼','아기','하인즈','오트','밀'] }
  },
  p856: {
    name: { en: 'Apple Baby Puree (100g)', ru: 'Детское пюре Яблоко (100г)', kk: 'Балаларға арналған Алма пюресі (100г)', ko: '사과 아기 퓨레 (100g)' },
    brand: { en: 'Gerber', ru: 'Гербер', kk: 'Гербер', ko: '거버' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['puree','apple','baby','fruit','gerber'], ru: ['пюре','яблоко','дети','фрукты','гербер'], kk: ['пюре','алма','балалар','жеміс','гербер'], ko: ['퓨레','사과','아기','과일','거버'] }
  },
  p857: {
    name: { en: 'Banana Baby Puree (100g)', ru: 'Детское пюре Банан (100г)', kk: 'Балаларға арналған Банан пюресі (100г)', ko: '바나나 아기 퓨레 (100g)' },
    brand: { en: 'Gerber', ru: 'Гербер', kk: 'Гербер', ko: '거버' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['puree','banana','baby','fruit','gerber'], ru: ['пюре','банан','дети','фрукты','гербер'], kk: ['пюре','банан','балалар','жеміс','гербер'], ko: ['퓨레','바나나','아기','과일','거버'] }
  },
  p858: {
    name: { en: 'Mixed Vegetable Baby Puree (100g)', ru: 'Детское овощное пюре (100г)', kk: 'Балаларға арналған көкөніс пюресі (100г)', ko: '모듬 채소 아기 퓨레 (100g)' },
    brand: { en: 'Gerber', ru: 'Гербер', kk: 'Гербер', ko: '거버' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['puree','vegetable','baby','mixed','gerber'], ru: ['пюре','овощи','дети','овощное','гербер'], kk: ['пюре','көкөністер','балалар','көкөніс','гербер'], ko: ['퓨레','채소','아기','야채','거버'] }
  },
  p859: {
    name: { en: 'Baby Yogurt (100g)', ru: 'Детский йогурт Агуша (100г)', kk: 'Агуша балалар йогурты (100г)', ko: '아기 요거트 (100g)' },
    brand: { en: 'Agusha', ru: 'Агуша', kk: 'Агуша', ko: '아구샤' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['yogurt','baby','dairy','agusha'], ru: ['йогурт','дети','молочные продукты','агуша'], kk: ['йогурт','балалар','сүт өнімдері','агуша'], ko: ['요거트','아기','유제품','아구샤'] }
  },
  p860: {
    name: { en: 'Baby Biscuits (150g)', ru: 'Детское печенье Heinz (150г)', kk: 'Heinz балалар печеньесі (150г)', ko: '아기 비스킷 (150g)' },
    brand: { en: 'Heinz', ru: 'Хайнц', kk: 'Хайнц', ko: '하인즈' },
    weight: { en: '150g', ru: '150г', kk: '150г', ko: '150g' },
    tags: { en: ['biscuits','baby','snack','heinz','teething'], ru: ['печенье','дети','перекус','heinz','прорезывание зубов'], kk: ['печенье','балалар','тіскебасар','heinz','тіс жару'], ko: ['비스킷','아기','간식','하인즈','티딩'] }
  },
  p861: {
    name: { en: "Johnson's Baby Shampoo (300ml)", ru: "Детский шампунь Johnson's (300мл)", kk: "Johnson's балалар шампуны (300мл)", ko: '존슨즈 베이비 샴푸 (300ml)' },
    brand: { en: "Johnson's", ru: 'Джонсонс', kk: 'Джонсонс', ko: '존슨즈' },
    weight: { en: '300ml', ru: '300мл', kk: '300мл', ko: '300ml' },
    tags: { en: ['shampoo','baby','johnsons','bath','hair'], ru: ['шампунь','дети','джонсонс','купание','волосы'], kk: ['шампунь','балалар','джонсонс','шомылу','шаш'], ko: ['샴푸','아기','존슨즈','목욕','헤어'] }
  },
  p862: {
    name: { en: "Johnson's Baby Lotion (300ml)", ru: "Детский лосьон Johnson's (300мл)", kk: "Johnson's балалар лосьоны (300мл)", ko: '존슨즈 베이비 로션 (300ml)' },
    brand: { en: "Johnson's", ru: 'Джонсонс', kk: 'Джонсонс', ko: '존슨즈' },
    weight: { en: '300ml', ru: '300мл', kk: '300мл', ko: '300ml' },
    tags: { en: ['lotion','baby','johnsons','moisturizer','skin'], ru: ['лосьон','дети','джонсонс','увлажнение','кожа'], kk: ['лосьон','балалар','джонсонс','ылғалдандыру','тері'], ko: ['로션','아기','존슨즈','보습','피부'] }
  },
  p863: {
    name: { en: "Johnson's Baby Oil (200ml)", ru: "Детское масло Johnson's (200мл)", kk: "Johnson's балалар майы (200мл)", ko: '존슨즈 베이비 오일 (200ml)' },
    brand: { en: "Johnson's", ru: 'Джонсонс', kk: 'Джонсонс', ko: '존슨즈' },
    weight: { en: '200ml', ru: '200мл', kk: '200мл', ko: '200ml' },
    tags: { en: ['oil','baby','johnsons','massage','skin'], ru: ['масло','дети','джонсонс','массаж','кожа'], kk: ['май','балалар','джонсонс','массаж','тері'], ko: ['오일','아기','존슨즈','마사지','피부'] }
  },
  p864: {
    name: { en: "Johnson's Baby Powder (200g)", ru: "Детская присыпка Johnson's (200г)", kk: "Johnson's балалар ұнтағы (200г)", ko: '존슨즈 베이비 파у더 (200g)' },
    brand: { en: "Johnson's", ru: 'Джонсонс', kk: 'Джонсонс', ko: '존슨즈' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['powder','baby','johnsons','talc'], ru: ['присыпка','дети','джонсонс','тальк'], kk: ['ұнтақ','балалар','джонсонс','тальк'], ko: ['파우더','아기','존슨즈','탤크'] }
  },
  p865: {
    name: { en: 'Baby Soap Bar (100g)', ru: 'Детское мыло (100г)', kk: 'Балалар сабыны (100г)', ko: '아기 비누 (100g)' },
    brand: { en: "Johnson's", ru: 'Джонсонс', kk: 'Джонсонс', ko: '존슨즈' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['soap','baby','johnsons','bath','gentle'], ru: ['мыло','дети','джонсонс','купание','нежное'], kk: ['сабын','балалар','джонсонс','шомылу','нәзік'], ko: ['비누','아기','존슨즈','목욕','순한'] }
  },
  p866: {
    name: { en: 'Feeding Bottle (250ml)', ru: 'Бутылочка для кормления (250мл)', kk: 'Тамақтандыруға арналған бөтелке (250мл)', ko: '젖병 (250ml)' },
    brand: { en: 'Philips Avent', ru: 'Филипс Авент', kk: 'Филипс Авент', ko: '필립с 아벤트' },
    weight: { en: '250ml', ru: '250мл', kk: '250мл', ko: '250ml' },
    tags: { en: ['bottle','feeding','baby','avent','philips'], ru: ['бутылочка','кормление','дети','avent','philips'], kk: ['бөтелке','тамақтандыру','балалар','avent','philips'], ko: ['젖병','수유','아기','아벤트','필립스'] }
  },
  p867: {
    name: { en: 'Pacifier (0-6 months)', ru: 'Пустышка (0-6 месяцев)', kk: 'Емізік (0-6 ай)', ko: '노리개 젖꼭지 (0-6개월)' },
    brand: { en: 'Philips Avent', ru: 'Филипс Авент', kk: 'Филипс Авент', ko: '필립с 아벤트' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    tags: { en: ['pacifier','baby','avent','philips','soother'], ru: ['пустышка','дети','avent','philips','успокоение'], kk: ['емізік','балалар','avent','philips','тыныштандыру'], ko: ['젖꼭지','아기','아벤트','필립스','소저'] }
  },
  p051: {
    name: { en: 'Traditional Korean Kimchi 500g', ru: 'Традиционное корейское кимчи 500г', kk: 'Дәстүрлі корей кимчиі 500г', ko: '종가집 전통 김치 500g' },
    brand: { en: 'Jongga', ru: 'Джонгга', kk: 'Джонгга', ko: '종가집' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['kimchi','korean','fermented','cabbage','side dish'], ru: ['кимчи','корейский','ферментированный','капуста','закуска'], kk: ['кимчи','корей','ашытылған','капуста','гарнир'], ko: ['김치','반찬','배추김치','한국'] }
  },
  p052: {
    name: { en: 'Shin Ramyun Spicy 120g', ru: 'Острый рамён Шин Рамён 120г', kk: 'Ащы рамён Шин Рамён 120г', ko: '신라면 매운맛 120g' },
    brand: { en: 'Nongshim', ru: 'Нонгшим', kk: 'Нонгшим', ko: '농심' },
    weight: { en: '120g', ru: '120г', kk: '120г', ko: '120g' },
    tags: { en: ['ramen','noodles','spicy','korean','shin ramyun','instant'], ru: ['рамён','лапша','острый','корейский','шин рамён','быстрого приготовления'], kk: ['рамён','кеспе','ащы','корей','шин рамён','тез дайындалатын'], ko: ['라면','농심','신라면','매운맛','컵라면'] }
  },
  p053: {
    name: { en: 'Buldak Hot Chicken Ramen 140g', ru: 'Острая лапша Бульдак 140г', kk: 'Ащы кеспе Бульдак 140г', ko: '불닭볶음면 140g' },
    brand: { en: 'Samyang', ru: 'Самьянг', kk: 'Самьянг', ko: '삼양' },
    weight: { en: '140g', ru: '140г', kk: '140г', ko: '140g' },
    tags: { en: ['buldak','ramen','spicy','korean','samyang','hot chicken','instant'], ru: ['бульдак','рамён','острый','корейский','самьянг','курица','быстрого приготовления'], kk: ['бульдак','рамён','ащы','корей','самьянг','тауық','тез дайындалатын'], ko: ['라면','삼양','불닭볶음면','매운맛','삼양라면'] }
  },
  p100: {
    name: { en: 'Gochujang Red Pepper Paste 500g', ru: 'Корейская паста Кочуджан 500г', kk: 'Корей пастасы Кочуджан 500г', ko: '해찬들 태양초 고추장 500g' },
    brand: { en: 'CJ Haechandle', ru: 'СиДжей Хэчандл', kk: 'СиДжей Хэчандл', ko: 'CJ해찬들' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['gochujang','korean','paste','chili','condiment'], ru: ['кочуджан','корейский','паста','чили','приправа'], kk: ['кочуджан','корей','паста','чили','дәмдеуіш'], ko: ['고추장','양념','소스','한국'] }
  },
  p101: {
    name: { en: 'Kikkoman Soy Sauce 250ml', ru: 'Соевый соус Kikkoman 250мл', kk: 'Kikkoman соя соусы 250мл', ko: '기코만 간장 250ml' },
    brand: { en: 'Kikkoman', ru: 'Киккоман', kk: 'Киккоман', ko: '기코만' },
    weight: { en: '250ml', ru: '250мл', kk: '250мл', ko: '250ml' },
    tags: { en: ['soy sauce','kikkoman','japanese','condiment','asian'], ru: ['соевый соус','киккоман','японский','приправа','азиатский'], kk: ['соя соусы','киккоман','жапон','дәмдеуіш','азиялық'], ko: ['간장','기코만','소스','일식'] }
  },
  p102: {
    name: { en: 'Sushi Rice Premium 1kg', ru: 'Рис для суши Премиум 1кг', kk: 'Сушиге арналған күріш Премиум 1кг', ko: '스시용 프리미엄 쌀 1kg' },
    brand: { en: 'Hiyori', ru: 'Хиёри', kk: 'Хиёри', ko: '히요리' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['sushi','rice','japanese','grain','short grain'], ru: ['суши','рис','японский','крупа','круглозерный'], kk: ['суши','күріш','жапон','дән','дөңгелек күріш'], ko: ['쌀','스시','일식','프리미엄'] }
  },
  p103: {
    name: { en: 'Nori Seaweed Sheets 10pc', ru: 'Листы водорослей Нори 10 шт', kk: 'Нори балдырлары 10 дана', ko: '김밥용 구운김 10매' },
    brand: { en: 'Ariake', ru: 'Ариаке', kk: 'Ариаке', ko: '아리아케' },
    weight: { en: '28g', ru: '28г', kk: '28г', ko: '28g' },
    tags: { en: ['nori','seaweed','japanese','sushi','wrap'], ru: ['нори','водоросли','японский','суши','роллы'], kk: ['нори','балдырлар','жапон','суши','роллдар'], ko: ['김','구운김','김밥','일식'] }
  },
  p104: {
    name: { en: 'Pocky Chocolate Sticks 45g', ru: 'Шоколадные палочки Pocky 45г', kk: 'Pocky шоколад таяқшалары 45г', ko: '포키 초코 45g' },
    brand: { en: 'Glico', ru: '글리코', kk: '글리코', ko: '글리코' },
    weight: { en: '45g', ru: '45г', kk: '45г', ko: '45g' },
    tags: { en: ['pocky','chocolate','japanese','snack','biscuit'], ru: ['поки','шоколад','японский','перекус','печенье'], kk: ['поки','шоколад','жапон','жеңіл тамақ','печенье'], ko: ['과자','초콜릿','빼빼로','포키'] }
  },
  p105: {
    name: { en: 'Miso Paste White 1kg', ru: 'Мисо-паста белая 1кг', kk: 'Мисо пастасы ақ 1кг', ko: '백미소 된장 1kg' },
    brand: { en: 'Marukome', ru: 'Марукоме', kk: 'Марукоме', ko: '마루코메' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['miso','paste','japanese','soup','fermented'], ru: ['мисо','паста','японский','суп','ферментированный'], kk: ['мисо','паста','жапон','сорпа','ашытылған'], ko: ['된장','미소','소스','일식','국'] }
  },
  p106: {
    name: { en: 'Rice Vinegar 500ml', ru: 'Рисовый уксус 500мл', kk: 'Күріш сірке суы 500мл', ko: '식초 500ml' },
    brand: { en: 'Mizkan', ru: 'Мизкан', kk: 'Мизкан', ko: '미즈칸' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    tags: { en: ['rice vinegar','japanese','vinegar','sushi','condiment'], ru: ['рисовый уксус','японский','уксус','суши','приправа'], kk: ['күріш сірке суы','жапон','сірке суы','суши','дәмдеуіш'], ko: ['식초','식초소스','스시','일식'] }
  },
  p107: {
    name: { en: 'Lee Kum Kee Oyster Sauce 510g', ru: 'Устричный соус Lee Kum Kee 510г', kk: 'Устрица соусы Lee Kum Kee 510г', ko: '이금기 굴소스 510g' },
    brand: { en: 'Lee Kum Kee', ru: 'Ли Кум Ки', kk: 'Ли Кум Ки', ko: '이금기' },
    weight: { en: '510g', ru: '510г', kk: '510г', ko: '510g' },
    tags: { en: ['oyster sauce','chinese','condiment','stir fry','cooking'], ru: ['устричный соус','китайский','приправа','жарка','готовка'], kk: ['устрица соусы','қытай','дәмдеуіш','қуыру','тағам дайындау'], ko: ['굴소스','이금기','소스','중식'] }
  },
  p108: {
    name: { en: 'Toasted Sesame Oil 160ml', ru: 'Кунжутное масло 160мл', kk: 'Күнжіт майы 160мл', ko: '참기름 160ml' },
    brand: { en: 'Kadoya', ru: 'Кадоя', kk: 'Кадоя', ko: '카도야' },
    weight: { en: '160ml', ru: '160мл', kk: '160мл', ko: '160ml' },
    tags: { en: ['sesame oil','asian','chinese','korean','cooking oil'], ru: ['кунжутное масло','азиатский','китайский','корейский','масло для готовки'], kk: ['күнжіт майы','азиялық','қытай','корей','тағам майы'], ko: ['참기름','오일','조미료','한식'] }
  },
  p109: {
    name: { en: 'Coconut Milk 400ml', ru: 'Кокосовое молоко 400мл', kk: 'Кокос сүті 400мл', ko: '코코넛 밀크 400ml' },
    brand: { en: 'AROY-D', ru: 'Арой-Ди', kk: 'Арой-Ди', ko: '아로이디' },
    weight: { en: '400ml', ru: '400мл', kk: '400мл', ko: '400ml' },
    tags: { en: ['coconut milk','thai','curry','cooking','can'], ru: ['кокосовое молоко','тайский','карри','готовка','консерва'], kk: ['кокос сүті','тайландтық','карри','тағам дайындау','консерві'], ko: ['코코넛','우유','태국식','커리'] }
  },
  p110: {
    name: { en: 'Sweet Chili Sauce 730g', ru: 'Соус сладкий чили 730г', kk: 'Тәтті чили соусы 730г', ko: '스위트 칠리소스 730g' },
    brand: { en: 'Mae Ploy', ru: 'Мае Плой', kk: 'Мае Плой', ko: '메이플로이' },
    weight: { en: '730g', ru: '730г', kk: '730г', ko: '730g' },
    tags: { en: ['sweet chili','thai','sauce','dipping','condiment'], ru: ['сладкий чили','тайский','соус','макание','приправа'], kk: ['тәтті чили','тайландтық','соус','батыру','дәмдеуіш'], ko: ['칠리소스','소스','태국식','디핑소스'] }
  },
  p111: {
    name: { en: 'Flour Tortilla Wraps 8pc', ru: 'Тортилья пшеничная 8 шт', kk: 'Тортилья наны 8 дана', ko: '또또아 8장' },
    brand: { en: 'Mission', ru: 'Мишн', kk: 'Мишн', ko: '미션' },
    weight: { en: '320g', ru: '320г', kk: '320г', ko: '320g' },
    tags: { en: ['tortilla','wraps','mexican','burrito','taco'], ru: ['тортилья','лепешка','мексиканский','буррито','тако'], kk: ['тортилья','шелпек','мексикалық','буррито','тако'], ko: ['또띠아','멕시칸','타코','부리토'] }
  },
  p112: {
    name: { en: 'Tomato Salsa Mild 226g', ru: 'Томатная сальса мягкая 226г', kk: 'Томат сальсасы 226г', ko: '살사소스 226g' },
    brand: { en: 'Old El Paso', ru: 'Олд Эль Пасо', kk: 'Олд Эль Пасо', ko: '올드엘파소' },
    weight: { en: '226g', ru: '226г', kk: '226г', ko: '226g' },
    tags: { en: ['salsa','mexican','dip','tomato','sauce'], ru: ['сальса','мексиканский','дип-соус','томаты','соус'], kk: ['сальса','мексикалық','соус','қызанақ','дәмдеуіш'], ko: ['살사','멕시칸','토마토','소스'] }
  },
  p113: {
    name: { en: 'Extra Virgin Olive Oil 750ml', ru: 'Оливковое масло Extra Virgin 750мл', kk: 'Зәйтүн майы Extra Virgin 750мл', ko: '엑스트라 버진 올리브유 750ml' },
    brand: { en: 'Il Casale Toscano', ru: 'Иль Казале Тоскано', kk: 'Иль Казале Тоскано', ko: '일 카살레 토스카노' },
    weight: { en: '750ml', ru: '750мл', kk: '750мл', ko: '750ml' },
    tags: { en: ['olive oil','italian','cooking','premium','imported'], ru: ['оливковое масло','итальянский','готовка','премиум','импорт'], kk: ['зәйтүн майы','италиялық','тағам дайындау','премиум','импорттық'], ko: ['올리브유','이탈리아','요리','수입'] }
  },
  p114: {
    name: { en: 'Parmigiano Reggiano 250g', ru: 'Сыр Пармезан 250г', kk: 'Пармезан сыры 250г', ko: '파르메산 치즈 250g' },
    brand: { en: 'Parmareggio', ru: 'Пармареджо', kk: 'Пармареджо', ko: '파르마레조' },
    weight: { en: '250g', ru: '250г', kk: '250г', ko: '250g' },
    tags: { en: ['parmesan','cheese','italian','imported','hard cheese'], ru: ['пармезан','сыр','итальянский','импортный','твердый сыр'], kk: ['пармезан','сыр','италиялық','импорттық','қатты сыр'], ko: ['치즈','파마산','이탈리아','수입'] }
  },
  p054: {
    name: { en: 'Gluten-Free Bread 400g', ru: 'Безглютеновый хлеб 400г', kk: 'Глютенсіз нан 400г', ko: '글루텐프리 식빵 400g' },
    brand: { en: 'Schär', ru: 'Шэр', kk: 'Шэр', ko: '샤르' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['gluten-free','bread','diet','celiac'], ru: ['без глютена','хлеб','диета','целиакия'], kk: ['глютенсіз','нан','диета','целиакия'], ko: ['글루텐프리','빵','건강식','다이어트'] }
  },
  p055: {
    name: { en: 'Gluten-Free Spaghetti 400g', ru: 'Безглютеновые спагетти 400г', kk: 'Глютенсіз спагетти 400г', ko: '글루텐프리 스파게티 400g' },
    brand: { en: 'Barilla', ru: 'Барилла', kk: 'Барилла', ko: '바릴라' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['gluten-free','pasta','spaghetti','diet'], ru: ['без глютена','паста','спагетти','диета'], kk: ['глютенсіз','макарон','спагетти','диета'], ko: ['글루텐프리','파스타','스파게티','면'] }
  },
  p200: {
    name: { en: 'Gluten-Free Rice Crackers 130g', ru: 'Безглютеновые рисовые крекеры 130г', kk: 'Глютенсіз күріш крекерлері 130г', ko: '글루텐프리 쌀 크래커 130g' },
    brand: { en: 'Crisp Harvest', ru: 'Крисп Харвест', kk: 'Крисп Харвест', ko: '크리스프 하베스트' },
    weight: { en: '130g', ru: '130г', kk: '130г', ko: '130g' },
    tags: { en: ['gluten-free','crackers','rice','snack'], ru: ['без глютена','крекеры','рис','перекус'], kk: ['глютенсіз','крекерлер','күріш','жеңіл тамақ'], ko: ['과자','글루텐프리','크래커','쌀'] }
  },
  p201: {
    name: { en: 'Gluten-Free Rolled Oats 500g', ru: 'Безглютеновая овсянка 500г', kk: 'Глютенсіз сұлы жармасы 500г', ko: '글루텐프리 오트밀 500g' },
    brand: { en: "Bob's Red Mill", ru: 'Бобс Ред Милл', kk: 'Бобс Ред Милл', ko: '밥스레드밀' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['gluten-free','oats','oatmeal','breakfast'], ru: ['без глютена','овес','овсянка','завтрак'], kk: ['глютенсіз','сұлы','сұлы жармасы','таңғы ас'], ko: ['오트밀','아침','글루텐프리','건강식'] }
  },
  p202: {
    name: { en: 'Vegan Cheddar Slices 200g', ru: 'Веганский сыр Чеддер 200г', kk: 'Вегандық Чеддер сыры 200г', ko: '비건 체다 치즈 200g' },
    brand: { en: 'Violife', ru: 'Виолайф', kk: 'Виолайф', ko: '바이오라이프' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['vegan','cheese','dairy-free','plant-based'], ru: ['веган','сыр','без молока','растительный'], kk: ['веган','сыр','сүтсіз','өсімдік негізіндегі'], ko: ['비건','치즈','식물성','유제품프리'] }
  },
  p203: {
    name: { en: 'Firm Tofu 400g', ru: 'Тофу твердый 400г', kk: 'Тофу ірімшігі 400г', ko: '단단한 두부 400g' },
    brand: { en: 'Morinaga', ru: 'Моринага', kk: 'Моринага', ko: '모리나가' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['tofu','vegan','plant-based','soy','protein'], ru: ['тофу','веган','растительный','соя','белок'], kk: ['тофу','веган','өсімдік негізіндегі','соя','ақуыз'], ko: ['두부','비건','식물성','소이','단백질'] }
  },
  p204: {
    name: { en: 'Vegan Butter Spread 450g', ru: 'Веганское сливочное масло 450г', kk: 'Вегандық сары май 450г', ko: '비건 버터 스프레드 450g' },
    brand: { en: 'Flora', ru: 'Флора', kk: 'Флора', ko: '플로라' },
    weight: { en: '450g', ru: '450г', kk: '450г', ko: '450g' },
    tags: { en: ['vegan','butter','plant-based','dairy-free','spread'], ru: ['веган','масло','растительный','без молока','спред'], kk: ['веган','сары май','өсімдік негізіндегі','сүтсіз','спред'], ko: ['비건','버터','식물성','스프레드'] }
  },
  p205: {
    name: { en: 'Coconut Yogurt 150g', ru: 'Кокосовый йогурт 150г', kk: 'Кокос йогурты 150г', ko: '코코넛 요거트 150g' },
    brand: { en: 'Alpro', ru: 'Альпро', kk: 'Альпро', ko: '알프로' },
    weight: { en: '150g', ru: '150г', kk: '150г', ko: '150g' },
    tags: { en: ['vegan','yogurt','coconut','dairy-free','plant-based'], ru: ['веган','йогурт','кокос','без молока','растительный'], kk: ['веган','йогурт','кокос','сүтсіз','өсімдік негізіндегі'], ko: ['비건','요거트','코코넛','식물성'] }
  },
  p056: {
    name: { en: 'Lactose-Free Milk 1L', ru: 'Безлактозное молоко 1л', kk: 'Лактозасыз сүт 1л', ko: '락토프리 우유 1L' },
    brand: { en: 'Parmalat', ru: 'Пармалат', kk: 'Пармалат', ko: '파르마лат' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['lactose-free','milk','dairy'], ru: ['без лактозы','молоко','молочные продукты'], kk: ['лактозасыз','сүт','сүт өнімдері'], ko: ['락토프리','우유','유제품'] }
  },
  p206: {
    name: { en: 'Lactose-Free Yogurt 150g', ru: 'Безлактозный йогурт 150г', kk: 'Лактозасыз йогурт 150г', ko: '락토프리 요거트 150g' },
    brand: { en: 'Valio', ru: 'Валио', kk: 'Валио', ko: '발리오' },
    weight: { en: '150g', ru: '150г', kk: '150г', ko: '150g' },
    tags: { en: ['lactose-free','yogurt','dairy','strawberry'], ru: ['без лактозы','йогурт','молочные продукты','клубника'], kk: ['лактозасыз','йогурт','сүт өнімдері','құлпынай'], ko: ['락토프리','요거트','유제품','딸기'] }
  },
  p207: {
    name: { en: 'Almond Milk Unsweetened 1L', ru: 'Миндальное молоко без сахара 1л', kk: 'Шекерсіз бадам сүті 1л', ko: '무당 아몬드 브리즈 1L' },
    brand: { en: 'Alpro', ru: 'Альпро', kk: 'Альпро', ko: '알프로' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['almond milk','vegan','lactose-free','plant-based','dairy-free'], ru: ['миндальное молоко','веган','без лактозы','растительный','без молока'], kk: ['бадам сүті','веган','лактозасыз','өсімдік негізіндегі','сүтсіз'], ko: ['아몬드유','비건','락토프리','식물성'] }
  },
  p208: {
    name: { en: 'Oat Milk Original 1L', ru: 'Овсяное молоко Классическое 1л', kk: 'Сұлы сүті Классикалық 1л', ko: '오트밀크 오리지널 1L' },
    brand: { en: 'Oatly', ru: 'Оатли', kk: 'Оатли', ko: '오틀리' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['oat milk','vegan','lactose-free','plant-based','dairy-free'], ru: ['овсяное молоко','веган','без лактозы','растительный','без молока'], kk: ['сұлы сүті','веган','лактозасыз','өсімдік негізіндегі','сүтсіз'], ko: ['오트밀크','비건','식물성','유제품프리'] }
  },
  p057: {
    name: { en: 'Sugar-Free Dark Chocolate 100g', ru: 'Темный шоколад без сахара 100г', kk: 'Шекерсіз қара шоколад 100г', ko: '무설탕 다크 초콜릿 100g' },
    brand: { en: 'Lindt', ru: 'Линдт', kk: 'Линдт', ko: '린트' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['sugar-free','chocolate','dark chocolate','diet','diabetic'], ru: ['без сахара','шоколад','темный шоколад','диета','диабетический'], kk: ['шекерсіз','шоколад','қара шоколад','диета','диабеттік'], ko: ['무설탕','초콜릿','다크','건강식'] }
  },
  p209: {
    name: { en: 'Sugar-Free Oatmeal Cookies 250g', ru: 'Овсяное печенье без сахара 250г', kk: 'Шекерсіз сұлы печеньесі 250г', ko: '무설탕 오트밀 쿠키 250g' },
    brand: { en: 'Gullon', ru: 'Гульон', kk: 'Гульон', ko: '구용' },
    weight: { en: '250g', ru: '250г', kk: '250г', ko: '250g' },
    tags: { en: ['sugar-free','cookies','oatmeal','diet','snack'], ru: ['без сахара','печенье','овсяное','диета','перекус'], kk: ['шекерсіз','печенье','сұлы','диета','жеңіл тамақ'], ko: ['쿠키','무설탕','오트밀','과자'] }
  },
  p210: {
    name: { en: 'Stevia Sweetener 75g', ru: 'Подсластитель Стевия 75г', kk: 'Стевия тәттілендіргіш 75г', ko: '스테비아 감미료 75g' },
    brand: { en: 'Huxol', ru: 'Хуксол', kk: 'Хуксол', ko: '훅솔' },
    weight: { en: '75g', ru: '75г', kk: '75г', ko: '75g' },
    tags: { en: ['sugar-free','stevia','sweetener','zero-calorie','diet'], ru: ['без сахара','стевия','сахарозаменитель','ноль калорий','диета'], kk: ['шекерсіз','стевия','тәттілендіргіш','нөл калория','диета'], ko: ['감미료','스테비아','다이어트','제로'] }
  },
  p211: {
    name: { en: 'Erythritol Sweetener 500g', ru: 'Подсластитель Эритрит 500г', kk: 'Эритрит тәттілендіргіш 500г', ko: '에리스리톨 감미료 500g' },
    brand: { en: 'Now Foods', ru: 'Нау Фудс', kk: 'Нау Фудс', ko: '나우푸드' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['sugar-free','erythritol','sweetener','keto','zero-calorie'], ru: ['без сахара','эритрит','сахарозаменитель','кето','ноль калорий'], kk: ['шекерсіз','эритрит','тәттілендіргіш','кето','нөл калория'], ko: ['감미료','에리스리톨','키토','다이어트'] }
  },
  p212: {
    name: { en: 'Keto Seeded Bread 400g', ru: 'Кето-хлеб семечковый 400г', kk: 'Кето нан дәмдеуіштермен 400г', ko: '키토 식빵 400g' },
    brand: { en: 'Base Culture', ru: 'Бейс Калчер', kk: 'Бейс Калчер', ko: '베이스 컬처' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['keto','bread','low-carb','high-fiber','seed'], ru: ['кето','хлеб','низкоуглеводный','клетчатка','семечки'], kk: ['кето','нан','төмен көмірсулы','клетчатка','дәндер'], ko: ['식빵','키토','저탄수화물','건강식'] }
  },
  p213: {
    name: { en: 'Chia Seeds 300g', ru: 'Семена чиа 300г', kk: 'Чиа дәндері 300г', ko: '치아씨드 300g' },
    brand: { en: 'Natureland', ru: 'Нейчерленд', kk: 'Нейчерленд', ko: '네이처랜드' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['chia seeds','superfood','keto','vegan','omega-3','fiber'], ru: ['семена чиа','суперфуд','кето','веган','омега-3','клетчатка'], kk: ['чиа дәндері','суперфуд','кето','веган','омега-3','клетчатка'], ko: ['치아씨드','슈퍼푸드','건강식','비건'] }
  },
  p058: {
    name: { en: 'Whey Protein Gold 900g', ru: 'Сывороточный протеин 900г', kk: 'Сарысу протеині 900г', ko: '골드 웨이 프로틴 900g' },
    brand: { en: 'Optimum Nutrition', ru: 'Оптимум Нутришн', kk: 'Оптимум Нутришн', ko: '옵티멈 뉴트리션' },
    weight: { en: '900g', ru: '900г', kk: '900г', ko: '900g' },
    tags: { en: ['whey','protein','fitness','supplement','muscle'], ru: ['протеин','сыворотка','фитнес','добавка','мышцы'], kk: ['протеин','сарысу','фитнес','қоспа','бұлшықет'], ko: ['프로틴','단백질','웨이','헬스','보충제'] }
  },
  p300: {
    name: { en: 'Casein Protein 900g', ru: 'Казеиновый протеин 900г', kk: 'Казеин протеині 900г', ko: '카제인 단백질 900g' },
    brand: { en: 'Dymatize', ru: 'Диматайз', kk: 'Диматайз', ko: '디마타이즈' },
    weight: { en: '900g', ru: '900г', kk: '900г', ko: '900g' },
    tags: { en: ['casein','protein','slow-release','night','recovery'], ru: ['казеин','протеин','медленный белок','ночь','восстановление'], kk: ['казеин','протеин','баяу белок','түн','қалпына келтіру'], ko: ['단백질','카제인','보충제','취침전','헬스'] }
  },
  p301: {
    name: { en: 'Creatine Monohydrate 300g', ru: 'Креатин моногидрат 300г', kk: 'Креатин моногидраты 300г', ko: '크레아틴 모노하이드레이트 300g' },
    brand: { en: 'Optimum Nutrition', ru: 'Оптимум Нутришн', kk: 'Оптимум Нутришн', ko: '옵티멈 뉴트리션' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['creatine','supplement','performance','strength','gym'], ru: ['креатин','добавка','сила','тренировка','зал'], kk: ['креатин','қоспа','күш','жаттығу','зал'], ko: ['크레아틴','운동','부스터','보충제','헬스'] }
  },
  p302: {
    name: { en: 'BCAA Powder 300g', ru: 'Порошок BCAA 300г', kk: 'BCAA ұнтағы 300г', ko: 'BCAA 아미노산 분말 300g' },
    brand: { en: 'BSN', ru: 'БСН', kk: 'БСН', ko: '비에스엔' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['bcaa','amino acids','recovery','muscle','workout'], ru: ['bcaa','аминокислоты','восстановление','мышцы','тренировка'], kk: ['bcaa','аминқышқылдары','қалпына келтіру','бұлшықет','жаттығу'], ko: ['아미노산','BCAA','운동','복구','헬스'] }
  },
  p303: {
    name: { en: 'Pre-Workout Energy 300g', ru: 'Предтренировочный комплекс 300г', kk: 'Жаттығу алдындағы энергетик 300г', ko: '부스터 프리워크아웃 300g' },
    brand: { en: 'Cellucor C4', ru: 'Целлюкор C4', kk: 'Целлюкор C4', ko: '셀루코어 C4' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['pre-workout','energy','caffeine','pump','gym'], ru: ['предтреник','энергия','кофеин','пампинг','зал'], kk: ['жаттығу алдындағы','энергия','кофеин','пампинг','зал'], ko: ['부스터','에너지','카페인','운동','헬스'] }
  },
  p304: {
    name: { en: 'Omega-3 Fish Oil 60 caps', ru: 'Омега-3 рыбий жир 60 капс.', kk: 'Омега-3 балық майы 60 капс.', ko: '오메가3 오일 60캡슐' },
    brand: { en: 'Now Foods', ru: 'Нау Фудс', kk: 'Нау Фудс', ko: '나우푸드' },
    weight: { en: '60pcs', ru: '60 шт', kk: '60 дана', ko: '60캡슐' },
    tags: { en: ['omega-3','fish oil','heart','health','supplement'], ru: ['омега-3','рыбий жир','сердце','здоровье','добавка'], kk: ['омега-3','балық майы','жүрек','денсаулық','қоспа'], ko: ['오메가3','오일','건강','영양제'] }
  },
  p305: {
    name: { en: 'Collagen Peptides 300g', ru: 'Пептиды коллагена 300г', kk: 'Коллаген пептидтері 300г', ko: '콜라겐 펩타이드 300g' },
    brand: { en: 'Vital Proteins', ru: 'Вайтал Протеинс', kk: 'Вайтал Протеинс', ko: '바이탈 프로틴' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['collagen','beauty','skin','joints','supplement'], ru: ['коллаген','красота','кожа','суставы','добавка'], kk: ['коллаген','сұлулық','тері','буындар','қоспа'], ko: ['콜라겐','피부','관절','영양제'] }
  },
  p306: {
    name: { en: 'Multivitamin Daily 60 tabs', ru: 'Мультивитамины на каждый день 60 таб.', kk: 'Күнделікті мультивитаминдер 60 таб.', ko: '데일리 멀티비타민 60정' },
    brand: { en: 'Centrum', ru: 'Центрум', kk: 'Центрум', ko: '센트룸' },
    weight: { en: '60pcs', ru: '60 шт', kk: '60 дана', ko: '60정' },
    tags: { en: ['multivitamin','daily','health','vitamins','minerals'], ru: ['мультивитамины','каждый день','здоровье','витамины','минералы'], kk: ['мультивитаминдер','күнделікті','денсаулық','витаминдер','минералдар'], ko: ['멀티비타민','종합비타민','건강','비타민'] }
  },
  p059: {
    name: { en: 'Protein Bar Caramel 60g', ru: 'Протеиновый батончик Карамель 60г', kk: 'Протеин батончигі Карамель 60г', ko: '카라멜 단백질바 60g' },
    brand: { en: 'Quest', ru: 'Квест', kk: 'Квест', ko: '퀘스트' },
    weight: { en: '60g', ru: '60г', kk: '60г', ko: '60g' },
    tags: { en: ['protein bar','snack','fitness','caramel'], ru: ['протеиновый батончик','перекус','фитнес','карамель'], kk: ['протеин батончигі','жеңіл тамақ','фитнес','карамель'], ko: ['단백질바','프로틴바','간식','카라멜'] }
  },
  p307: {
    name: { en: 'Protein Shake RTD 330ml', ru: 'Готовый протеиновый коктейль 330мл', kk: 'Дайын протеин коктейлі 330мл', ko: '프로틴 쉐이크 음료 330ml' },
    brand: { en: 'Optimum Nutrition', ru: 'Оптимум Нутришн', kk: 'Оптимум Нутришн', ko: '옵티멈 뉴트리션' },
    weight: { en: '330ml', ru: '330мл', kk: '330мл', ko: '330ml' },
    tags: { en: ['protein shake','ready to drink','fitness','convenient'], ru: ['протеиновый коктейль','готовый напиток','фитнес','удобно'], kk: ['протеин коктейлі','дайын сусын','фитнес','ыңғайлы'], ko: ['단백질음료','프로틴쉐이크','헬스','간편식'] }
  },
  p308: {
    name: { en: 'Protein Granola 350g', ru: 'Протеиновая гранола 350г', kk: 'Протеин граноласы 350г', ko: '단백질 그래놀라 350g' },
    brand: { en: "Lizi's", ru: 'Лизис', kk: 'Лизис', ko: '리치스' },
    weight: { en: '350g', ru: '350г', kk: '350г', ko: '350g' },
    tags: { en: ['protein','granola','breakfast','crunchy','fitness'], ru: ['протеин','гранола','завтрак','хрустящий','фитнес'], kk: ['протеин','гранола','таңғы ас','қытырлақ','фитнес'], ko: ['그래놀라','시리얼','아침','단백질'] }
  },
  p309: {
    name: { en: 'Greek Yogurt High Protein 200g', ru: 'Греческий йогурт высокобелковый 200г', kk: 'Грек йогурты жоғары протеинді 200г', ko: '고단백 그릭 요거트 200g' },
    brand: { en: 'Ehrmann', ru: 'Эрманн', kk: 'Эрманн', ko: '에르만' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['greek yogurt','protein','dairy','healthy','breakfast'], ru: ['греческий йогурт','белок','молочные продукты','здоровое питание','завтрак'], kk: ['грек йогурты','ақуыз','сүт өнімдері','пайдалы','таңғы ас'], ko: ['요거트','그릭요거트','단백질','유제품'] }
  },
  p310: {
    name: { en: 'Peanut Butter Natural 500g', ru: 'Арахисовая паста натуральная 500г', kk: 'Натурал арахис пастасы 500г', ko: '내추럴 땅콩버터 500g' },
    brand: { en: 'Myprotein', ru: 'Майпротеин', kk: 'Майпротеин', ko: '마이프로틴' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['peanut butter','protein','healthy fats','spread','natural'], ru: ['арахисовая паста','протеин','полезные жиры','спред','натуральный'], kk: ['арахис пастасы','ақуыз','пайдалы майлар','спред','натурал'], ko: ['땅콩버터','스프레드','견과류','단백질'] }
  },
  p060: {
    name: { en: 'Roasted Chickpeas 150g', ru: 'Жареный нут 150г', kk: 'Қуырылған нут 150г', ko: '구운 병아리콩 150g' },
},
  p516: {
    name: { en: 'Baking Powder 100g', ru: 'Разрыхлитель теста 100г', kk: 'Қопсытқыш 100г', ko: '베이킹 파우더 100g' },
    brand: { en: 'Dr. Oetker', ru: 'Dr. Oetker', kk: 'Dr. Oetker', ko: '닥터 오트커' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['baking powder','bakery','baking','ingredients'], ru: ['разрыхлитель','выпечка','ингредиенты'], kk: ['қопсытқыш','наубайхана','пирог','ингредиенттер'], ko: ['베이킹 파우더','베이커리','베이킹','재료'] }
  },
  p701: {
    name: { en: 'Cucumbers (1kg)', ru: 'Огурцы (1кг)', kk: 'Қияр (1кг)', ko: '오이 (1kg)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['cucumber','vegetable','fresh','salad'], ru: ['огурец','овощи','свежий','салат'], kk: ['қияр','көкөністер','жаңа піскен','салат'], ko: ['오이','야채','신선한','샐러드'] }
  },
  p702: {
    name: { en: 'Cabbage (1 head)', ru: 'Капуста (1 кочан)', kk: 'Қырыққабат (1 дана)', ko: '양배추 (1통)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    tags: { en: ['cabbage','vegetable','fresh','head'], ru: ['капуста','овощи','свежий','кочан'], kk: ['қырыққабат','көкөністер','жаңа піскен','дана'], ko: ['양배추','야채','신선한','통'] }
  },
  p703: {
    name: { en: 'Bell Peppers (mix pack)', ru: 'Болгарский перец (микс)', kk: 'Болгар бұрышы (микс)', ko: '파프리카 (믹스)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['pepper','bell pepper','vegetable','mix'], ru: ['перец','болгарский перец','овощи','микс'], kk: ['бұрыш','болгар бұрышы','көкөністер','микс'], ko: ['고추','피망','야채','믹스'] }
  },
  p704: {
    name: { en: 'Spinach (200g)', ru: 'Шпинат (200г)', kk: 'Шпинат (200г)', ko: '시금치 (200g)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['spinach','greens','vegetable','healthy'], ru: ['шпинат','зелень','овощи','здоровое питание'], kk: ['шпинат','көк шөп','көкөністер','пайдалы'], ko: ['시금치','나물','야채','건강식'] }
  },
  p705: {
    name: { en: 'Broccoli (500g)', ru: 'Брокколи (500г)', kk: 'Брокколи (500г)', ko: '브로콜리 (500g)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['broccoli','vegetable','healthy','fresh'], ru: ['брокколи','овощи','здоровое питание','свежий'], kk: ['брокколи','көкөністер','пайдалы','жаңа піскен'], ko: ['브로콜리','야채','건강식','신선한'] }
  },
  p706: {
    name: { en: 'Cauliflower (1 head)', ru: 'Цветная капуста (1 кочан)', kk: 'Гүлді қырыққабат (1 дана)', ko: '콜리플라워 (1통)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    tags: { en: ['cauliflower','vegetable','head','fresh'], ru: ['цветная капуста','овощи','кочан','свежий'], kk: ['гүлді қырыққабат','көкөністер','дана','жаңа піскен'], ko: ['콜리플라워','야채','통','신선한'] }
  },
  p707: {
    name: { en: 'Eggplant (1kg)', ru: 'Баклажаны (1кг)', kk: 'Баклажан (1кг)', ko: '가지 (1kg)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['eggplant','aubergine','vegetable'], ru: ['баклажан','овощи'], kk: ['баклажан','көкөністер'], ko: ['가지','야채'] }
  },
  p708: {
    name: { en: 'Garlic (250g)', ru: 'Чеснок (250г)', kk: 'Сарымсақ (250г)', ko: '마늘 (250g)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '250g', ru: '250г', kk: '250г', ko: '250g' },
    tags: { en: ['garlic','vegetable','seasoning'], ru: ['чеснок','овощи','приправа'], kk: ['сарымсақ','көкөністер','дәмдеуіш'], ko: ['마늘','야채','양념'] }
  },
  p709: {
    name: { en: 'Green Beans (500g)', ru: 'Стручковая фасоль (500г)', kk: 'Көк бұршақ (500г)', ko: '그린빈 (500g)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['beans','green beans','vegetable'], ru: ['фасоль','стручковая фасоль','овощи'], kk: ['бұршақ','көк бұршақ','көкөністер'], ko: ['콩','껍질콩','야채'] }
  },
  p710: {
    name: { en: 'Zucchini (1kg)', ru: 'Цукини (1кг)', kk: 'Цукини (1кг)', ko: '주키니 호박 (1kg)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['zucchini','vegetable','squash'], ru: ['кабачок','цукини','овощи'], kk: ['кабачок','цукини','көкөністер'], ko: ['호박','주키니','야채'] }
  },
  p711: {
    name: { en: 'Radish (bunch)', ru: 'Редис (пучок)', kk: 'Шалғам (байлам)', ko: '래디시 (한 단)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    tags: { en: ['radish','vegetable','bunch','fresh'], ru: ['редиска','редис','овощи','пучок'], kk: ['шалғам','көкөністер','байлам','жаңа піскен'], ko: ['래디시','야채','단','신선한'] }
  },
  p712: {
    name: { en: 'Lettuce (1 head)', ru: 'Салат Латук (1 кочан)', kk: 'Латук салаты (1 дана)', ko: '양상추 (1통)' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '현지' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    tags: { en: ['lettuce','salad','greens','head','vegetable'], ru: ['салат','латук','зелень','кочан','овощи'], kk: ['салат','латук салаты','көк шөп','дана','көкөністер'], ko: ['상추','샐러드','야채','통'] }
  },
  p311: {
    name: { en: 'Mixed Nuts Trail Mix 200g', ru: 'Смесь орехов 200г', kk: 'Жаңғақтар қоспасы 200г', ko: '믹스넛 견과류 200g' },
    brand: { en: 'Alesto', ru: 'Алесто', kk: 'Алесто', ko: '알레스토' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['mixed nuts','trail mix','healthy fats','snack','omega'], ru: ['ореховая смесь','микс орехов','полезные жиры','перекус','омега'], kk: ['жаңғақтар қоспасы','орех микс','пайдалы майлар','жеңіл тамақ','омега'], ko: ['견과류','하루견과','믹스넛','간식'] }
  },
  p312: {
    name: { en: 'Fitness Oatmeal 500g', ru: 'Фитнес-овсянка 500г', kk: 'Фитнес сұлы жармасы 500г', ko: '피트니스 오트밀 500g' },
    brand: { en: 'Quaker', ru: 'Квейкер', kk: 'Квейкер', ko: '퀘이커' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['oatmeal','whole grain','breakfast','slow carbs','fiber'], ru: ['овсянка','цельное зерно','завтрак','медленные углеводы','клетчатка'], kk: ['сұлы жармасы','бүтін дән','таңғы ас','баяу көмірсулар','клетчатка'], ko: ['오트밀','아침','곡물','식이섬유'] }
  },
  p313: {
    name: { en: 'Monster Energy Zero 500ml', ru: 'Энергетик Monster Zero 500мл', kk: 'Monster Zero энергетигі 500мл', ko: '몬스터 에너지 제로 500ml' },
    brand: { en: 'Monster', ru: 'Монстр', kk: 'Монстр', ko: '몬스터' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    tags: { en: ['monster','energy drink','zero sugar','caffeine','workout'], ru: ['монстр','энергетик','без сахара','кофеин','тренировка'], kk: ['монстр','энергетик','шекерсіз','кофеин','жаттығу'], ko: ['몬스터','에너지드링크','제로','카페인'] }
  },
  p314: {
    name: { en: 'Electrolyte Isotonic 500ml', ru: 'Изотоник Электролит 500мл', kk: 'Электролит изотонигі 500мл', ko: '파워에이드 전해질 음료 500ml' },
    brand: { en: 'Powerade', ru: 'Пауэрэйд', kk: 'Пауэрэйд', ko: '파워에이드' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    tags: { en: ['electrolyte','isotonic','hydration','sports drink','workout'], ru: ['электролиты','изотоник','гидратация','спортивный напиток','тренировка'], kk: ['электролиттер','изотоник','гидратация','спорттық сусын','жаттығу'], ko: ['파워에이드','스포츠음료','이온음료','전해질'] }
  },
  p062: {
    name: { en: 'Organic Milk 1L', ru: 'Органическое молоко 1л', kk: 'Органикалық сүт 1л', ko: '유기농 우유 1L' },
    brand: { en: 'BioFarm', ru: 'БиоФарм', kk: 'БиоФарм', ko: '바이오팜' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['organic','milk','dairy'], ru: ['органик','молоко','молочные продукты'], kk: ['органикалық','сүт','сүт өнімдері'], ko: ['유기농','우유','유제품'] }
  },
  p063: {
    name: { en: 'Organic Yogurt 500g', ru: 'Органический йогурт 500г', kk: 'Органикалық йогурт 500г', ko: '유기농 요거트 500g' },
    brand: { en: 'Nature', ru: 'Нейчер', kk: 'Нейчер', ko: '네이처' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['organic','yogurt','dairy'], ru: ['органик','йогурт','молочные продукты'], kk: ['органикалық','йогурт','сүт өнімдері'], ko: ['유기농','요거트','유제품'] }
  },
  p064: {
    name: { en: 'Organic Cheese 250g', ru: 'Органический сыр 250г', kk: 'Органикалық сыр 250г', ko: '유기농 치즈 250g' },
    brand: { en: 'Green Valley', ru: 'Грин Вэлли', kk: 'Грин Вэлли', ko: '그린밸리' },
    weight: { en: '250g', ru: '250г', kk: '250г', ko: '250g' },
    tags: { en: ['organic','cheese','dairy'], ru: ['органик','сыр','молочные продукты'], kk: ['органикалық','сыр','сүт өнімдері'], ko: ['유기농','치즈','유제품'] }
  },
  p065: {
    name: { en: 'Organic Butter 200g', ru: 'Органическое масло 200г', kk: 'Органикалық сары май 200г', ko: '유기농 버터 200g' },
    brand: { en: 'Pure', ru: 'Пьюр', kk: 'Пьюр', ko: '퓨어' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['organic','butter','dairy'], ru: ['органик','масло','молочные продукты'], kk: ['органикалық','сары май','сүт өнімдері'], ko: ['유기농','버터','유제품'] }
  },
  p066: {
    name: { en: 'Organic Eggs x10', ru: 'Органические яйца 10 шт', kk: 'Органикалық жұмыртқа 10 дана', ko: '유기농 달걀 10구' },
    brand: { en: 'Happy Hen', ru: 'Хэппи Хен', kk: 'Хэппи Хен', ko: '해피헨' },
    weight: { en: '10pcs', ru: '10 шт', kk: '10 дана', ko: '10구' },
    tags: { en: ['organic','eggs','breakfast'], ru: ['органик','яйца','завтрак'], kk: ['органикалық','жұмыртқа','таңғы ас'], ko: ['유기농','달걀','아침'] }
  },
  p067: {
    name: { en: 'Organic Apples 1kg', ru: 'Органические яблоки 1кг', kk: 'Органикалық алма 1кг', ko: '유기농 사과 1kg' },
    brand: { en: 'Eco', ru: 'Эко', kk: 'Эко', ko: '에코' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['organic','apples','fruit'], ru: ['органик','яблоки','фрукты'], kk: ['органикалық','алма','жемістер'], ko: ['유기농','사과','과일'] }
  },
  p068: {
    name: { en: 'Organic Bananas 1kg', ru: 'Органические бананы 1кг', kk: 'Органикалық банан 1кг', ko: '유기농 바나나 1kg' },
    brand: { en: 'FairTrade', ru: 'ФэйрТрейд', kk: 'ФэйрТрейд', ko: '페어트레이드' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['organic','bananas','fruit'], ru: ['органик','бананы','фрукты'], kk: ['органикалық','банан','жемістер'], ko: ['유기농','ба나나','과일'] }
  },
  p069: {
    name: { en: 'Organic Tomatoes 500g', ru: 'Органические томаты 500г', kk: 'Органикалық қызанақ 500г', ko: '유기농 토마토 500g' },
    brand: { en: 'Sun', ru: 'Сан', kk: 'Сан', ko: '선' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['organic','tomatoes','vegetable'], ru: ['органик','помидоры','овощи'], kk: ['органикалық','қызанақ','көкөністер'], ko: ['유기농','토마토','야채'] }
  },
  p070: {
    name: { en: 'Organic Carrots 1kg', ru: 'Органическая морковь 1кг', kk: 'Органикалық сәбіз 1кг', ko: '유기농 당근 1kg' },
    brand: { en: 'Root', ru: 'Рут', kk: 'Рут', ko: '루т' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['organic','carrots','vegetable'], ru: ['органик','морковь','овощи'], kk: ['органикалық','сәбіз','көкөністер'], ko: ['유기농','당근','야채'] }
  },
  p071: {
    name: { en: 'Organic Potatoes 1kg', ru: 'Органический картофель 1кг', kk: 'Органикалық картоп 1кг', ko: '유기농 감자 1kg' },
    brand: { en: 'Earth', ru: 'Эрт', kk: 'Эрт', ko: '어스' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['organic','potatoes','vegetable'], ru: ['органик','картошка','овощи'], kk: ['органикалық','картоп','көкөністер'], ko: ['유기농','감자','야채'] }
  },
  p072: {
    name: { en: 'Organic Honey 400g', ru: 'Органический мед 400г', kk: 'Органикалық бал 400г', ko: '유기농 꿀 400g' },
    brand: { en: 'Bee', ru: 'Би', kk: 'Би', ko: '비' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    tags: { en: ['organic','honey','sweetener'], ru: ['органик','мед','сладкое'], kk: ['органикалық','бал','тәтті'], ko: ['유기농','꿀','조미료'] }
  },
  p073: {
    name: { en: 'Organic Green Tea', ru: 'Органический зеленый чай', kk: 'Органикалық көк шай', ko: '유기농 녹차' },
    brand: { en: 'Leaf', ru: 'Лиф', kk: 'Лиф', ko: '리프' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['organic','tea','drink'], ru: ['органик','чай','напиток'], kk: ['органикалық','шай','сусын'], ko: ['유기농','차','녹차'] }
  },
  p074: {
    name: { en: 'Organic Oatmeal 500g', ru: 'Органическая овсянка 500г', kk: 'Органикалық сұлы жармасы 500г', ko: '유기농 오트밀 500g' },
    brand: { en: 'Grain', ru: 'Грейн', kk: 'Грейн', ko: '그레인' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['organic','oatmeal','breakfast'], ru: ['органик','овсянка','завтрак'], kk: ['органикалық','сұлы жармасы','таңғы ас'], ko: ['유기농','오트밀','아침'] }
  },
  p075: {
    name: { en: 'Organic Brown Rice 1kg', ru: 'Органический бурый рис 1кг', kk: 'Органикалық қоңыр күріш 1кг', ko: '유기농 현미 1kg' },
    brand: { en: 'Health', ru: 'Хелс', kk: 'Хелс', ko: '헬스' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    tags: { en: ['organic','rice','grain'], ru: ['органик','рис','крупа'], kk: ['органикалық','күріш','дән'], ko: ['유기농','현미','곡물'] }
  },
  p076: {
    name: { en: 'Organic Almond Milk 1L', ru: 'Органическое миндальное молоко 1л', kk: 'Органикалық бадам сүті 1л', ko: '유기농 아몬드유 1L' },
    brand: { en: 'Nut', ru: 'Нат', kk: 'Нат', ko: '넛' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['organic','almond milk','vegan'], ru: ['органик','миндальное молоко','веган'], kk: ['органикалық','бадам сүті','веган'], ko: ['유기농','아몬드유','비건'] }
  },
  p077: {
    name: { en: 'Organic Dark Chocolate 100g', ru: 'Органический темный шоколад 100г', kk: 'Органикалық қара шоколад 100г', ko: '유기농 다크 초콜릿 100g' },
    brand: { en: 'Cacao', ru: 'Какао', kk: 'Какао', ko: '카카오' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['organic','chocolate','snack'], ru: ['органик','шоколад','перекус'], kk: ['органикалық','шоколад','жеңіл тамақ'], ko: ['유기농','초콜릿','스낵'] }
  },
  p078: {
    name: { en: 'Organic Mixed Nuts 200g', ru: 'Органическая смесь орехов 200г', kk: 'Органикалық жаңғақтар қоспасы 200г', ko: '유기농 믹스넛 200g' },
    brand: { en: 'Wild', ru: 'Уайлд', kk: 'Уайлд', ko: '와일드' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['organic','nuts','snack'], ru: ['органик','орехи','перекус'], kk: ['органикалық','жаңғақтар','жеңіл тамақ'], ko: ['유기농','견과류','스낵'] }
  },
  p501: {
    name: { en: 'Baguette 300g', ru: 'Багет 300г', kk: 'Багет 300г', ko: '바게트 300g' },
    brand: { en: 'Aksay Nan', ru: 'Аксай Нан', kk: 'Ақсай Нан', ko: '악사이 난' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['bread','bakery','baguette','french'], ru: ['хлеб','выпечка','багет','французский'], kk: ['нан','наубайхана','багет','француздық'], ko: ['빵','베이커리','바게트','프랑스식'] }
  },
  p502: {
    name: { en: 'Whole Wheat Bread 500g', ru: 'Цельнозерновой хлеб 500г', kk: 'Тұтас дәнді нан 500г', ko: '통밀빵 500g' },
    brand: { en: 'Aksay Nan', ru: 'Аксай Нан', kk: 'Ақсай Нан', ko: '악사이 난' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['bread','bakery','whole wheat','healthy'], ru: ['хлеб','выпечка','цельнозерновой','здоровое питание'], kk: ['нан','наубайхана','тұтас дәнді','пайдалы'], ko: ['빵','베이커리','통밀','건강식'] }
  },
  p503: {
    name: { en: 'Toast Bread 600g', ru: 'Тостовый хлеб 600г', kk: 'Тост наны 600г', ko: '토스트 빵 600g' },
    brand: { en: 'Harry\'s', ru: 'Harry\'s', kk: 'Harry\'s', ko: '해리스' },
    weight: { en: '600g', ru: '600г', kk: '600г', ko: '600g' },
    tags: { en: ['bread','bakery','toast','sliced'], ru: ['хлеб','выпечка','тосты','нарезной'], kk: ['нан','наубайхана','тост','тілімделген'], ko: ['빵','베이кер리','토스트','슬라이스'] }
  },
  p504: {
    name: { en: 'Sourdough Bread 700g', ru: 'Хлеб на закваске 700г', kk: 'Ашытқы наны 700г', ko: '사워도우 빵 700g' },
    brand: { en: 'Magnum Bakery', ru: 'Пекарня Magnum', kk: 'Magnum Наубайханасы', ko: '매г넘 베이커리' },
    weight: { en: '700g', ru: '700г', kk: '700г', ko: '700g' },
    tags: { en: ['bread','bakery','sourdough','artisanal'], ru: ['хлеб','выпечка','закваска','ремесленный'], kk: ['нан','наубайхана','ашытқы','қолдан жасалған'], ko: ['빵','베이커리','사워도우','수제'] }
  },
  p505: {
    name: { en: 'Croissant (Pack of 4)', ru: 'Круассаны (упаковка 4 шт)', kk: 'Круассандар (4 дана)', ko: '크루아상 (4개입)' },
    brand: { en: 'Magnum Bakery', ru: 'Пекарня Magnum', kk: 'Magnum Наубайханасы', ko: '매г넘 베이커리' },
    weight: { en: '4pcs', ru: '4 шт', kk: '4 дана', ko: '4개입' },
    tags: { en: ['croissant','bakery','butter','pastry','breakfast'], ru: ['круассан','выпечка','масло','слоеный','завтрак'], kk: ['круассан','наубайхана','май','қатпарлы','таңғы ас'], ko: ['크루아상','베이커리','버터','페이스트리','아침 식사'] }
  },
  p506: {
    name: { en: 'Cinnamon Rolls (Pack of 2)', ru: 'Булочки с корицей (упаковка 2 шт)', kk: 'Корица қосылған тоқаштар (2 дана)', ko: '시나몬 롤 (2개입)' },
    brand: { en: 'Magnum Bakery', ru: 'Пекарня Magnum', kk: 'Magnum Наубайханасы', ko: '매г넘 베이커리' },
    weight: { en: '2pcs', ru: '2 шт', kk: '2 дана', ko: '2개입' },
    tags: { en: ['cinnamon roll','bakery','pastry','sweet','icing'], ru: ['булочка с корицей','выпечка','сладкое','глазурь'], kk: ['тоқаш','наубайхана','корица','тәтті','глазурь'], ko: ['시나몬롤','베이커리','페이스트리','단맛','아이싱'] }
  },
  p507: {
    name: { en: 'Chocolate Chip Cookies 200g', ru: 'Печенье с шоколадной крошкой 200г', kk: 'Шоколад кесектері бар печенье 200г', ko: '초코칩 쿠키 200g' },
    brand: { en: 'Merba', ru: 'Merba', kk: 'Merba', ko: '메르바' },
    weight: { en: '200g', ru: '200г', kk: '200г', ko: '200g' },
    tags: { en: ['cookies','bakery','chocolate','sweet','biscuit'], ru: ['печенье','выпечка','шоколад','сладкое'], kk: ['печенье','наубайхана','шоколад','тәтті'], ko: ['쿠키','베이커리','초콜릿','단맛','비스킷'] }
  },
  p508: {
    name: { en: 'Butter Cookies 300g', ru: 'Сливочное печенье 300г', kk: 'Сары май печеньесі 300г', ko: '버터 쿠키 300g' },
    brand: { en: 'Danisa', ru: 'Danisa', kk: 'Danisa', ko: '다니사' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    tags: { en: ['cookies','bakery','butter','sweet','biscuit'], ru: ['печенье','выпечка','сливочное масло','сладкое'], kk: ['печенье','наубайхана','сары май','тәтті'], ko: ['쿠키','베이커리','버터','단맛','비스킷'] }
  },
  p509: {
    name: { en: 'Oatmeal Cookies 250g', ru: 'Овсяное печенье 250г', kk: 'Сұлы печеньесі 250г', ko: '오트밀 쿠키 250g' },
    brand: { en: 'Khlebny Spas', ru: 'Хлебный Спас', kk: 'Хлебный Спас', ko: '흘레브ни 스파스' },
    weight: { en: '250g', ru: '250г', kk: '250г', ko: '250g' },
    tags: { en: ['cookies','bakery','oatmeal','healthy','biscuit'], ru: ['печенье','выпечка','овсяное','полезно'], kk: ['печенье','наубайхана','сұлы','пайдалы'], ko: ['쿠키','베이커리','오트밀','건강식','비스킷'] }
  },
  p510: {
    name: { en: 'Wafer Biscuits 180g', ru: 'Вафли 180г', kk: 'Вафли 180г', ko: '웨하스 비스킷 180g' },
    brand: { en: 'Yashkino', ru: 'Яшкино', kk: 'Яшкино', ko: '야시키노' },
    weight: { en: '180g', ru: '180г', kk: '180г', ko: '180g' },
    tags: { en: ['wafer','bakery','biscuits','sweet','chocolate'], ru: ['вафли','выпечка','сладкое','шоколад'], kk: ['вафли','наубайхана','тәтті','шоколад'], ko: ['웨하스','베이커리','비스킷','단맛','초콜릿'] }
  },
  p511: {
    name: { en: 'Chocolate Sponge Cake 500g', ru: 'Шоколадный бисквитный торт 500г', kk: 'Шоколадты бисквит торт 500г', ko: '초콜릿 스펀지 케이크 500g' },
    brand: { en: 'Bayan Sulu', ru: 'Баян Сулу', kk: 'Баян Сұлу', ko: '바얀 술루' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    tags: { en: ['cake','bakery','chocolate','sponge cake','sweet','dessert'], ru: ['торт','выпечка','шоколад','бисквит','сладкое','десерт'], kk: ['торт','наубайхана','шоколад','бисквит','тәтті','десерт'], ko: ['케이크','베이커리','초콜릿','스펀지 케이크','단맛','디저트'] }
  },
  p512: {
    name: { en: 'Cheesecake Slice 150g', ru: 'Кусочек чизкейка 150г', kk: 'Чизкейк тілімі 150г', ko: '치즈케이크 한 조각 150g' },
    brand: { en: 'Galmart Bakery', ru: 'Пекарня Galmart', kk: 'Galmart Наубайханасы', ko: '갈마트 베이커리' },
    weight: { en: '150g', ru: '150г', kk: '150г', ko: '150g' },
    tags: { en: ['cheesecake','bakery','cheese','dessert','sweet','slice'], ru: ['чизкейк','выпечка','сыр','десерт','сладкое','кусочек'], kk: ['чизкейк','наубайхана','ірімшік','десерт','тәтті','тілім'], ko: ['치즈케이크','베이커리','치즈','디저트','단맛','조각'] }
  },
  p513: {
    name: { en: 'Cupcakes (Pack of 6)', ru: 'Капкейки (упаковка 6 шт)', kk: 'Капкейктер (6 дана)', ko: '컵케이크 (6개입)' },
    brand: { en: 'Magnum Bakery', ru: 'Пекарня Magnum', kk: 'Magnum Наубайханасы', ko: '매г넘 베이커리' },
    weight: { en: '6pcs', ru: '6 шт', kk: '6 дана', ko: '6개입' },
    tags: { en: ['cupcakes','bakery','sweet','dessert','sprinkles'], ru: ['капкейки','выпечка','сладкое','десерт','посыпка'], kk: ['капкейктер','наубайхана','тәтті','десерт','сеппе'], ko: ['컵케이크','베이커리','단맛','디저트','스프링클'] }
  },
  p514: {
    name: { en: 'Donuts (Pack of 4, glazed)', ru: 'Пончики глазированные (4 шт)', kk: 'Глазурленген пончиктер (4 дана)', ko: '도넛 (4개입, 글레이즈드)' },
    brand: { en: 'Magnum Bakery', ru: 'Пекарня Magnum', kk: 'Magnum Наубайханасы', ko: '매г넘 베이커리' },
    weight: { en: '4pcs', ru: '4 шт', kk: '4 дана', ko: '4개입' },
    tags: { en: ['donuts','bakery','glazed','sweet','dessert'], ru: ['пончики','выпечка','глазурь','сладкое','десерт'], kk: ['пончиктер','наубайхана','глазурь','тәтті','десерт'], ko: ['도넛','베이커리','글레이즈드','단맛','디저트'] }
  },
  p515: {
    name: { en: 'Dry Yeast 100g', ru: 'Сухие дрожжи 100г', kk: 'Құрғақ ашытқы 100г', ko: '건조 효모 100g' },
    brand: { en: 'Saf-Moment', ru: 'Саф-Момент', kk: 'Саф-Момент', ko: '사프 모멘트' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['yeast','bakery','dry yeast','baking','ingredients'], ru: ['дрожжи','выпечка','сухие дрожжи','ингредиенты'], kk: ['ашытқы','наубайхана','құрғақ ашытқы','ингредиенттер'], ko: ['이스트','베이커리','드라이 이스트','베이킹','재료'] }
  },
  p516: {
    name: { en: 'Baking Powder 100g', ru: 'Разрыхлитель теста 100г', kk: 'Қопсытқыш 100г', ko: '베икинг 파удер 100g' },
    brand: { en: 'Dr. Oetker', ru: 'Dr. Oetker', kk: 'Dr. Oetker', ko: '닥터 오트커' },
    weight: { en: '100g', ru: '100г', kk: '100г', ko: '100g' },
    tags: { en: ['baking powder','bakery','baking','ingredients'], ru: ['разрыхлитель','выпечка','ингредиенты'], kk: ['қопсытқыш','наубайхана','пирог','ингредиенттер'], ko: ['베이킹 파우더','베이커리','베이킹','재료'] }
  },
  p405: {
    name: { en: 'Mouthwash (500ml)', ru: 'Ополаскиватель для рта (500мл)', kk: 'Ауыз қуысын шаюға арналған сұйықтық (500мл)', ko: '구강청결제 (500ml)' },
    brand: { en: 'Colgate', ru: 'Colgate', kk: 'Colgate', ko: '콜게이트' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    tags: { en: ['mouthwash','care','dental','hygiene'], ru: ['ополаскиватель для рта','уход','стоматология','гигиена'], kk: ['ауыз қуысын шаю','күтім','стоматология','гигиена'], ko: ['구강청결제','케어','치아','위생'] }
  },
  p406: {
    name: { en: 'Deodorant spray (150ml)', ru: 'Дезодорант-спрей (150мл)', kk: 'Дезодорант-спрей (150мл)', ko: '데오도란트 스프레이 (150ml)' },
    brand: { en: 'Rexona', ru: 'Rexona', kk: 'Rexona', ko: '렉소나' },
    weight: { en: '150ml', ru: '150мл', kk: '150мл', ko: '150ml' },
    tags: { en: ['deodorant','spray','care','hygiene'], ru: ['дезодорант','спрей','уход','гигиена'], kk: ['дезодорант','спрей','күтім','гигиена'], ko: ['데오도란트','스프레이','케어','위생'] }
  },
  p407: {
    name: { en: 'Roll-on deodorant (50ml)', ru: 'Шариковый дезодорант (50мл)', kk: 'Ролик дезодоранты (50мл)', ko: '롤온 데오도란트 (50ml)' },
    brand: { en: 'Nivea', ru: 'Nivea', kk: 'Nivea', ko: 'нибеа' },
    weight: { en: '50ml', ru: '50мл', kk: '50мл', ko: '50ml' },
    tags: { en: ['deodorant','roll-on','care','hygiene'], ru: ['дезодорант','шариковый','уход','гигиена'], kk: ['дезодорант','ролик','күтім','гигиена'], ko: ['데오도란트','롤온','케어','위생'] }
  },
  p408: {
    name: { en: 'Shower gel / Body wash (250ml)', ru: 'Гель для душа (250мл)', kk: 'Душқа арналған гель (250мл)', ko: '바디워시 (250ml)' },
    brand: { en: 'Nivea', ru: 'Nivea', kk: 'Nivea', ko: 'нибеа' },
    weight: { en: '250ml', ru: '250мл', kk: '250мл', ko: '250ml' },
    tags: { en: ['shower gel','body wash','shower','care'], ru: ['гель для душа','очищение тела','душ','уход'], kk: ['душқа арналған гель','денені жуу','душ','күтім'], ko: ['바디워시','샤워젤','샤워','케어'] }
  },
  p409: {
    name: { en: 'Hand soap liquid (300ml)', ru: 'Жидкое мыло для рук (300мл)', kk: 'Қолға арналған сұйық сабын (300мл)', ko: '액체 손세정제 (300ml)' },
    brand: { en: 'Safeguard', ru: 'Safeguard', kk: 'Safeguard', ko: '세이프가드' },
    weight: { en: '300ml', ru: '300мл', kk: '300мл', ko: '300ml' },
    tags: { en: ['soap','liquid soap','hand soap','care','hygiene'], ru: ['мыло','жидкое мыло','мыло для рук','уход','гигиена'], kk: ['сабын','сұйық сабын','қол сабын','күтім','гигиена'], ko: ['비누','액체 비누','핸드워시','케어','위생'] }
  },
  p410: {
    name: { en: 'Face cleanser (200ml)', ru: 'Очищающее средство для лица (200мл)', kk: 'Бетті тазартуға арналған құрал (200мл)', ko: '폼클렌저 (200ml)' },
    brand: { en: "L'Oreal", ru: "L'Oreal", kk: "L'Oreal", ko: '로레알' },
    weight: { en: '200ml', ru: '200мл', kk: '200мл', ko: '200ml' },
    tags: { en: ['face cleanser','skincare','care','face'], ru: ['очищение лица','уход за кожей','уход','лицо'], kk: ['бетті тазарту','тері күтімі','күтім','бет'], ko: ['클렌저','스킨케어','케어','얼굴'] }
  },
  p411: {
    name: { en: 'Facial moisturizer cream (100ml)', ru: 'Увлажняющий крем для лица (100мл)', kk: 'Бетке арналған ылғалдандырғыш крем (100мл)', ko: '페이스 수분크림 (100ml)' },
    brand: { en: 'Nivea', ru: 'Nivea', kk: 'Nivea', ko: 'нибеа' },
    weight: { en: '100ml', ru: '100мл', kk: '100мл', ko: '100ml' },
    tags: { en: ['moisturizer','cream','skincare','care','face'], ru: ['увлажняющий крем','крем','уход за кожей','уход','лицо'], kk: ['ылғалдандырғыш','крем','тері күтімі','күтім','бет'], ko: ['수분크림','크림','스킨케어','케어','얼굴'] }
  },
  p412: {
    name: { en: 'Sunscreen SPF 50 (100ml)', ru: 'Солнцезащитный крем SPF 50 (100мл)', kk: 'Күннен қорғайтын крем SPF 50 (100мл)', ko: '선크림 SPF 50 (100ml)' },
    brand: { en: 'Nivea', ru: 'Nivea', kk: 'Nivea', ko: 'нибеа' },
    weight: { en: '100ml', ru: '100мл', kk: '100мл', ko: '100ml' },
    tags: { en: ['sunscreen','spf','care','summer','protection'], ru: ['солнцезащитный крем','spf','уход','лето','защита'], kk: ['күннен қорғайтын крем','spf','күтім','жаз','қорғаныс'], ko: ['선크림','SPF','케어','여름','자외선차단'] }
  },
  p413: {
    name: { en: 'Hair conditioner (250ml)', ru: 'Кондиционер для волос (250мл)', kk: 'Шашқа арналған кондиционер (250мл)', ko: '헤어 컨디셔너 (250ml)' },
    brand: { en: 'Dove', ru: 'Dove', kk: 'Dove', ko: '도브' },
    weight: { en: '250ml', ru: '250мл', kk: '250мл', ko: '250ml' },
    tags: { en: ['conditioner','hair','care'], ru: ['кондиционер','волосы','уход'], kk: ['кондиционер','шаш','күтім'], ko: ['컨디셔너','헤어','케어'] }
  },
  p414: {
    name: { en: 'Hair styling gel (150ml)', ru: 'Гель для укладки волос (150мл)', kk: 'Шаш сәндеуге арналған гель (150мл)', ko: '헤어 스타일링 젤 (150ml)' },
    brand: { en: 'Taft', ru: 'Taft', kk: 'Taft', ko: '타프트' },
    weight: { en: '150ml', ru: '150мл', kk: '150мл', ko: '150ml' },
    tags: { en: ['styling gel','hair gel','hair','care'], ru: ['гель для укладки','гель для волос','волосы','уход'], kk: ['сәндеу гелі','шаш гелі','шаш','күтім'], ko: ['스타일링 젤','헤어 젤','헤어','케어'] }
  },
  p415: {
    name: { en: 'Hair wax / pomade (100ml)', ru: 'Воск / помада для волос (100мл)', kk: 'Шашқа арналған балауыз / помада (100мл)', ko: '헤어 왁스 / 포마드 (100ml)' },
    brand: { en: 'Taft', ru: 'Taft', kk: 'Taft', ko: '타프트' },
    weight: { en: '100ml', ru: '100мл', kk: '100мл', ko: '100ml' },
    tags: { en: ['hair wax','pomade','hair','care'], ru: ['воск для волос','помада для волос','волосы','уход'], kk: ['шаш балауызы','помада','шаш','күтім'], ko: ['헤어 왁스','포마드','헤어','케어'] }
  },
  p416: {
    name: { en: 'Shaving foam (200ml)', ru: 'Пена для бритья (200мл)', kk: 'Қырынуға арналған көбік (200мл)', ko: '면도폼 (200ml)' },
    brand: { en: 'Gillette', ru: 'Gillette', kk: 'Gillette', ko: '질레트' },
    weight: { en: '200ml', ru: '200мл', kk: '200мл', ko: '200ml' },
    tags: { en: ['shaving foam','shave','gillette','care'], ru: ['пена для бритья','бритье','gillette','уход'], kk: ['қырыну көбігі','қырыну','gillette','күтім'], ko: ['면도폼','면도','질레트','케어'] }
  },
  p417: {
    name: { en: 'Razor blades pack', ru: 'Сменные кассеты для бритья', kk: 'Қырынуға арналған ауыстырмалы кассеталар', ko: '면도날 팩' },
    brand: { en: 'Gillette', ru: 'Gillette', kk: 'Gillette', ko: '질레트' },
    weight: { en: '4pcs', ru: '4 шт', kk: '4 дана', ko: '4개입' },
    tags: { en: ['razor','blades','shave','gillette','care'], ru: ['бритва','лезвия','бритье','gillette','уход'], kk: ['ұстара','жүздер','қырыну','gillette','күтім'], ko: ['면도기','면도날','면도','질레트','케어'] }
  },
  p801: {
    name: { en: 'Laundry detergent (2L)', ru: 'Жидкий стиральный порошок (2л)', kk: 'Сұйық кір жуғыш ұнтақ (2л)', ko: '세탁 세제 (2L)' },
    brand: { en: 'YokoSun', ru: 'ЙокоСан', kk: 'ЙокоСан', ko: '요코선' },
    weight: { en: '2000ml', ru: '2000мл', kk: '2000мл', ko: '2000ml' },
    tags: { en: ['laundry','detergent','cleaning','household'], ru: ['стирка','порошок','уборка','бытовая химия'], kk: ['кір жуу','жуғыш ұнтақ','тазалау','тұрмыстық химия'], ko: ['세탁','세제','청소','생활용품'] }
  },
  p802: {
    name: { en: 'Fabric softener (1L)', ru: 'Кондиционер для белья (1л)', kk: 'Киімге арналған кондиционер (1л)', ko: '섬유유연제 (1L)' },
    brand: { en: 'Forest Clean', ru: 'Форест Клин', kk: 'Форест Клин', ko: '포레스트 클린' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['fabric softener','laundry','household'], ru: ['кондиционер для белья','стирка','бытовая химия'], kk: ['мата жұмсартқыш','кір жуу','тұрмыстық химия'], ko: ['섬유유연제','세탁','생활용품'] }
  },
  p803: {
    name: { en: 'Dishwashing liquid (750ml)', ru: 'Средство для мытья посуды (750мл)', kk: 'Ыдыс жууға арналған сұйықтық (750мл)', ko: '주방세제 (750ml)' },
    brand: { en: 'Cif', ru: 'Сиф', kk: 'Сиф', ko: '시프' },
    weight: { en: '750ml', ru: '750мл', kk: '750мл', ko: '750ml' },
    tags: { en: ['dish soap','dishwashing','cleaning','household'], ru: ['средство для мытья посуды','мытье посуды','уборка','бытовая химия'], kk: ['ыдыс жуғыш','ыдыс жуу','тазалау','тұрмыстық химия'], ko: ['주방세제','설거지','청소','생활용품'] }
  },
  p804: {
    name: { en: 'Multi-surface cleaner spray (500ml)', ru: 'Универсальный чистящий спрей (500мл)', kk: 'Әмбебап тазартқыш спрей (500мл)', ko: '다목적 세정제 스프레이 (500ml)' },
    brand: { en: 'Dettol', ru: 'Деттол', kk: 'Деттол', ko: '데톨' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    tags: { en: ['cleaner','spray','multi-surface','household'], ru: ['чистящее средство','спрей','универсальное','бытовая химия'], kk: ['тазартқыш','спрей','әмбебап','тұрмыстық химия'], ko: ['세정제','스프레이','다목적','생활용품'] }
  },
  p805: {
    name: { en: 'Glass cleaner (500ml)', ru: 'Средство для мытья стекол (500мл)', kk: 'Шыны жууға арналған құрал (500мл)', ko: '유리 세정제 (500ml)' },
    brand: { en: 'Магия Чистоты', ru: 'Магия Чистоты', kk: 'Магия Чистоты', ko: '마기야 치스토티' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    tags: { en: ['glass cleaner','cleaning','spray','household'], ru: ['средство для стекол','уборка','спрей','бытовая химия'], kk: ['шыны тазартқыш','тазалау','спрей','тұрмыстық химия'], ko: ['유리세정제','청소','스프레이','생활용품'] }
  },
  p806: {
    name: { en: 'Floor cleaner liquid (1L)', ru: 'Средство для мытья полов (1л)', kk: 'Еден жууға арналған сұйықтық (1л)', ko: '바닥 세정제 (1L)' },
    brand: { en: 'Frosch', ru: 'Фрош', kk: 'Фрош', ko: '프로쉬' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['floor cleaner','cleaning','liquid','household'], ru: ['средство для полов','уборка','жидкость','бытовая химия'], kk: ['еден жуғыш','тазалау','сұйықтық','тұрмыстық химия'], ko: ['바닥세정제','청소','액체','생활용품'] }
  },
  p807: {
    name: { en: 'Bleach (1L)', ru: 'Отбеливатель (1л)', kk: 'Ағартқыш (1л)', ko: '표백제 (1L)' },
    brand: { en: 'Domestos', ru: 'Domestos', kk: 'Domestos', ko: '도местос' },
    weight: { en: '1000ml', ru: '1000мл', kk: '1000мл', ko: '1000ml' },
    tags: { en: ['bleach','disinfectant','cleaning','household'], ru: ['отбеливатель','дезинфицирующее средство','уборка','бытовая химия'], kk: ['ағартқыш','дезинфекциялаушы құрал','тазалау','тұрмыстық химия'], ko: ['표백제','소독제','청소','생활용품'] }
  },
  p808: {
    name: { en: 'Trash bags (30 pcs)', ru: 'Мешки для мусора (30 шт)', kk: 'Қоқыс қаптары (30 дана)', ko: '쓰레기 봉투 (30매)' },
    brand: { en: 'Zoro', ru: 'Zoro', kk: 'Zoro', ko: '조로' },
    weight: { en: '30pcs', ru: '30 шт', kk: '30 дана', ko: '30개입' },
    tags: { en: ['trash bags','garbage','bags','household'], ru: ['мешки для мусора','мусор','пакеты','бытовые товары'], kk: ['қоқыс қаптары','қоқыс','қаптар','тұрмыстық тауарлар'], ko: ['쓰레기봉투','쓰레기','봉투','생활용품'] }
  },
  p809: {
    name: { en: 'Aluminum foil (1 roll)', ru: 'Алюминиевая фольга (1 рулон)', kk: 'Алюминий фольгасы (1 орам)', ko: '알루미늄 호일 (1롤)' },
    brand: { en: 'Generic', ru: 'Generic', kk: 'Generic', ko: '제네릭' },
    weight: { en: '1roll', ru: '1 рулон', kk: '1 орам', ko: '1롤' },
    tags: { en: ['foil','aluminum','baking','kitchen','household'], ru: ['фольга','алюминий','выпечка','кухня','бытовые товары'], kk: ['фольга','алюминий','наубайхана','ас үй','тұрмыстық тауарлар'], ko: ['호일','알루미늄','베이킹','주방','생활용품'] }
  },
  p810: {
    name: { en: 'Plastic food wrap (1 roll)', ru: 'Пищевая пластиковая пленка (1 рулон)', kk: 'Тағамдық пластик үлдір (1 орам)', ko: '주방용 비닐랩 (1롤)' },
    brand: { en: 'Generic', ru: 'Generic', kk: 'Generic', ko: '제네릭' },
    weight: { en: '1roll', ru: '1 рулон', kk: '1 орам', ko: '1롤' },
    tags: { en: ['cling wrap','plastic wrap','kitchen','household'], ru: ['пищевая пленка','пластиковая пленка','кухня','бытовые товары'], kk: ['тағамдық үлдір','пластик үлдір','ас үй','тұрмыстық тауарлар'], ko: ['비닐랩','플라스틱랩','주방','생활용품'] }
  },
  p811: {
    name: { en: 'Sponges (5-pack)', ru: 'Губки для мытья посуды (5 шт)', kk: 'Ыдыс жууға арналған губкалар (5 дана)', ko: '수세미 (5개입)' },
    brand: { en: 'Generic', ru: 'Generic', kk: 'Generic', ko: '제네릭' },
    weight: { en: '5pcs', ru: '5 шт', kk: '5 дана', ko: '5개입' },
    tags: { en: ['sponges','cleaning','dishwashing','household'], ru: ['губки','уборка','мытье посуды','бытовые товары'], kk: ['губкалар','тазалау','ыдыс жуу','тұрмыстық тауарлар'], ko: ['수세미','청소','설거지','생활용품'] }
  },
  p812: {
    name: { en: 'Air freshener spray (300ml)', ru: 'Освежитель воздуха спрей (300мл)', kk: 'Ауа тазартқыш спрей (300мл)', ko: '에어프레셔너 스프레이 (300ml)' },
    brand: { en: 'Master FRESH', ru: 'Master FRESH', kk: 'Master FRESH', ko: '마스터 프레시' },
    weight: { en: '300ml', ru: '300мл', kk: '300мл', ko: '300ml' },
    tags: { en: ['air freshener','spray','household'], ru: ['освежитель воздуха','спрей','бытовые товары'], kk: ['ауа тазартқыш','спрей','тұрмыстық тауарлар'], ko: ['방향제','스프레이','생활용품'] }
  },
  p813: {
    name: { en: 'Rubber cleaning gloves (1 pair)', ru: 'Резиновые перчатки для уборки (1 пара)', kk: 'Тазалауға арналған резеңке қолғаптар (1 жұп)', ko: '청소용 고무장갑 (1켤레)' },
    brand: { en: 'Generic', ru: 'Generic', kk: 'Generic', ko: '제네릭' },
    weight: { en: '1pair', ru: '1 пара', kk: '1 жұп', ko: '1켤레' },
    tags: { en: ['gloves','cleaning gloves','rubber','household'], ru: ['перчатки','резиновые перчатки','уборка','бытовые товары'], kk: ['қолғаптар','резеңке қолғаптар','тазалау','тұрмыстық тауарлар'], ko: ['장갑','청소용 장갑','고무','생활용품'] }
  },
  // Beverages Translations
  p901: {
    name: { en: 'Coca-Cola 1.5L', ru: 'Кока-Кола 1.5л', kk: 'Кока-Кола 1.5л', ko: '코카콜라 1.5L' },
    brand: { en: 'Coca-Cola', ru: 'Кока-Кола', kk: 'Кока-Кола', ko: '코카콜라' },
    weight: { en: '1.5L', ru: '1.5л', kk: '1.5л', ko: '1.5L' },
    description: { en: 'Classic refreshing carbonated soft drink.', ru: 'Классический освежающий газированный напиток.', kk: 'Классикалық сергітетін газдалған сусын.', ko: '클래식하고 청량한 탄산 음료.' },
    tags: { en: ['coke','beverages','cola','soda','cold','sweet'], ru: ['кола','напитки','сода','холодный','сладкий'], kk: ['кола','сусындар','газдалған','салқын','тәтті'], ko: ['콜라','음료','탄산','시원한','단맛'] }
  },
  p902: {
    name: { en: 'Pepsi 1.5L', ru: 'Пепси 1.5л', kk: 'Пепси 1.5л', ko: '펩시 1.5L' },
    brand: { en: 'Pepsi', ru: 'Пепси', kk: 'Пепси', ko: '펩시' },
    weight: { en: '1.5L', ru: '1.5л', kk: '1.5л', ko: '1.5L' },
    description: { en: 'Deliciously refreshing carbonated cola beverage.', ru: 'Восхитительно освежающий газированный напиток пепси.', kk: 'Керемет сергітетін газдалған пепси сусыны.', ko: '맛있고 시원한 탄산 콜라 음료.' },
    tags: { en: ['pepsi','beverages','cola','soda','cold','sweet'], ru: ['пепси','напитки','сода','холодный','сладкий'], kk: ['пепси','сусындар','газдалған','салқын','тәтті'], ko: ['펩시','음료','탄산','시원한','단맛'] }
  },
  p903: {
    name: { en: 'Orange Juice 1L', ru: 'Апельсиновый сок 1л', kk: 'Апельсин шырыны 1л', ko: '오렌지 주스 1L' },
    brand: { en: 'Sady Pridonya', ru: 'Сады Придонья', kk: 'Сады Придонья', ko: '사디 프리도냐' },
    weight: { en: '1L', ru: '1л', kk: '1л', ko: '1L' },
    description: { en: '100% natural orange juice, rich in Vitamin C.', ru: '100% натуральный апельсиновый сок, богатый витамином C.', kk: '100% табиғи апельсин шырыны, С дәруменіне бай.', ko: '비타민 C가 풍부한 100% 천연 오렌지 주스.' },
    tags: { en: ['juice','orange juice','beverages','breakfast','cold','orange'], ru: ['сок','апельсиновый сок','напитки','завтрак','холодный'], kk: ['шырын','апельсин шырыны','сусындар','таңғы ас','салқын'], ko: ['주스','오렌지 주스','음료','아침 식사','시원한'] }
  },
  p904: {
    name: { en: 'Apple Juice 1L', ru: 'Яблочный сок 1л', kk: 'Алма шырыны 1л', ko: '사과 주스 1L' },
    brand: { en: 'Gracio', ru: 'Gracio', kk: 'Gracio', ko: '그라시오' },
    weight: { en: '1L', ru: '1л', kk: '1л', ko: '1L' },
    description: { en: 'Crisp and sweet 100% apple juice with no added sugar.', ru: 'Сладкий 100% яблочный сок без добавления сахара.', kk: 'Қант қосылмаған тәтті 100% алма шырыны.', ko: '설탕을 첨가하지 않은 상큼하고 달콤한 100% 사과 주스.' },
    tags: { en: ['juice','apple juice','beverages','breakfast','cold','apple'], ru: ['сок','яблочный сок','напитки','завтрак','яблоко'], kk: ['шырын','алма шырыны','сусындар','таңғы ас','алма'], ko: ['주스','사과 주스','음료','아침 식사','사과'] }
  },
  p905: {
    name: { en: 'Mineral Water 500ml', ru: 'Минеральная вода 500мл', kk: 'Минералды су 500мл', ko: '미네랄 워터 500ml' },
    brand: { en: 'Borjomi', ru: 'Боржоми', kk: 'Боржоми', ko: '보르조미' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    description: { en: 'Naturally carbonated mineral water from Georgia.', ru: 'Минеральная газированная вода из природных источников Грузии.', kk: 'Грузияның табиғи көздерінен алынған минералды газдалған су.', ko: '조지아산 천연 탄산 미네랄 워터.' },
    tags: { en: ['water','mineral water','beverages','sparkling','healthy'], ru: ['вода','минералка','напитки','газированная','здоровье'], kk: ['су','минералды су','сусындар','газдалған','пайдалы'], ko: ['물','미네랄 워터','음료','탄산수','건강식'] }
  },
  p906: {
    name: { en: 'Sparkling Water 1.5L', ru: 'Газированная вода 1.5л', kk: 'Газдалған су 1.5л', ko: '탄산수 1.5L' },
    brand: { en: 'Tassay', ru: 'Тассай', kk: 'Тассай', ko: '타싸이' },
    weight: { en: '1.5L', ru: '1.5л', kk: '1.5л', ko: '1.5L' },
    description: { en: 'Pure carbonated drinking water from Kazakhstan.', ru: 'Чистая газированная питьевая вода из Казахстана.', kk: 'Қазақстанның таза газдалған ауыз суы.', ko: '카자흐스탄산 순수 탄산 식수.' },
    tags: { en: ['water','sparkling','beverages','hydration'], ru: ['вода','газировка','напитки','питьевая вода'], kk: ['су','газдалған су','сусындар','ауыз су'], ko: ['물','탄산수','음료','수분보충'] }
  },
  p907: {
    name: { en: 'Green Tea 25 bags', ru: 'Зеленый чай 25 пакетиков', kk: 'Жасыл шай 25 пакеттік', ko: '녹차 25티백' },
    brand: { en: 'Piala Gold', ru: 'Пиала Голд', kk: 'Пиала Голд', ko: '피알라 골드' },
    weight: { en: '25pcs', ru: '25 шт', kk: '25 дана', ko: '25개입' },
    description: { en: 'Refreshing and rich green tea, perfect for health.', ru: 'Освежающий и насыщенный зеленый чай, полезный для здоровья.', kk: 'Денсаулыққа пайдалы, сергітетін және қанық жасыл шай.', ko: '건강에 좋고 상쾌하며 진한 녹차.' },
    tags: { en: ['green tea','tea','beverages','hot','healthy'], ru: ['чай','зеленый чай','напитки','горячий','здоровье'], kk: ['шай','жасыл шай','сусындар','ыстық','пайдалы'], ko: ['녹차','차','음료','따뜻한','건강식'] }
  },
  p908: {
    name: { en: 'Black Tea 25 bags', ru: 'Черный чай 25 пакетиков', kk: 'Қара шай 25 пакеттік', ko: '홍차 25티백' },
    brand: { en: 'Richard', ru: 'Ричард', kk: 'Ричард', ko: '리처드' },
    weight: { en: '25pcs', ru: '25 шт', kk: '25 дана', ko: '25개입' },
    description: { en: 'Classic English royal blend black tea bags.', ru: 'Классический английский черный чай королевского купажа.', kk: 'Классикалық ағылшын қара шайы корольдік қоспасы.', ko: '클래식한 영국 왕실 블렌드 홍차 티백.' },
    tags: { en: ['black tea','tea','beverages','hot','morning'], ru: ['чай','черный чай','напитки','горячий','завтрак'], kk: ['шай','қара шай','сусындар','ыстық','таңғы ас'], ko: ['홍차','차','음료','따뜻한','아침 식사'] }
  },
  p909: {
    name: { en: 'Coffee 190g', ru: 'Кофе 190г', kk: 'Кофе 190г', ko: '커피 190g' },
    brand: { en: 'Nescafe Gold', ru: 'Нескафе Голд', kk: 'Нескафе Голд', ko: '네스카페 골드' },
    weight: { en: '190g', ru: '190г', kk: '190г', ko: '190g' },
    description: { en: 'Premium freeze-dried soluble coffee for a rich taste.', ru: 'Растворимый сублимированный coffee премиум-класса.', kk: 'Премиум класты сублимацияланған еритін кофе.', ko: '풍부한 맛을 선사하는 프리미엄 동결건조 인스턴트 커피.' },
    tags: { en: ['coffee','beverages','instant','morning','caffeine'], ru: ['кофе','растворимый кофе','напитки','утро','кофеин'], kk: ['кофе','еритін кофе','сусындар','таңертең','кофеин'], ko: ['커피','음료','인스턴트','아침','카페인'] }
  },
  p910: {
    name: { en: 'Energy Drink 250ml', ru: 'Энергетический напиток 250мл', kk: 'Энергетикалық сусын 250мл', ko: '에너지 드링크 250ml' },
    brand: { en: 'Red Bull', ru: 'Ред Булл', kk: 'Ред Булл', ko: '레드불' },
    weight: { en: '250ml', ru: '250мл', kk: '250мл', ko: '250ml' },
    description: { en: 'Vitalizes body and mind, perfect for active days.', ru: 'Бодрит тело и дух, идеально для активных дней.', kk: 'Дене мен рухты сергітеді, белсенді күндерге өте ыңғайлы.', ko: '몸과 마음에 활력을 불어넣어 주는 에너지 드링크.' },
    tags: { en: ['energy','red bull','beverages','energy drink','caffeine'], ru: ['энергетик','ред булл','напитки','кофеин'], kk: ['энергетик','ред булл','сусындар','кофеин'], ko: ['에너지','레드불','음료','에너지 드링크','카페인'] }
  },
  p911: {
    name: { en: 'Lemonade 500ml', ru: 'Лимонад 500мл', kk: 'Лимонад 500мл', ko: '레모네이드 500ml' },
    brand: { en: 'Natakhtari', ru: 'Натахтари', kk: 'Натахтари', ko: '나타흐타리' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    description: { en: 'Traditional Georgian flavored carbonated soft drink.', ru: 'Традиционный грузинский газированный прохладительный напиток.', kk: 'Дәстүрлі грузин газдалған сергіткіш сусыны.', ko: '전통 조지아 스타일 탄산 소프트 드링크.' },
    tags: { en: ['lemonade','soda','beverages','sweet','natakhtari'], ru: ['лимонад','газировка','напитки','сладкий','натахтари'], kk: ['лимонад','газдалған су','сусындар','тәтті','натахтари'], ko: ['레모네이드','탄산음료','음료','단맛','나타흐타리'] }
  },
  p912: {
    name: { en: 'Iced Tea 500ml', ru: 'Холодный чай 500мл', kk: 'Мұздай шай 500мл', ko: '아이스티 500ml' },
    brand: { en: 'Lipton', ru: 'Липтон', kk: 'Липтон', ko: '립톤' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    description: { en: 'Cool iced tea with refreshing fruit flavor.', ru: 'Освежающий холодный чай с приятным фруктовым вкусом.', kk: 'Сергітетін жеміс дәмі бар салқын шай.', ko: '상큼한 과일 향의 시원한 아이스티.' },
    tags: { en: ['iced tea','lipton','tea','beverages','cold','sweet'], ru: ['холодный чай','липтон','чай','напитки','холодный'], kk: ['салқын шай','липтон','шай','сусындар','салқын'], ko: ['아이스티','립톤','차','음료','시원한','단맛'] }
  },
  p913: {
    name: { en: 'Mango Juice 1L', ru: 'Манговый сок 1л', kk: 'Манго шырыны 1л', ko: '망고 주스 1L' },
    brand: { en: 'Gracio', ru: 'Gracio', kk: 'Gracio', ko: '그라시오' },
    weight: { en: '1L', ru: '1л', kk: '1л', ko: '1L' },
    description: { en: 'Rich and exotic mango nectar juice.', ru: 'Густой и экзотический нектар из спелого манго.', kk: 'Піскен мангодан жасалған қою және экзотикалық нектар.', ko: '진하고 이국적인 망고 넥타 주스.' },
    tags: { en: ['juice','mango','beverages','exotic','sweet'], ru: ['сок','манго','напитки','экзотика','сладкий'], kk: ['шырын','манго','сусындар','экзотика','тәтті'], ko: ['주스','망고','음료','이국적인','단맛'] }
  },
  p914: {
    name: { en: 'Grape Juice 1L', ru: 'Виноградный сок 1л', kk: 'Жүзім шырыны 1л', ko: '포도 주스 1L' },
    brand: { en: 'Sady Pridonya', ru: 'Сады Придонья', kk: 'Сады Придонья', ko: '사디 프리도냐' },
    weight: { en: '1L', ru: '1л', kk: '1л', ko: '1L' },
    description: { en: 'Delicious 100% red grape juice, rich in antioxidants.', ru: 'Вкусный 100% сок из красного винограда, богатый антиоксидантами.', kk: 'Антиоксиданттарға бай, қызыл жүзімнен жасалған дәмді 100% шырын.', ko: '항산화 성분이 풍부하고 맛있는 100% 적포도 주스.' },
    tags: { en: ['juice','grape juice','beverages','red grape','sweet'], ru: ['сок','виноградный сок','напитки','виноград','сладкий'], kk: ['шырын','жүзім шырыны','сусындар','жүзім','тәтті'], ko: ['주스','포도 주스','음료','적포도','단맛'] }
  },
  p915: {
    name: { en: 'Protein Drink 330ml', ru: 'Протеиновый напиток 330мл', kk: 'Протеинді сусын 330мл', ko: '단백질 음료 330ml' },
    brand: { en: 'Optimum Nutrition', ru: 'Optimum Nutrition', kk: 'Optimum Nutrition', ko: '옵티멈 뉴트리션' },
    weight: { en: '330ml', ru: '330мл', kk: '330мл', ko: '330ml' },
    description: { en: 'High-protein ready-to-drink shake, chocolate flavor.', ru: 'Готовый протеиновый коктейль с насыщенным шоколадным вкусом.', kk: 'Шоколад дәмі бар дайын протеинді коктейль.', ko: '초콜릿 맛의 고단백 RTD 쉐이크.' },
    tags: { en: ['protein','shake','fitness','beverages','chocolate','supplement'], ru: ['протеин','коктейль','фитнес','напитки','шоколад'], kk: ['протеин','коктейль','фитнес','сусындар','шоколад'], ko: ['단백질','쉐이크','피트니스','음료','초콜릿','보충제'] }
  },
  p916: {
    name: { en: 'Milkshake 950g', ru: 'Молочный коктейль 950г', kk: 'Сүт коктейлі 950г', ko: '밀크셰이크 950g' },
    brand: { en: 'Chudo', ru: 'Чудо', kk: 'Чудо', ko: '추도' },
    weight: { en: '950g', ru: '950г', kk: '950г', ko: '950g' },
    description: { en: 'Sweet and creamy strawberry milkshake.', ru: 'Сладкий и нежный клубничный молочный коктейль.', kk: 'Тәтті және нәзік құлпынай сүт коктейлі.', ko: '달콤하고 부드러운 딸기 밀크셰이크.' },
    tags: { en: ['milkshake','dairy','beverages','sweet','strawberry'], ru: ['молочный коктейль','молочка','напитки','сладкий','клубника'], kk: ['сүт коктейлі','сүт өнімдері','сусындар','тәтті','құлпынай'], ko: ['밀크셰이크','유제품','음료','단맛','딸기'] }
  },
  p917: {
    name: { en: 'Coconut Water 330ml', ru: 'Кокосовая вода 330мл', kk: 'Кокос суы 330мл', ko: '코코넛 워터 330ml' },
    brand: { en: 'Foco', ru: 'Foco', kk: 'Foco', ko: '포코' },
    weight: { en: '330ml', ru: '330мл', kk: '330мл', ko: '330ml' },
    description: { en: 'Pure, natural hydrating coconut water from Thailand.', ru: 'Чистая, натуральная кокосовая вода из Таиланда для гидратации.', kk: 'Ылғалдандыруға арналған Таиландтан әкелінген таза, табиғи кокос суы.', ko: '수분 보충에 좋은 태국산 순수 천연 코코넛 워터.' },
    tags: { en: ['coconut','water','beverages','hydration','healthy'], ru: ['кокос','кокосовая вода','напитки','гидратация','здоровье'], kk: ['кокос','кокос суы','сусындар','ылғалдандыру','пайдалы'], ko: ['코코넛','물','음료','수분보충','건강식'] }
  },
  p918: {
    name: { en: 'Soda Water 1L', ru: 'Газированная вода 1л', kk: 'Газдалған сусын 1л', ko: '탄산수 1L' },
    brand: { en: 'Schweppes', ru: 'Швепс', kk: 'Швепс', ko: '슈웹스' },
    weight: { en: '1L', ru: '1л', kk: '1л', ko: '1L' },
    description: { en: 'Crisp soda water, ideal for refreshing mixers.', ru: 'Чистая содовая вода, идеальная для коктейлей и освежающих напитков.', kk: 'Коктейльдер мен сергітетін сусындарға өте ыңғайлы таза сода суы.', ko: '상쾌한 믹서로 이상적인 톡 쏘는 탄산수.' },
    tags: { en: ['soda','water','mixer','beverages','sparkling','tonic'], ru: ['содовая','вода','миксер','напитки','газировка'], kk: ['сода суы','су','миксер','сусындар','газдалған'], ko: ['탄산수','물','믹서','음료','스파클링','토닉'] }
  },
  p919: {
    name: { en: 'Hot Chocolate 10 bags', ru: 'Горячий шоколад 10 пакетиков', kk: 'Ыстық шоколад 10 пакеттік', ko: '핫초코 10개입' },
    brand: { en: 'MacChocolate', ru: 'МакШоколад', kk: 'МакШоколад', ko: '맥초콜릿' },
    weight: { en: '10pcs', ru: '10 шт', kk: '10 дана', ko: '10개입' },
    description: { en: 'Instant hot chocolate powder packets, rich cocoa taste.', ru: 'Растворимый горячий шоколад в пакетиках с насыщенным вкусом какао.', kk: 'Қанық какао дәмі бар пакеттердегі дайын ыстық шоколад.', ko: '진한 코코아 맛의 인스턴트 핫초코 가루 패킷.' },
    tags: { en: ['chocolate','cocoa','hot chocolate','sweet','hot','beverages'], ru: ['шоколад','какао','горячий шоколад','сладкий','горячий'], kk: ['шоколад','какао','ыстық шоколад','тәтті','ыстық'], ko: ['초콜릿','코코아','핫초코','단맛','따뜻한','음료'] }
  },
  p920: {
    name: { en: 'Sports Drink 500ml', ru: 'Спортивный напиток 500мл', kk: 'Спорттық сусын 500мл', ko: '이온 음료 500ml' },
    brand: { en: 'Gatorade', ru: 'Gatorade', kk: 'Gatorade', ko: '게토레이' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    description: { en: 'Electrolyte sport drink for quick rehydration.', ru: 'Спортивный напиток с электролитами для быстрого восстановления сил.', kk: 'Күшті тез қалпына келтіруге арналған электролиттері бар спорттық сусын.', ko: '빠른 수분 보충을 위한 전해질 스포츠 음료.' },
    tags: { en: ['sports drink','gatorade','beverages','hydration','fitness'], ru: ['изотоник','спортивный напиток','напитки','гидратация'], kk: ['изотоник','спорттық сусын','сусындар','ылғалдандыру'], ko: ['이온 음료','게토레이','음료','수분보충','피트니스'] }
  },
  // Fruits Translations
  p921: {
    name: { en: 'Apples 1kg', ru: 'Яблоки 1кг', kk: 'Алма 1кг', ko: '사과 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Fresh, sweet, and crispy red apples.', ru: 'Свежие, сладкие и хрустящие красные яблоки.', kk: 'Балғын, тәтті және қытырлақ қызыл алмалар.', ko: '신선하고 달콤하며 아삭아삭한 빨간 사과.' },
    tags: { en: ['apples','fruits','healthy','fresh','local'], ru: ['яблоки','фрукты','здоровье','свежий','местный'], kk: ['алма','жемістер','пайдалы','балғын','жергілікті'], ko: ['사과','과일','건강식','신선한','국산'] }
  },
  p922: {
    name: { en: 'Bananas 1kg', ru: 'Бананы 1кг', kk: 'Банандар 1кг', ko: '바나나 1kg' },
    brand: { en: 'Ecuador', ru: 'Эквадор', kk: 'Эквадор', ko: '에콰도르' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Fresh ripe yellow bananas imported from Ecuador.', ru: 'Свежие спелые желтые бананы, импортированные из Эквадора.', kk: 'Эквадордан әкелінген балғын піскен сары банандар.', ko: '에콰도르에서 수입한 신선하고 잘 익은 노란 바나나.' },
    tags: { en: ['bananas','fruits','fresh','healthy','potassium'], ru: ['бананы','фрукты','свежий','здоровье','калий'], kk: ['банандар','жемістер','балғын','пайдалы','калий'], ko: ['바나나','과일','신선한','건강식','칼륨'] }
  },
  p923: {
    name: { en: 'Oranges 1kg', ru: 'Апельсины 1кг', kk: 'Апельсиндер 1кг', ko: '오렌지 1kg' },
    brand: { en: 'Egypt', ru: 'Египет', kk: 'Мысыр', ko: '이집트' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Sweet and juicy fresh oranges, perfect for juice.', ru: 'Сладкие и сочные свежие апельсины, идеально для сока.', kk: 'Шырынға өте ыңғайлы тәтті және шырынды балғын апельсиндер.', ko: '주스로 마시기 좋은 달콤하고 즙이 많은 신선한 오렌지.' },
    tags: { en: ['oranges','fruits','healthy','fresh','citrus','vitamin c'], ru: ['апельсины','фрукты','здоровье','свежий','цитрус'], kk: ['апельсиндер','жемістер','пайдалы','балғын','цитрус'], ko: ['오렌지','과일','건강식','신선한','감귤류','비타민 C'] }
  },
  p924: {
    name: { en: 'Grapes 1kg', ru: 'Виноград 1кг', kk: 'Жүзім 1кг', ko: '포도 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Fresh seedless table grapes, sweet and delicious.', ru: 'Свежий столовый виноград без косточек, сладкий и вкусный.', kk: 'Тұқымы жоқ, тәтті және дәмді балғын жүзім.', ko: '신선하고 씨 없는 달콤하고 맛있는 테이블 포도.' },
    tags: { en: ['grapes','fruits','sweet','fresh','healthy'], ru: ['виноград','фрукты','сладкий','свежий','здоровье'], kk: ['жүзім','жемістер','тәтті','балғын','пайдалы'], ko: ['포도','과일','단맛','신선한','건강식'] }
  },
  p925: {
    name: { en: 'Strawberries 250g', ru: 'Клубника 250г', kk: 'Құлпынай 250г', ko: '딸기 250g' },
    brand: { en: 'Greenhouse', ru: 'Тепличная', kk: 'Жылыжайлық', ko: '온실 재배' },
    weight: { en: '250g', ru: '250г', kk: '250г', ko: '250g' },
    description: { en: 'Sweet, juicy, and fragrant fresh greenhouse strawberries.', ru: 'Сладкая, сочная и ароматная свежая тепличная клубника.', kk: 'Тәтті, шырынды және хош иісті балғын жылыжай құлпынайы.', ko: '달콤하고 즙이 많으며 향긋한 온실 재배 신선한 딸기.' },
    tags: { en: ['strawberries','berries','fruits','fresh','dessert','sweet'], ru: ['клубника','ягоды','фрукты','свежий','десерт'], kk: ['құлпынай','жидектер','жемістер','балғын','десерт'], ko: ['딸기','베리','과일','신선한','디저트','단맛'] }
  },
  p926: {
    name: { en: 'Lemons 500g', ru: 'Лимоны 500г', kk: 'Лимондар 500г', ko: '레몬 500g' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    description: { en: 'Zesty fresh lemons, rich in Vitamin C.', ru: 'Ароматные свежие лимоны, богатые витамином C.', kk: 'С дәруменіне бай, хош иісті балғын лимондар.', ko: '비타민 C가 풍부하고 상큼한 신선한 레몬.' },
    tags: { en: ['lemons','fruits','sour','fresh','citrus','healthy'], ru: ['лимоны','фрукты','кислый','свежий','цитрус'], kk: ['лимондар','жемістер','қышқыл','балғын','цитрус'], ko: ['레몬','과일','신맛','신선한','감귤류','건강식'] }
  },
  p927: {
    name: { en: 'Watermelon 1kg', ru: 'Арбуз 1кг', kk: 'Қарбыз 1кг', ko: '수박 1kg' },
    brand: { en: 'Southern', ru: 'Южный', kk: 'Оңтүстік', ko: '남부 지방' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Extremely sweet and refreshing southern watermelon.', ru: 'Очень сладкий и освежающий южный арбуз.', kk: 'Өте тәтті және сергітетін оңтүстік қарбызы.', ko: '당도가 매우 높고 시원한 남부 지방 수박.' },
    tags: { en: ['watermelon','fruits','fresh','summer','healthy','hydration'], ru: ['арбуз','фрукты','свежий','лето','здоровье','гидратация'], kk: ['қарбыз','жемістер','балғын','жаз','пайдалы','ылғалдандыру'], ko: ['수박','과일','신선한','여름','건강식','수분보충'] }
  },
  p928: {
    name: { en: 'Pineapple 1pc', ru: 'Ананас 1шт', kk: 'Ананас 1дана', ko: '파인애플 1개' },
    brand: { en: 'Costa Rica', ru: 'Коста-Рика', kk: 'Коста-Рика', ko: '코스타리카' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    description: { en: 'Sweet and tangy tropical fresh pineapple.', ru: 'Сладкий и сочный тропический свежий ананас.', kk: 'Тәтті және шырынды тропикалық балғын ананас.', ko: '달콤하고 새콤한 열대 신선한 파인애플.' },
    tags: { en: ['pineapple','fruits','fresh','tropical','sweet'], ru: ['ананас','фрукты','свежий','тропический','сладкий'], kk: ['ананас','жемістер','балғын','тропикалық','тәтті'], ko: ['파인애플','과일','신선한','열대과일','단맛'] }
  },
  p929: {
    name: { en: 'Mango 1pc', ru: 'Манго 1шт', kk: 'Манго 1дана', ko: '망고 1개' },
    brand: { en: 'Thailand', ru: 'Таиланд', kk: 'Таиланд', ko: '태국' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    description: { en: 'Ripe, soft, and sweet Thai honey mango.', ru: 'Спелое, мягкое и сладкое тайское медовое манго.', kk: 'Піскен, жұмсақ және тәтті тай бал мангосы.', ko: '잘 익고 부드러우며 달콤한 태국산 허니 망고.' },
    tags: { en: ['mango','fruits','tropical','sweet','fresh','imported'], ru: ['манго','фрукты','тропики','сладкий','свежий','импорт'], kk: ['манго','жемістер','тропикалық','тәтті','балғын','импорт'], ko: ['망고','과일','열대과일','단맛','신선한','수입산'] }
  },
  p930: {
    name: { en: 'Pears 1kg', ru: 'Груши 1кг', kk: 'Алмұрт 1кг', ko: '배 1kg' },
    brand: { en: 'Conference', ru: 'Конференция', kk: 'Конференция', ko: '컨퍼런스' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Sweet, aromatic, and juicy Conference pears.', ru: 'Сладкие, ароматные и сочные груши сорта Конференция.', kk: 'Конференция сортының тәтті, хош иісті және шырынды алмұрттары.', ko: '달콤하고 향긋하며 즙이 많은 컨퍼런스 배.' },
    tags: { en: ['pears','fruits','healthy','fresh','sweet'], ru: ['груши','фрукты','здоровье','свежий','сладкий'], kk: ['алмұрт','жемістер','пайдалы','балғын','тәтті'], ko: ['배','과일','건강식','신선한','단맛'] }
  },
  p931: {
    name: { en: 'Kiwi 1kg', ru: 'Киви 1кг', kk: 'Киви 1кг', ko: '키위 1kg' },
    brand: { en: 'Iran', ru: 'Иран', kk: 'Иран', ko: '이란' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Tart and sweet green kiwi fruits, rich in Vitamin C.', ru: 'Кисло-сладкие зеленые киви, богатые витамином C.', kk: 'С дәруменіне бай, қышқыл-тәтті жасыл киви.', ko: '새콤달콤하고 비타민 C가 풍부한 초록색 키위.' },
    tags: { en: ['kiwi','fruits','healthy','fresh','sour'], ru: ['киви','фрукты','здоровье','свежий','кислый'], kk: ['киви','жемістер','пайдалы','балғын','қышқыл'], ko: ['키위','과일','건강식','신선한','신맛'] }
  },
  p932: {
    name: { en: 'Blueberries 125g', ru: 'Голубика 125г', kk: 'Көкжидек 125г', ko: '블루베리 125g' },
    brand: { en: 'Imported', ru: 'Импортная', kk: 'Импорттық', ko: '수입산' },
    weight: { en: '125g', ru: '125г', kk: '125г', ko: '125g' },
    description: { en: 'Premium fresh blueberries, sweet and healthy.', ru: 'Свежая голубика премиум-класса, сладкая и полезная.', kk: 'Премиум класты балғын көкжидек, тәтті әрі пайдалы.', ko: '달콤하고 건강에 좋은 프리미엄 신선한 블루베리.' },
    tags: { en: ['blueberries','berries','fruits','fresh','healthy','superfood'], ru: ['голубика','ягоды','фрукты','свежий','здоровье'], kk: ['көкжидек','жидектер','жемістер','балғын','пайдалы'], ko: ['블루베리','베리','과일','신선한','건강식','슈퍼푸드'] }
  },
  p933: {
    name: { en: 'Peaches 1kg', ru: 'Персики 1кг', kk: 'Шалқандар 1кг', ko: '복숭아 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Sweet, soft, and juicy local fresh peaches.', ru: 'Сладкие, мягкие и сочные местные персики.', kk: 'Тәтті, жұмсақ және шырынды жергілікті шалқандар.', ko: '달콤하고 부드러우며 즙이 많은 국산 신선한 복숭아.' },
    tags: { en: ['peaches','fruits','fresh','sweet','summer'], ru: ['персики','фрукты','свежий','сладкий','лето'], kk: ['шалқандар','жемістер','балғын','тәтті','жаз'], ko: ['복숭아','과일','신선한','단맛','여름'] }
  },
  p934: {
    name: { en: 'Plums 1kg', ru: 'Сливы 1кг', kk: 'Қара өрік 1кг', ko: '자두 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Sweet and slightly sour dark blue plums.', ru: 'Сладкие и с кислинкой темно-синие сливы.', kk: 'Тәтті және қышқылтым қою көк қара өрік.', ko: '달콤하고 약간 새콤한 진청색 자두.' },
    tags: { en: ['plums','fruits','fresh','sweet','local'], ru: ['сливы','фрукты','свежий','сладкий','местный'], kk: ['кара өрік','жемістер','балғын','тәтті','жергілікті'], ko: ['자두','과일','신선한','단맛','국산'] }
  },
  p935: {
    name: { en: 'Cherries 1kg', ru: 'Черешня 1кг', kk: 'Шие 1кг', ko: '체리 1kg' },
    brand: { en: 'Local', ru: 'Местная', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Ripe, dark-red sweet cherries, locally harvested.', ru: 'Спелая, темно-красная сладкая черешня местного урожая.', kk: 'Жергілікті өнімнің піскен, қою қызыл тәтті шиесі.', ko: '지역에서 수확한 잘 익고 짙은 붉은색의 달콤한 체리.' },
    tags: { en: ['cherries','fruits','sweet','fresh','summer'], ru: ['черешня','фрукты','сладкий','свежий','лето'], kk: ['шие','жемістер','тәтті','балғын','жаз'], ko: ['체리','과일','단맛','신선한','여름'] }
  },
  p936: {
    name: { en: 'Avocados 2pcs', ru: 'Авокадо 2шт', kk: 'Авокадо 2дана', ko: '아보카도 2개' },
    brand: { en: 'Hass', ru: 'Хасс', kk: 'Хасс', ko: '하스' },
    weight: { en: '2pcs', ru: '2 шт', kk: '2 дана', ko: '2개' },
    description: { en: 'Creamy, ripe Hass avocados, rich in healthy fats.', ru: 'Нежные спелые авокадо сорта Хасс, богатые полезными жирами.', kk: 'Пайдалы майларға бай Хасс сортының нәзік піскен авокадолары.', ko: '건강에 좋은 지방이 풍부하고 부드러운 하스 아보카도.' },
    tags: { en: ['avocado','fruits','healthy','fresh','fats','salad'], ru: ['авокадо','фрукты','здоровье','свежий','салат'], kk: ['авокадо','жемістер','пайдалы','балғын','салат'], ko: ['아보카도','과일','건강식','신선한','지방','샐러드'] }
  },
  p937: {
    name: { en: 'Pomegranate 1kg', ru: 'Гранат 1кг', kk: 'Анар 1кг', ko: '석류 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Ripe red pomegranate with juicy and sweet seeds.', ru: 'Спелый красный гранат с сочными и сладкими зернами.', kk: 'Шырынды және тәтті дәндері бар піскен қызыл анар.', ko: '즙이 많고 달콤한 씨앗이 가득 찬 잘 익은 붉은 석류.' },
    tags: { en: ['pomegranate','fruits','red','sweet','fresh'], ru: ['гранат','фрукты','красный','сладкий','свежий'], kk: ['анар','жемістер','қызыл','тәтті','балғын'], ko: ['석류','과일','붉은색','단맛','신선한'] }
  },
  p938: {
    name: { en: 'Papaya 1pc', ru: 'Папайя 1шт', kk: 'Папайя 1дана', ko: '파파야 1개' },
    brand: { en: 'Imported', ru: 'Импортная', kk: 'Импорттық', ko: '수입산' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    description: { en: 'Sweet, soft, and tropical orange papaya.', ru: 'Сладкая, мягкая тропическая оранжевая папайя.', kk: 'Тәтті, жұмсақ тропикалық қызғылт сары папайя.', ko: '달콤하고 부드러운 오렌지색 열대 파파야.' },
    tags: { en: ['papaya','fruits','tropical','sweet','fresh','imported'], ru: ['папайя','фрукты','тропики','сладкий','свежий'], kk: ['папайя','жемістер','тропикалық','тәтті','балғын'], ko: ['파파야','과일','열대과일','단맛','신선한','수입산'] }
  },
  p939: {
    name: { en: 'Dragon Fruit 1pc', ru: 'Драконий фрукт 1шт', kk: 'Айдаһар жемісі 1дана', ko: '용과 1개' },
    brand: { en: 'Vietnam', ru: 'Вьетнам', kk: 'Вьетнам', ko: '베트남' },
    weight: { en: '1pc', ru: '1 шт', kk: '1 дана', ko: '1개' },
    description: { en: 'Fresh red pitahaya (dragon fruit) with white flesh.', ru: 'Свежая красная питахайя (драконий фрукт) с белой мякотью.', kk: 'Ақ еті бар балғын қызыл питахайя (айдаһар жемісі).', ko: '하얀 과육의 신선한 붉은 피타하야 (용과).' },
    tags: { en: ['dragon fruit','fruits','tropical','fresh','imported'], ru: ['питайя','драконий фрукт','тропики','свежий','импорт'], kk: ['питахайя','айдаһар жемісі','тропикалық','балғын','импорт'], ko: ['용과','과일','열대과일','신선한','수입산'] }
  },
  p940: {
    name: { en: 'Tangerines 1kg', ru: 'Мандарины 1кг', kk: 'Мандариндер 1кг', ko: '귤 1kg' },
    brand: { en: 'Local', ru: 'Местный', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Sweet, juicy, and easy-to-peel tangerines.', ru: 'Сладкие, сочные и легко очищаемые мандарины.', kk: 'Тәтті, шырынды және оңай аршылатын мандариндер.', ko: '달콤하고 즙이 많으며 껍질을 벗기기 쉬운 귤.' },
    tags: { en: ['tangerines','fruits','fresh','citrus','sweet'], ru: ['мандарины','фрукты','свежий','цитрус','сладкий'], kk: ['мандариндер','жемістер','балғын','цитрус','тәтті'], ko: ['귤','과일','신선한','감귤류','단맛'] }
  },
  // Frozen Foods Translations
  p941: {
    name: { en: 'Frozen Pizza', ru: 'Замороженная пицца', kk: 'Мұздатылған пицца', ko: '냉동 피자' },
    brand: { en: 'Ristorante', ru: 'Ристоранте', kk: 'Ристоранте', ko: '리스토란테' },
    weight: { en: '340g', ru: '340г', kk: '340г', ko: '340g' },
    description: { en: 'Delicious thin-crust mozzarella & tomato pizza.', ru: 'Вкусная пицца на тонком тесте с моцареллой и томатами.', kk: 'Моцарелла және томат қосылған жұқа қамырдағы дәмді пицца.', ko: '얇은 도우에 모짜렐라와 토마토를 올린 맛있는 피자.' },
    tags: { en: ['pizza','frozen','convenience','dinner','mozzarella'], ru: ['пицца','заморозка','полуфабрикат','ужин','моцарелла'], kk: ['пицца','мұздатылған','жартылай дайын','кешкі ас','моцарелла'], ko: ['피자','냉동','편의식','저녁 식사','모짜렐라'] }
  },
  p942: {
    name: { en: 'Frozen Fries', ru: 'Замороженный картофель фри', kk: 'Мұздатылған картоп фри', ko: '냉동 감자튀김' },
    brand: { en: 'Farm Frites', ru: 'Фарм Фрайтс', kk: 'Фарм Фрайтс', ko: '팜 프라이츠' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Golden, crispy French fries for oven or deep fry.', ru: 'Золотистый, хрустящий картофель фри для духовки или фритюра.', kk: 'Пешке немесе фритюрге арналған алтын түстес, қытырлақ картоп фри.', ko: '오븐이나 튀김기에 조리하는 바삭한 황금빛 감자튀김.' },
    tags: { en: ['fries','potato','frozen','snack','side dish'], ru: ['картошка фри','картофель','заморозка','закуска'], kk: ['картоп фри','картоп','мұздатылған','жеңіл тағам'], ko: ['감자튀김','감자','냉동','스낵','사이드디시'] }
  },
  p943: {
    name: { en: 'Ice Cream', ru: 'Мороженое', kk: 'Балмұздақ', ko: '아이스크림' },
    brand: { en: 'Baskin Robbins', ru: 'Баскин Роббинс', kk: 'Баскин Роббинс', ko: '배스킨 라빈스' },
    weight: { en: '500ml', ru: '500мл', kk: '500мл', ko: '500ml' },
    description: { en: 'Rich and creamy vanilla bean ice cream tub.', ru: 'Насыщенное и кремовое ванильное мороженое в ведерке.', kk: 'Шелектегі қанық және кремді ванильді балмұздақ.', ko: '진하고 부드러운 바닐라 빈 아이스크림 통.' },
    tags: { en: ['ice cream','frozen','sweet','dessert','vanilla'], ru: ['мороженое','заморозка','сладкое','десерт','ваниль'], kk: ['балмұздақ','мұздатылған','тәтті','десерт','ваниль'], ko: ['아이스크림','냉동','단맛','디저트','바닐라'] }
  },
  p944: {
    name: { en: 'Frozen Vegetables', ru: 'Замороженные овощи', kk: 'Мұздатылған көкөністер', ko: '냉동 채소믹스' },
    brand: { en: 'Hortex', ru: 'Хортекс', kk: 'Хортекс', ko: '호텍스' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    description: { en: 'Healthy mixed frozen vegetables (peas, corn, carrots).', ru: 'Полезная смесь замороженных овощей (горошек, кукуруза, морковь).', kk: 'Мұздатылған пайдалы көкөністер қоспасы (бұршақ, жүгері, сәбіз).', ko: '건강에 좋은 냉동 채소 믹스 (완두콩, 옥수수, 당근).' },
    tags: { en: ['vegetables','mix','frozen','healthy','side dish'], ru: ['овощи','смесь','заморозка','здоровье'], kk: ['көкөністер','қоспа','мұздатылған','пайдалы'], ko: ['채소','믹스','냉동','건강식','사이드디시'] }
  },
  p945: {
    name: { en: 'Frozen Berries', ru: 'Замороженные ягоды', kk: 'Мұздатылған жидектер', ko: '냉동 베리믹스' },
    brand: { en: 'Hortex', ru: 'Хортекс', kk: 'Хортекс', ko: '호텍스' },
    weight: { en: '300g', ru: '300г', kk: '300г', ko: '300g' },
    description: { en: 'Frozen mixed berries (strawberries, raspberries, blueberries).', ru: 'Смесь быстрозамороженных ягод (клубника, малина, черника).', kk: 'Жылдам мұздатылған жидектер қоспасы (құлпынай, таңқурай, қаражидек).', ko: '급속 냉동한 베리 믹스 (딸기, 라즈베리, 블루베리).' },
    tags: { en: ['berries','frozen','mix','sweet','healthy','dessert'], ru: ['ягоды','заморозка','смесь','сладкое','здоровье'], kk: ['жидектер','мұздатылған','қоспа','тәтті','пайдалы'], ko: ['베리','냉동','믹스','단맛','건강식','디저트'] }
  },
  p946: {
    name: { en: 'Chicken Nuggets', ru: 'Куриные наггетсы', kk: 'Тауық наггетстері', ko: '치킨 너겟' },
    brand: { en: 'Sadia', ru: 'Садия', kk: 'Садия', ko: '사디아' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    description: { en: 'Crispy breaded chicken breast nuggets.', ru: 'Хрустящие наггетсы из куриной грудки в панировке.', kk: 'Аунатылған тауық төс етінен жасалған қытырлақ наггетстер.', ko: '바삭한 빵가루를 입힌 닭가슴살 너겟.' },
    tags: { en: ['chicken','nuggets','frozen','snack','dinner'], ru: ['курица','наггетсы','заморозка','закуска','ужин'], kk: ['тауық','наггетстер','мұздатылған','жеңіл тағам','кешкі ас'], ko: ['치킨','너겟','냉동','스낵','저녁 식사'] }
  },
  p947: {
    name: { en: 'Frozen Dumplings', ru: 'Пельмени замороженные', kk: 'Мұздатылған тұспара', ko: '냉동 만두' },
    brand: { en: 'Siberian', ru: 'Сибирские', kk: 'Сибирские', ko: '시베리안' },
    weight: { en: '800g', ru: '800г', kk: '800г', ko: '800g' },
    description: { en: 'Traditional Siberian style beef pelmeni (dumplings).', ru: 'Традиционные сибирские пельмени из говядины.', kk: 'Дәстүрлі сиыр етінен жасалған сібір тұспарасы.', ko: '전통 시베리아 스타일 소고기 만두.' },
    tags: { en: ['pelmeni','dumplings','frozen','russian','beef'], ru: ['пельмени','заморозка','русские','говядина'], kk: ['тұспара','мұздатылған','сібір','сиыр еті'], ko: ['만두','냉동','러시아식','소고기'] }
  },
  p948: {
    name: { en: 'Frozen Fish Fillet', ru: 'Замороженное рыбное филе', kk: 'Мұздатылған балық филесі', ko: '냉동 생선 필렛' },
    brand: { en: 'Premium', ru: 'Премиум', kk: 'Премиум', ko: '프리미엄' },
    weight: { en: '600g', ru: '600г', kk: '600г', ko: '600g' },
    description: { en: 'Boneless, skinless white fish fillets, quick frozen.', ru: 'Филе белой рыбы без костей и кожи, быстрой заморозки.', kk: 'Сүйексіз және терісіз, жылдам мұздатылған ақ балық филесі.', ko: '가시와 껍질을 제거하고 급속 냉동한 흰살생선 필렛.' },
    tags: { en: ['fish','seafood','frozen','healthy','fillet'], ru: ['рыба','морепродукты','заморозка','здоровье','филе'], kk: ['балық','теңіз өнімдері','мұздатылған','пайдалы','филе'], ko: ['생선','해산물','냉동','건강식','필렛'] }
  },
  p949: {
    name: { en: 'Frozen Shrimp', ru: 'Замороженные креветки', kk: 'Мұздатылған асшаяндар', ko: '냉동 새우' },
    brand: { en: 'Ocean', ru: 'Океан', kk: 'Океан', ko: '오션' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    description: { en: 'Peeled and deveined tail-on frozen shrimp.', ru: 'Очищенные замороженные креветки с хвостиком.', kk: 'Құйрығы бар, тазартылған мұздатылған асшаяндар.', ko: '껍질을 벗기고 내장을 제거한 꼬리가 있는 냉동 새우.' },
    tags: { en: ['shrimp','seafood','frozen','premium'], ru: ['crevetki','moreprodukty','zamorozka','premium'], kk: ['асшаяндар','теңіз өнімдері','мұздатылған','премиум'], ko: ['새우','해산물','냉동','프리미엄'] }
  },
  p950: {
    name: { en: 'Frozen Burgers', ru: 'Замороженные котлеты для бургеров', kk: 'Бургерлерге арналған мұздатылған котлеттер', ko: '냉동 버거 패티' },
    brand: { en: 'Sadia', ru: 'Садия', kk: 'Садия', ko: '사디아' },
    weight: { en: '4pcs', ru: '4 шт', kk: '4 дана', ko: '4개입' },
    description: { en: 'Juicy beef burger patties, ready to grill.', ru: 'Сочные говяжьи котлеты для бургеров, готовые к жарке.', kk: 'Қуыруға дайын, бургерлерге арналған шырынды сиыр еті котлеттері.', ko: '그릴에 굽기 좋은 육즙 가득한 소고기 버거 패티.' },
    tags: { en: ['burger','beef','patties','frozen','barbecue','dinner'], ru: ['бургер','говядина','котлеты','заморозка','барбекю'], kk: ['бургер','сиыр еті','котлеттер','мұздатылған','барбекю'], ko: ['버거','소고기','패티','냉동','바베큐','저녁 식사'] }
  },
  p951: {
    name: { en: 'Ready Meals', ru: 'Готовые обеды замороженные', kk: 'Дайын мұздатылған тағамдар', ko: '냉동 간편식' },
    brand: { en: 'Hortex', ru: 'Хортекс', kk: 'Хортекс', ko: '호텍스' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    description: { en: 'Quick frozen pasta with chicken and vegetables.', ru: 'Быстрозамороженная паста с курицей и овощами.', kk: 'Тауық еті мен көкөністер қосылған жылдам мұздатылған паста.', ko: '닭고기와 채소를 곁들인 급속 냉동 파스타.' },
    tags: { en: ['meal','ready meal','frozen','convenience','dinner'], ru: ['обед','готовое блюдо','заморозка','полуфабрикат'], kk: ['түскі ас','дайын тағам','мұздатылған','жартылай дайын'], ko: ['식사','간편식','냉동','편의식','저녁 식사'] }
  },
  p952: {
    name: { en: 'Frozen Waffles', ru: 'Замороженные вафли', kk: 'Мұздатылған вафли', ko: '냉동 와플' },
    brand: { en: 'Mcennedy', ru: 'Макеннеди', kk: 'Макеннеди', ko: '맥케네디' },
    weight: { en: '250g', ru: '250г', kk: '250г', ko: '250g' },
    description: { en: 'Toastable sweet Belgian style waffles.', ru: 'Сладкие бельгийские вафли для тостера.', kk: 'Тостерге арналған тәтті бельгиялық вафлилер.', ko: '토스터에 구워 먹는 달콤한 벨기에식 와플.' },
    tags: { en: ['waffles','sweet','breakfast','frozen','dessert'], ru: ['вафли','сладкое','завтрак','заморозка','десерт'], kk: ['вафли','тәтті','таңғы ас','мұздатылған','десерт'], ko: ['와플','단맛','아침 식사','냉동','디저트'] }
  },
  p953: {
    name: { en: 'Frozen Sausages', ru: 'Замороженные сосиски', kk: 'Мұздатылған шұжықшалар', ko: '냉동 소시지' },
    brand: { en: 'Local', ru: 'Местные', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    description: { en: 'Classic frozen pork sausages, perfect for breakfast.', ru: 'Классические замороженные сосиски из свинины для завтрака.', kk: 'Таңғы асқа арналған классикалық шошқа етінен жасалған мұздатылған шұжықшалар.', ko: '아침 식사로 안성맞춤인 클래식 냉동 돼지고기 소시지.' },
    tags: { en: ['sausages','meat','frozen','breakfast'], ru: ['сосиски','мясо','заморозка','завтрак'], kk: ['шұжықшалар','ет','мұздатылған','таңғы ас'], ko: ['소시지','육류','냉동','아침 식사'] }
  },
  p954: {
    name: { en: 'Frozen Chicken Wings', ru: 'Замороженные куриные крылышки', kk: 'Мұздатылған тауық қанаттары', ko: '냉동 닭날개' },
    brand: { en: 'Alatau', ru: 'Алатау', kk: 'Алатау', ko: '알라타우' },
    weight: { en: '1000g', ru: '1000г', kk: '1000г', ko: '1000g' },
    description: { en: 'Frozen chicken wings, ready for baking or frying.', ru: 'Замороженные куриные крылышки, готовые для запекания или жарки.', kk: 'Пісіруге немесе қуыруға дайын мұздатылған тауық қанаттары.', ko: '오븐이나 튀김 조리용 냉동 닭날개.' },
    tags: { en: ['chicken','wings','frozen','meat','snack'], ru: ['курица','крылышки','заморозка','мясо','закуска'], kk: ['тауық','қанаттар','мұздатылған','ет','жеңіл тағам'], ko: ['치킨','닭날개','냉동','육류','스낵'] }
  },
  p955: {
    name: { en: 'Frozen Meatballs', ru: 'Замороженные фрикадельки', kk: 'Мұздатылған фрикаделькалар', ko: '냉동 미트볼' },
    brand: { en: 'Sadia', ru: 'Садия', kk: 'Садия', ko: '사디아' },
    weight: { en: '500g', ru: '500г', kk: '500г', ko: '500g' },
    description: { en: 'Seasoned beef meatballs, great for spaghetti.', ru: 'Пряные фрикадельки из говядины, отлично подходят к спагетти.', kk: 'Спагеттиге өте жақсы келетін, дәмдеуіштер қосылған сиыр етінен жасалған фрикаделькалар.', ko: '스파게티에 곁들이기 좋은 양념된 소고기 미트볼.' },
    tags: { en: ['meatballs','beef','frozen','dinner'], ru: ['фрикадельки','говядина','заморозка','ужин'], kk: ['фрикаделькалар','сиыр еті','мұздатылған','кешкі ас'], ko: ['미트볼','소고기','냉동','저녁 식사'] }
  },
  p956: {
    name: { en: 'Frozen Spinach', ru: 'Замороженный шпинат', kk: 'Мұздатылған шпинат', ko: '냉동 시금치' },
    brand: { en: 'Hortex', ru: 'Хортекс', kk: 'Хортекс', ko: '호텍스' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    description: { en: 'Whole leaf frozen spinach, packed with iron.', ru: 'Цельнолистовой замороженный шпинат, богатый железом.', kk: 'Темірге бай, тұтас жапырақты мұздатылған шпинат.', ko: '철분이 풍부한 통 잎 냉동 시금치.' },
    tags: { en: ['spinach','greens','frozen','healthy','vegetables'], ru: ['шпинат','зелень','заморозка','здоровье'], kk: ['шпинат','көк шөптер','мұздатылған','пайдалы'], ko: ['시금치','야채류','냉동','건강식','채소'] }
  },
  p957: {
    name: { en: 'Frozen Broccoli', ru: 'Замороженная брокколи', kk: 'Мұздатылған брокколи', ko: '냉동 브로콜리' },
    brand: { en: 'Hortex', ru: 'Хортекс', kk: 'Хортекс', ko: '호텍스' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    description: { en: 'Freshly frozen green broccoli florets.', ru: 'Свежезамороженные соцветия зеленой брокколи.', kk: 'Жаңа мұздатылған жасыл брокколи гүлшоғыры.', ko: '신선하게 얼린 초록색 브로콜리 송이.' },
    tags: { en: ['broccoli','vegetables','frozen','healthy'], ru: ['брокколи','овощи','заморозка','здоровье'], kk: ['брокколи','көкөністер','мұздатылған','пайдалы'], ko: ['브로콜리','채소','냉동','건강식'] }
  },
  p958: {
    name: { en: 'Frozen Pasta', ru: 'Замороженная паста', kk: 'Мұздатылған паста', ko: '냉동 파스타' },
    brand: { en: 'Rana', ru: 'Рана', kk: 'Рана', ko: '라나' },
    weight: { en: '400g', ru: '400г', kk: '400г', ko: '400g' },
    description: { en: 'Frozen tortellini with cheese filling.', ru: 'Замороженные тортеллини с сырной начинкой.', kk: 'Сыр салындысы бар мұздатылған тортеллини.', ko: '치즈 속을 채운 냉동 토르텔리니 파스타.' },
    tags: { en: ['pasta','tortellini','frozen','italian','dinner'], ru: ['паста','тортеллини','заморозка','итальянская кухня'], kk: ['паста','тортеллини','мұздатылған','итальян асханасы'], ko: ['파스타','토르텔리니','냉동','이탈리안','저녁 식사'] }
  },
  p959: {
    name: { en: 'Frozen Mozzarella Sticks', ru: 'Замороженные палочки моцарелла', kk: 'Мұздатылған моцарелла таяқшалары', ko: '냉동 모짜렐라 스틱' },
    brand: { en: 'Sadia', ru: 'Садия', kk: 'Садия', ko: '사디아' },
    weight: { en: '250g', ru: '250г', kk: '250г', ko: '250g' },
    description: { en: 'Crispy breaded mozzarella cheese sticks.', ru: 'Хрустящие палочки из сыра моцарелла в панировке.', kk: 'Аунатылған, қытырлақ моцарелла сыр таяқшалары.', ko: '바삭한 빵가루를 입힌 모짜렐라 치즈 스틱.' },
    tags: { en: ['cheese','mozzarella','frozen','snack','appetizer'], ru: ['сыр','моцарелла','заморозка','закуска'], kk: ['сыр','моцарелла','мұздатылған','жеңіл тағам'], ko: ['치즈','모짜렐라','냉동','스낵','에피타이저'] }
  },
  p960: {
    name: { en: 'Frozen Pancakes', ru: 'Замороженные блинчики', kk: 'Мұздатылған құймақтар', ko: '냉동 팬케이크' },
    brand: { en: 'Local', ru: 'Местные', kk: 'Жергілікті', ko: '국산' },
    weight: { en: '360g', ru: '360г', kk: '360г', ko: '360g' },
    description: { en: 'Soft frozen pancakes, ready to microwave.', ru: 'Мягкие замороженные блинчики, готовые для разогрева в микроволновке.', kk: 'Микротолқынды пеште ысытуға дайын, жұмсақ мұздатылған құймақтар.', ko: '전자레인지에 데워 먹는 부드러운 냉동 팬케이크.' },
    tags: { en: ['pancakes','breakfast','sweet','frozen'], ru: ['блины','завтрак','сладкое','заморозка'], kk: ['құймақтар','таңғы ас','тәтті','мұздатылған'], ko: ['팬케이크','아침 식사','단맛','냉동'] }
  }
}

const RECIPE_TRANSLATIONS = {
  borscht: { name: { en: 'Borscht', ru: 'Борщ', kk: 'Борщ', ko: '보르시' } },
  plov: { name: { en: 'Plov', ru: 'Плов', kk: 'Палау', ko: '파라우' } },
  'fried-eggs': { name: { en: 'Fried Eggs', ru: 'Яичница', kk: 'Қуырылған жұмыртқа', ko: '계란 프라이' } },
  omelette: { name: { en: 'Omelette', ru: 'Омлет', kk: 'Омлет', ko: '오믈렛' } },
  pasta: { name: { en: 'Pasta', ru: 'Паста', kk: 'Паста', ko: '파스타' } }
};

const STOCK_PATTERN_TRANSLATIONS = {
  magnum: {
    en: 'Usually restocked Tuesday & Friday mornings',
    ru: 'Обычно пополняется во вторник и пятницу утром',
    kk: 'Әдетте сейсенбі және жұма күндері таңертең толтырылады',
    ko: '보통 화요일과 금요일 아침에 재입고됨'
  },
  small: {
    en: 'Fresh dairy delivered daily before 9am',
    ru: 'Свежая молочка доставляется ежедневно до 9 утра',
    kk: 'Свежая молочка күн сайын таңғы 9-ға дейін жеткізіледі',
    ko: '매일 오전 9시 전에 신선한 유제품 배송'
  },
  green: {
    en: 'Best selection of imported goods on Thursdays',
    ru: 'Лучший выбор импортных товаров по четвергам',
    kk: 'Бейсенбі күндері импорттық тауарлардың ең жақсы таңдауы болады',
    ko: '목요일에 수입 상품 최다 입고'
  },
  artem: {
    en: 'Weekend sales every Saturday',
    ru: 'Распродажи на выходных каждую субботу',
    kk: 'Әр сенбі сайын демалыс күндерінің сатылымы болады',
    ko: '매주 토요일 주말 특별 세일 진행'
  },
  korean_market: {
    en: 'New Korean products arrive every Monday',
    ru: 'Новые корейские товары поступают каждый понедельник',
    kk: 'Жаңа корей тауарлары әр дүйсенбі сайын келеді',
    ko: '매주 월요일 새로운 한국 상품 입고'
  },
  iu_market: {
    en: 'Open 24 hours — late-night Asian snacks',
    ru: 'Открыто 24 часа — ночные азиатские закуски',
    kk: 'Тәулік бойы ашық — түнгі азиялық жеңіл тағамдар',
    ko: '24시간 영업 — 심야 아시안 간식 전문'
  },
  emart: {
    en: 'Best prices on Korean ramen & sauces',
    ru: 'Лучшие цены на корейский рамён и соусы',
    kk: 'Корей рамёны мен соустарына ең жақсы бағалар',
    ko: '한국 라면 및 소스 최저가 판매'
  },
  interfood: {
    en: 'Wide range of diet & allergen-free products',
    ru: 'Широкий ассортимент диетических и гипоаллергенных товаров',
    kk: 'Диеталық және аллергенсіз тауарлардың кең ассортименті',
    ko: '다양한 다이어트 및 알레르기 프리 제품 구비'
  },
  powerlife: {
    en: 'Best prices on sports supplements & protein',
    ru: 'Лучшие цены на спортивные добавки и протеин',
    kk: 'Спорттық қоспалар мен протеинге ең жақсы бағалар',
    ko: '스포츠 보충제 및 단백질 최저가 판매'
  }
};

const FRESHNESS_TRANSLATIONS = {
  p001: { en: '2 hrs ago', ru: '2 ч. назад', kk: '2 сағат бұрын', ko: '2시간 전' },
  p002: { en: '4 hrs ago', ru: '4 ч. назад', kk: '4 сағат бұрын', ko: '4시간 전' },
  p006: { en: '1 hr ago', ru: '1 ч. назад', kk: '1 сағат бұрын', ko: '1시간 전' }
};

function localizeData() {
  const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  
  // Localize STORES
  if (typeof STORES !== 'undefined' && typeof _raw_STORES !== 'undefined') {
    STORES.length = 0;
    _raw_STORES.forEach(s => {
      const tStore = (typeof STORE_TRANSLATIONS !== 'undefined' ? STORE_TRANSLATIONS[s.id] : null) || {};
      STORES.push({
        ...s,
        name: (tStore.name && tStore.name[lang]) || (tStore.name && tStore.name['en']) || s.name,
        address: (tStore.address && tStore.address[lang]) || (tStore.address && tStore.address['en']) || s.address,
        hours: (tStore.hours && tStore.hours[lang]) || (tStore.hours && tStore.hours['en']) || s.hours,
        cityDisplay: typeof t === 'function' ? t('city_' + s.city.toLowerCase()) : s.city,
        rawCity: s.city
      });
    });
  }

  // Localize PRODUCTS
  if (typeof PRODUCTS !== 'undefined' && typeof _raw_PRODUCTS !== 'undefined') {
    PRODUCTS.length = 0;
    _raw_PRODUCTS.forEach(p => {
      const tProd = (typeof PRODUCT_TRANSLATIONS !== 'undefined' ? PRODUCT_TRANSLATIONS[p.id] : null) || {};
      PRODUCTS.push({
        ...p,
        name: (tProd.name && tProd.name[lang]) || (tProd.name && tProd.name['en']) || p.name,
        brand: (tProd.brand && tProd.brand[lang]) || (tProd.brand && tProd.brand['en']) || p.brand,
        weight: (tProd.weight && tProd.weight[lang]) || (tProd.weight && tProd.weight['en']) || p.weight,
        tags: (tProd.tags && tProd.tags[lang]) || (tProd.tags && tProd.tags['en']) || p.tags,
        description: (tProd.description && tProd.description[lang]) || (tProd.description && tProd.description['en']) || p.description,
        stockQuantity: p.stockQuantity,
        rawWeight: p.weight
      });
    });
  }

  // Localize RECIPES
  if (typeof RECIPES !== 'undefined' && typeof _raw_RECIPES !== 'undefined') {
    RECIPES.length = 0;
    _raw_RECIPES.forEach(r => {
      const tRec = (typeof RECIPE_TRANSLATIONS !== 'undefined' ? RECIPE_TRANSLATIONS[r.id] : null) || {};
      RECIPES.push({
        ...r,
        name: (tRec.name && tRec.name[lang]) || (tRec.name && tRec.name['en']) || r.name
      });
    });
  }

  // Localize STOCK_PATTERNS
  if (typeof STOCK_PATTERNS !== 'undefined' && typeof _raw_STOCK_PATTERNS !== 'undefined') {
    for (const key of Object.keys(STOCK_PATTERNS)) {
      delete STOCK_PATTERNS[key];
    }
    for (const [storeId, pat] of Object.entries(_raw_STOCK_PATTERNS)) {
      const tPat = (typeof STOCK_PATTERN_TRANSLATIONS !== 'undefined' ? STOCK_PATTERN_TRANSLATIONS[storeId] : null) || {};
      STOCK_PATTERNS[storeId] = {
        icon: pat.icon,
        insight: tPat[lang] || tPat['en'] || pat.insight
      };
    }
  }

  // Localize FRESHNESS
  if (typeof FRESHNESS !== 'undefined' && typeof _raw_FRESHNESS !== 'undefined') {
    for (const key of Object.keys(FRESHNESS)) {
      delete FRESHNESS[key];
    }
    for (const [prodId, fresh] of Object.entries(_raw_FRESHNESS)) {
      const tFresh = (typeof FRESHNESS_TRANSLATIONS !== 'undefined' ? FRESHNESS_TRANSLATIONS[prodId] : null) || {};
      FRESHNESS[prodId] = {
        ...fresh,
        lastReport: tFresh[lang] || tFresh['en'] || fresh.lastReport
      };
    }
  }

  // Dynamically calculate category counts based on actual products in array
  if (typeof CATEGORIES !== 'undefined' && typeof PRODUCTS !== 'undefined') {
    CATEGORIES.forEach(c => {
      c.count = PRODUCTS.filter(p => p.category === c.id).length;
    });
  }
}

// Call localization after everything has loaded
localizeData();

// ── DYNAMIC BARCODE SYSTEM ──
if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
  const KNOWN_BARCODES = {
    'p001': '4607085790121', // Whole Milk 1L
    'p901': '5449000000996', // Coca-Cola 1.5L
    'p401': '3348901250146', // Dior Sauvage
    'p026': '4007900002161', // Colgate Toothpaste
    'p024': '8712561386159', // Dove Shampoo
    'p902': '4060800125651', // Pepsi 1.5L
  };

  PRODUCTS.forEach(p => {
    if (KNOWN_BARCODES[p.id]) {
      p.barcode = KNOWN_BARCODES[p.id];
    } else {
      const numPart = p.id.replace(/[^0-9]/g, '');
      const padded = numPart.padStart(5, '0');
      const prefix = "2000000" + padded;
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        const digit = parseInt(prefix[i]);
        sum += (i % 2 === 0) ? digit : digit * 3;
      }
      const checksum = (10 - (sum % 10)) % 10;
      p.barcode = prefix + checksum;
    }
  });
}

// ── PURCHASE HISTORY & TOAST SYSTEM ──
function getPurchaseHistory() {
  let history = localStorage.getItem('ff_purchase_history');
  if (!history) {
    // Seed with two dummy orders containing milk, eggs, bread, and tea
    const seed = [
      {
        id: 'order_seed_1',
        date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        items: [
          { id: 'p001', name: 'Whole Milk 1L', quantity: 2, emoji: '🥛' },
          { id: 'p023', name: 'White Eggs 10pcs', quantity: 1, emoji: '🥚' },
          { id: 'p008', name: 'White Bread 550g', quantity: 1, emoji: '🍞' },
          { id: 'p908', name: 'Black Tea 25 bags', quantity: 1, emoji: '☕' }
        ]
      },
      {
        id: 'order_seed_2',
        date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        items: [
          { id: 'p037', name: 'Strawberry Yogurt 150g', quantity: 3, emoji: '🍓' },
          { id: 'p045', name: 'Brown Eggs 10pcs', quantity: 1, emoji: '🥚' },
          { id: 'p009', name: 'Rye Bread 400g', quantity: 1, emoji: '🍞' }
        ]
      }
    ];
    localStorage.setItem('ff_purchase_history', JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(history);
}

function addPurchaseToHistory(cartItems) {
  if (!cartItems || cartItems.length === 0) return;
  let history = getPurchaseHistory();
  const newOrder = {
    id: 'order_' + Date.now(),
    date: new Date().toISOString(),
    items: JSON.parse(JSON.stringify(cartItems)) // deep copy
  };
  history.unshift(newOrder); // Prepend to show latest first
  localStorage.setItem('ff_purchase_history', JSON.stringify(history));
}

function readdBasketToCart(orderId) {
  const history = getPurchaseHistory();
  const order = history.find(o => o.id === orderId);
  if (!order) return false;
  
  let currentCart = JSON.parse(localStorage.getItem('ff_cart') || '[]');
  
  order.items.forEach(orderItem => {
    const existing = currentCart.find(item => {
      if (orderItem.id) {
        return item.id === orderItem.id;
      } else {
        return item.name === orderItem.name;
      }
    });
    
    if (existing) {
      existing.quantity = (existing.quantity || 1) + (orderItem.quantity || 1);
    } else {
      currentCart.push({
        id: orderItem.id,
        name: orderItem.name,
        emoji: orderItem.emoji || '📦',
        quantity: orderItem.quantity || 1
      });
    }
  });
  
  localStorage.setItem('ff_cart', JSON.stringify(currentCart));
  return true;
}

function showToast(message, buttonText, buttonUrl) {
  const existing = document.getElementById('shopnav-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'shopnav-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--forest);
    color: var(--cream);
    padding: 12px 24px;
    border-radius: 100px;
    box-shadow: 0 10px 30px rgba(5,150,105,0.3);
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 10000;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
    border: 1px solid rgba(255,255,255,0.1);
  `;
  
  toast.innerHTML = `
    <span>` + message + `</span>
    ${buttonText && buttonUrl ? `
      <a href="` + buttonUrl + `" style="
        background: var(--accent);
        color: var(--forest);
        padding: 6px 16px;
        border-radius: 100px;
        text-decoration: none;
        font-size: 0.8rem;
        font-weight: 700;
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        ` + buttonText + `
      </a>
    ` : ''}
  `;
  
  document.body.appendChild(toast);
  toast.offsetHeight; // trigger reflow
  toast.style.transform = 'translateX(-50%) translateY(0)';
  
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

