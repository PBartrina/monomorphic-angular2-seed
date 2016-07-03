import {models, services, validators} from '../common'
let express = require('express')

export let app = express();
configureApp(app);
let source = require('./db/products.json');

let cart: services.Cart = new services.Cart();
let products: models.Product[];
let getProducts = (req, res, next) => {
    products = products
        || <models.Product[]>(source.products).map(function (elem) {
            elem.about = elem.about.substring(0, 200) + '...';
            return elem;
        });
    next();
}

app.route('/api/products')
    .get([getProducts], (req, res) => {
        res.status(200).json(products);
    });

app.route('/api/cart')
    .get((req, res) => {
        res.status(200).json(cart.getItems());
    })
    .delete((req, res) => {
        res.sendStatus((cart.deleteItems()) ? 200 : 500);
    });

app.route('/api/cart/item/:id')
    .get((req, res) => {
        let item: services.Item;
        if (!cart.isEmpty()) {
            item = cart.getItem(req.params.id);
        }
        res.status((item) ? 200 : 404).send((item) ? item : 'Item not in cart');
    })
    .put((req, res, next) => {
        if (!products) {
            res.status(404).send("Products not found");
        } else {
            let product: services.Item = cart.getItem(req.params.id);
            if (!product) {
                products.forEach((elem) => {
                    if (elem._id === req.params.id) {
                        product = new services.Item(elem._id, elem.index, elem.picture,
                            1, elem.name, elem.about,
                            elem.price);
                    }
                });
            }
            res.sendStatus(cart.add(product) ? 200 : 500);
        }
    })
    .delete((req, res) => {
        if (cart.isEmpty()) {
            res.status(404).send("Cart is empty");
        }
        else {
            res.sendStatus((cart.substract(req.params.id)) ? 200 : 500);
        }
    });

app.delete('/api/cart/item/:id/all', (req, res) => {
    if (cart.isEmpty()) {
        res.status(404).send("Cart is empty");
    } else {
        res.sendStatus((cart.remove(req.params.id)) ? 200 : 500);
    }
});

    let multer = require('multer');
    let upload = multer(); // for parsing multipart/form-data
app.post('/api/checkout', [upload.array()], (req, res, next) => {
    if (((req.body.name) && validators.isValidName(req.body.name))
        && ((req.body.email) && validators.isValidMail(req.body.email))
        && ((req.body.card) && validators.isValidCard(req.body.card))) {
        res.sendStatus((cart.deleteItems()) ? 200 : 500);
    } else {
        res.status(403).send("Invalid data");
    }
});

//_____________________//
/** Express specifics - nothing interesting*/

function configureApp(app) {
    let bodyParser = require('body-parser')
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    //CORS middleware
    let allowCrossDomain = (req, res, next) => {
        var oneof = false;
        if (req.headers.origin) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            oneof = true;
        }
        if (req.headers['access-control-request-method']) {
            res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
            oneof = true;
        }
        if (req.headers['access-control-request-headers']) {
            res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
            oneof = true;
        }
        if (oneof) {
            res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
        }

        // intercept OPTIONS method
        if (oneof && req.method == 'OPTIONS') {
            res.sendStatus(200);
        }
        else {
            next();
        }
    }
    app.use(allowCrossDomain);

    //Logs time since epoch + method + url
    let timeLog = (req, res, next) => {
        console.log(Date.now(), req.method, req.path);
        next();
    }
    app.use(timeLog);
}
