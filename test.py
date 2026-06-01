import json

cart = []
prod = {'id': 'p001', 'price': {'magnum_turk': 470, 'other': 500}}
selectedStoreId = 'magnum_turk'

cart.append({
    'id': prod['id'],
    'quantity': 1,
    'storeId': selectedStoreId
})

print("Cart after add:", cart)

def change_item_store(cart, index, new_store_id):
    if new_store_id:
        cart[index]['storeId'] = new_store_id
    else:
        cart[index].pop('storeId', None)

change_item_store(cart, 0, 'other')
print("Cart after change:", cart)

change_item_store(cart, 0, '')
print("Cart after clearing store:", cart)

