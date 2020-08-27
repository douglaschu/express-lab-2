const express = require('express');
const cart = express.Router();
const app = express();
const pool = require('./pg-connection-pool');
const e = require('express');
// const { response, request } = require('express');
// app.use(express.json());

// function getTable(filters) {
//     const defaults = {
//         limit: 10,
//         filterType: 'and'
//     }
//     let myFilters = {...defaults, ...filters}
//     let query = "select * from shopping_cart"
//     let where = [];
//     let params = [];
//     if(myFilters.id){
//         params.push(myFilters.id);
//         where.push( `id = $${params.length}::text`)
//     }
// }


// 3. GET /cart-items - responds with a JSON array of all cart items from database
// 4. GET/cart-items- responds with statuscode 200
// 5. GET /cart-items?maxPrice=3.0 - responds with a JSON array of only the cart items
// that have price <= 3.0
// 6. GET /cart-items?prefix=Fancy - responds with a JSON array of only the cart items
// that have product starting with "Fancy".
// 7. GET /cart-items?pageSize=10 - responds with a JSON array of all cart items, but if
// there are more than ten items, the response includes only the first ten.

cart.get("/", async (request, res, next) => {
    //let filter = {};
    console.log(request.query);
    // filter.limit = request.query.limit;  ??????????????????
    // filter.maxPrice = request.query.maxPrice;
    // filter.pageSize = request.query.pageSize;
    
    try {
        if (request.query.maxPrice) {
            const result = await pool.query(`SELECT * FROM shopping_cart WHERE price <= ${request.query.maxPrice}`);
            return res.json(result.rows);
        }
        if (request.query.prefix) {
            const result = await pool.query(`SELECT * FROM shopping_cart WHERE product LIKE '${request.query.prefix}%'`);
            return res.json(result.rows);
        }
        if (request.query.pageSize) {
            console.log(`SELECT * FROM shopping_cart LIMIT ${parseInt(request.query.pageSize)}`);
            const result = await pool.query(`SELECT * FROM shopping_cart LIMIT ${parseInt(request.query.pageSize)}`);
            return res.json(result.rows);
        }
        const result = await pool.query("SELECT * FROM shopping_cart");
        
        //const result = await pool.query("SELECT * FROM shopping_cart WHERE product LIKE 'Fancy%'");
        //const result = await pool.query("SELECT * FROM shopping_cart WHERE price <= 3")
        return res.json(result.rows);
        response.json(200);
    } catch (err) {
        return next(err);
    }

})

// 8. GET /cart-items/:id - responds with a JSON object of the item with the given ID
// 9. GET/cart-items/:id-responds with status code 200
// 10. GET /cart-items/:id - responds with status code 404 when not found

cart.get("/:id", async  (req, res, next) => {
    
    try {
        const result = await pool.query("SELECT * FROM shopping_cart WHERE id = $1", 
        [req.params.id]);
        return res.json(result.rows[0]);
        response.sendStatus(200);
    } catch (err) {
        return next(err);
        response.sendStatus(404)({ msg: `404'd!`});
    }    
})

//`product LIKE $${params.length}::text`

// cart.get("/cart-items", (request, response) => {
//     let filter = {};
//     console.log(request.query)
//     getTable(filter).then(result => {
//         let data = result.rows;
//         response.json(data);
//       }).catch(err=>{
//           console.log(err);
//           response.sendStatus(500);
//       });

// })



module.exports = cart;