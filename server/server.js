const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
mongoose.connect('mongodb://zpwproject:zpwproject123@ds225382.mlab.com:25382/zpwproject', {useNewUrlParser: true});

const modelProduct = new mongoose.Schema({
  category: String,
  description: String,
  name: String,
  photo: String,
  price: Number,
  quantity: Number
});

const modelDiscounts = new mongoose.Schema({
  discountEndTime: {seconds: Number},
  productPercentValue: Number,
  products: [String]
});

const modelOrders = new mongoose.Schema({
  address: String,
  email: String,
  name: String,
  status: Number,
  products: [{id: String, quantity: Number}]
});

const products = mongoose.model('products', modelProduct);
const discounts = mongoose.model('discounts', modelDiscounts);
const orders = mongoose.model('orders', modelOrders);

/** CORS PRE-FLIGHT **/

app.options('/products', cors());
app.options('/product/:id', cors());
app.options('/discounts', cors());
app.options('/orders', cors());

app.options('/product', cors());
app.options('/discount', cors());
app.options('/order', cors());

app.options('/order/:id', cors());

/** GET **/

app.get('/products', cors(), (req, res) => products.find({}, (err, resp) => res.send(err ? '[]' : resp)));
app.get('/product/:id', cors(), (req, res) => products.find({_id: req.params.id}, (err, resp) => res.send(err ? '[]' : resp[0])));
app.get('/discounts', cors(), (req, res) => discounts.find({}, (err, resp) => res.send(err ? '[]' : resp)));
app.get('/orders', cors(), (req, res) => orders.find({}, (err, resp) => res.send(err ? '[]' : resp)));

/** POST **/
app.post('/product', cors(), (req, res) => products.create(req.body, () => res.send('')));
app.post('/discount', cors(), (req, res) => discounts.create(req.body, () => res.send('')));
app.post('/order', cors(), (req, res) => orders.create(req.body, () => res.send('')));

/** PATCH **/

app.patch('/product/:id', cors(), (req, res) => {
  products.findById(req.params.id, (err, product) => {
    product.set(req.body);
    product.save(() => res.send(''));
  });
});

app.patch('/order/:id', cors(), (req, res) => {
  orders.findById(req.params.id, (err, order) => {
    order.set(req.body);
    order.save(() => res.send(''));
  });
});

/** DELETE **/

app.delete('/product/:id', cors(), (req, res) => {
  products.findById(req.params.id, (err, product) => product.remove(() => res.send('')));
});

/** ****** **/

const server = app.listen(5000, () => {
  const port = server.address().port;
  console.log("REST SERVICE - http://localhost:%s", port)
});
