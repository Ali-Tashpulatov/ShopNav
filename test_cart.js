const fs = require('fs');

// We will read data.js to get the store and product.
const dataJs = fs.readFileSync('js/data.js', 'utf8');
// Evaluate data.js
eval(dataJs);

let selectedStoreId = 'magnum_turk';
let prod = PRODUCTS[0];

let cart = [];
if(!cart.find(i=>i.id===prod.id)) {
  cart.push({id:prod.id,name:prod.name,emoji:prod.emoji,quantity:1, storeId: selectedStoreId});
}

console.log("Cart after add:", cart);

let item = cart[0];
const targetStoreId = item.storeId || (prod ? getCheapestStore(prod) : null);
const price = targetStoreId && prod ? prod.price[targetStoreId] : 0;
const store = targetStoreId ? getStoreById(targetStoreId) : null;

console.log("Cart targetStoreId:", targetStoreId);
console.log("Cart price:", price);
console.log("Cart store:", store ? store.name : null);

// changeItemStore
function changeItemStore(i, storeId){
  if(storeId) cart[i].storeId = storeId;
  else delete cart[i].storeId;
}

changeItemStore(0, "small");
console.log("Cart after change:", cart);
const newTargetStoreId = cart[0].storeId || (prod ? getCheapestStore(prod) : null);
console.log("New targetStoreId:", newTargetStoreId);

