const express = require('express');
const store = express.Router();
const app = express();
app.use(express.json());
let autoID = 21; 
    //generates ID by +1 to last hardcoded item ID: id = autoID++
    //doesn't overwrite deleted items' IDs either  

let cart = [
    {
        product: 'Yo-yo',
        price: 2.99,
        qty: 11,
        id: 1    
    },
    {
        product: 'Slingshot',
        price: 8.90,
        qty: 5,
        id: 2
    },
    {
        product: 'Tee Ball Bat',
        price: 4.80,
        qty: 4,
        id: 3
    },
    {
        product: 'Baseball Cap',
        price: 9.99,
        qty: 11,
        id: 4
    },
    {
        product: 'Frying Pan',
        price: 15.60,
        qty: 11,
        id: 7
    },
    {
        product: 'Big League Bat',
        price: 30.80,
        qty: 2,
        id: 5
    },
    {
        product: 'Casey Bat',
        price: 58.50,
        qty: 2,
        id: 6
    },
    {
        product: `Chef's Frying Pan`,
        price: 119.99,
        qty: 4,
        id: 8
    },
    {
        product: 'Holy Frying Pan',
        price: 348.00,
        qty: 1,
        id: 9
    },
    {
        product: 'Pop Gun',
        price: 11.10,
        qty: 6,
        id: 10
    },
    {
        product: 'Zip Gun',
        price: 24.50,
        qty: 3,
        id: 11
    },
    {
        product: 'Laser Gun',
        price: 65,
        qty: 2,
        id: 12
    },
    {
        product: 'Ribbon',
        price: 8,
        qty: 9,
        id: 13
    },
    {
        product: 'Mr. Baseball Cap',
        price: 19.99,
        qty: 13,
        id: 14
    },
    {
        product: 'Goddess Ribbon',
        price: 39.80,
        qty: 3,
        id: 15
    },
    {
        product: `Rabbit's Foot`,
        price: 12,
        qty: 13,
        id: 16
    },
    {
        product: 'Mr. Saturn Coin',
        price: 100,
        qty: 1,
        id: 17
    },
    {
        product: 'Fancy Yo-Yo',
        price: 21,
        qty: 4,
        id: 18
    },
    {
        product: 'Fancy Ribbon',
        price: 15.49,
        qty: 7,
        id: 19
    },
    {
        product: `Fancy Lad's Cap`,
        price: 24.99,
        qty: 6,
        id: 20
    }

]
//id, product, price, qty

// Endpoints:
// 1. GET /cart-items
    // a. Action: None
    // b. Response: a JSON array of all cart items
    // c. Response Code: 200 (OK)
    // d. Query string parameters: the request may have one of the following or it may
    // have none. (See tests below for examples.)
            
// [domain]/cart-items (pulls up all cart items)
store.get('', (req, res) => {
    let filteredCart = [...cart];
    // i. maxPrice = 3.0 - if specified, only include products that are at or below this price.
    if (req.query.maxPrice) {
        filteredCart = filteredCart.filter(item => item.price <= req.query.maxPrice)
    };
    // ii. prefix - if specified, only includes products that start with the given string 'fancy' in the response array.
    if (req.query.prefix) {
        filteredCart = filteredCart.filter(item => item.product.toLowerCase().startsWith(req.query.prefix.toLowerCase()));
    };
    // iii. pageSize = 10 - if specified, only includes up to the given number of items in the response array. For example, if there are ten items total, but pageSize=5, only return an array of the first five items.
    if (req.query.pageSize) {
        filteredCart = filteredCart.slice(0, req.query.pageSize);
    }   
        // req.query.pageSize = limit;
        // firstPage = cart.slice(0, limit);
        //res.json(firstPage);
        // well, I wanted to store 'req.query.pageSize' into a nice contextual variable but it didn't work
        
        
    res.status(200)
    res.json(filteredCart);
            
            // === res.status(200).send('OK')
        //}
           
    });

    //abandoned attempt at using switch cases
        // switch (req.query['maxPrice']) {
        //     case 3.0:
        //         let filtered = cart.filter(item => item.price <= 3);
        //         res.json(filtered);
        //         break;
        // switch (req.query['prefix']) {
        //     case 'fancy':
        //         let filtered = cart.filter(item => item.product.startsWith('fancy'));
        //         res.json(filtered);
        //         break;
        // }
        // default:
        //     res.json(cart);;
        //}

// 2. GET /cart-items/:id
    // a. Action: None
    // b. Response: a JSON object of the item with the given ID
    // c. Response Code: 200 (OK)
    // d. However, if the item with that ID cannot be found in the array, return a string
    // response “ID Not Found” with response code 404 (Not Found)
store.get('/:id', (req, res) => {
    
    const found = cart.some(item => item.id === parseInt(req.params.id));

    if (found) {
        res.json(cart.filter(item => item.id === parseInt(req.params.id)));
        res.sendStatus(200)
        // === res.status(200).send('OK')
    } else {
        res.status(404).json({ msg: `404'd! No product with an id of ${req.params.id} was found. Ow, my browser.`});
    }
})

// 3. POST /cart-items
// a. Action: Add a cart item to the array using the JSON body of the request. Also generate a unique ID for that item.
// b. Response: the added cart item object as JSON.
// c. Response Code: 201 (Created)
store.post('/', (req, res) => {
    //res.send('is it my code?');
    //let lastID = (cart.slice(-1)[0]); auto-generating id idea
    const newItem = {
        product: req.body.product,
        qty: req.body.qty,
        price: req.body.price,
        id: autoID++
     }    
        
     if (!newItem.product || !newItem.price || !newItem.qty ) {
         return res.status({ msg: 'Please include all three of the product name, price, and quantity.'});
     } 
     cart.push(newItem);
     res.status(201)
     res.json(newItem);
     
     //res.end();
     //getting error that says I'm sending HTTP headers twice (???)
});
//res.send(req.body);

// 4. PUT /cart-items/:id
// a. Action: Update the cart item in the array that has the given id. Use the JSON
// body of the request as the new properties.
// b. Response: the updated cart item object as JSON.
// c. Response Code: 200 (OK).
store.put('/:id', (req, res) => {
    
    const found = cart.some(item => item.id === parseInt(req.params.id));

    if (found) {
        const editedItem = req.body;
        cart.forEach(item => {
            if(item.id === parseInt(req.params.id)) {
                item.product = editedItem.product ? editedItem.product : item.product;
                //ternary operators to check if there's an input, else it keeps the old product name/price
                item.price = editedItem.price ? editedItem.price : item.price;
                item.qty = editedItem.qty ? editedItem.qty : item.qty;
                item.id = editedItem.id ? editedItem.id : item.id;
                res.json({ msg: 'Item edited', item })
                }
        })
    } else {
        res.status(404).json({ msg: `404'd! No product with an id of ${req.params.id} was found. Ow, my browser.`});
    }
});

//5. DELETE /cart-items/:id
// a. Action: Remove the item from the array that has the given ID.
// b. Response: Empty
// c. Response Code: 204 (No Content)
store.delete('/:id', (req, res) => {
    const found = cart.some(item => item.id === parseInt(req.params.id));

    if (found) {
        res.status(200);
        res.json(cart.filter(item => item.id !== parseInt(req.params.id)));
        // === res.status(200).send('OK')
    } else {
        res.status(404).json({ msg: `404'd! No product with an id of ${req.params.id} was found. Ow, my browser.`});
    }

})
    
 module.exports = store;