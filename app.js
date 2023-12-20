var express = require('express');
var app = express();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('protein');

var multer = require('multer');
var upload = multer();





app.get('/', function (req, res) {
    res.send('Welcome to this database of protein sources');
});

app.get('/quote', function (req, res) {
    res.send('I am hungry!');
});

app.get('/testjson', function (req, res) {
    res.json({
        "name": "Saehrimnir",
        "price": 10,
        "quality": 10,
        "flavour": 10,
        "rating": 10
    });
});





/**
 * @api {get} /proteins Display all foods in the database. 
 * @apiVersion 1.0.0
 * @apiGroup PROTEIN
 * @apiParam {String} name The name of the food you want to add
 * @apiParam {Number} price The rating of the food's price, from 1 (worst) to 10 (best)
 * @apiParam {Number} quality The nutritional quality of the food, rated as above.
 * @apiParam {Number} flavour The flavour of the food, rated as above.
 * @apiParam {Number} rating The overall rating of the food, rated as above. 
 * 
 *    HTTP/1.1 200 OK
 *    {      
 *      "name": "Saehrimnir",
 *       "price": 10,
 *       "quality": 10,
 *       "flavour": 10,
 *      "rating": 10
 *    },
 *    
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
app.get('/proteins', function (req, res) {
    db.all("SELECT * FROM protein.db", function (err, rows) {
        res.json(rows);
    });
});


/**
 * @api {get} /proteins/:name Read a specific food
 * @apiVersion 1.0.0
 * @apiGroup PROTEIN
* @apiParam {String} name The name of the food you want to add
 * @apiParam {Number} price The rating of the food's price, from 1 (worst) to 10 (best)
 * @apiParam {Number} quality The nutritional quality of the food, rated as above.
 * @apiParam {Number} flavour The flavour of the food, rated as above.
 * @apiParam {Number} rating The overall rating of the food, rated as above. 
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {      
 *      "name": "Saehrimnir",
 *       "price": 10,
 *       "quality": 10,
 *       "flavour": 10,
 *      "rating": 10
 *     },
 */
app.get('/proteins/name', function (req, res) {
    let name = req.params.name;
    db.all("SELECT * FROM protein.db WHERE name=?", [name], function (err, rows) {
        res.json(rows);
    });
});
 

/**
 * @api {post} /protein/ Create a new weblink
 * @apiVersion 1.0.0
 * @apiGroup PROTEIN
 * @apiParam {String} name The name of the food you want to add
 * @apiParam {Number} price The rating of the food's price, from 1 (worst) to 10 (best)
 * @apiParam {Number} quality The nutritional quality of the food, rated as above.
 * @apiParam {Number} flavour The flavour of the food, rated as above.
 * @apiParam {Number} rating The overall rating of the food, rated as above. 
 * 
 *    }
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
app.post('/protein', upload.array(), function (req, res, next) {
    console.log(req.body.name);
    console.log(req.body.price);
    console.log(req.body.quality);
    console.log(req.body.flavour);
    console.log(req.body.rating);
    let name = req.body.name;
    let price = req.body.price;
    let quality = req.body.quality;
    let flavour = req.body.flavour;
    let rating = req.body.rating;

    db.run("INSERT INTO protein.db (name, price, quality, flavour, rating) VALUES (?, ?)",
        name, price, quality, flavour, rating, 
        function (error) {
            if (error) {
                console.err(error);
                res.status(500); //error
            } else {
                res.status(201); //created 
            }
            res.end();
        });
});



/**
 * @api {put} /proteins/:name Update an existing food.
 * @apiVersion 1.0.0
 * @apiGroup PROTEIN
* @apiParam {String} name The name of the food you want to add
 * @apiParam {Number} price The rating of the food's price, from 1 (worst) to 10 (best)
 * @apiParam {Number} quality The nutritional quality of the food, rated as above.
 * @apiParam {Number} flavour The flavour of the food, rated as above.
 * @apiParam {Number} rating The overall rating of the food, rated as above. 
 * 
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
app.put('/proteins/name', upload.array(), function (req, res, next) {
    console.log(req.body.name);
    console.log(req.body.price);
    console.log(req.body.quality);
    console.log(req.body.flavour);
    console.log(req.body.rating);
    let name = req.body.name;
    let price = req.body.price;
    let quality = req.body.quality;
    let flavour = req.body.flavour;
    let rating = req.body.rating;

    db.run("UPDATE protein.db SET price=?, quality=?, flavour=?, rating=? where name=?",
        price, quality, flavour, rating, name,
        function (error) {
            if (error) {
                console.err(error);
                res.status(500); //error
            } else {
                res.status(201); //created 
            }
            res.end();
        });
});




/**
 * @api {delete} /proteins/:name Delete an existing weblink
 * @apiVersion 1.0.0
 * @apiGroup PROTEINS
 * 
 * @apiParam {String} name Food name
 * 
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 */
app.delete('/proteins/name', function (req, res, next) {
    let name = req.params.name;
    db.run("DELETE from protein.db WHERE name=?",
        id,
        function (error) {
            if (error) {
                console.err(error);
                res.status(500); //error
            } else {
                res.status(201); //deleted 
            }
            res.end();
        });
});








//CORS setup for testing
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.listen(5000);
console.log("Up and running..");