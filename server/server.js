const serverDomain = 'http://localhost';
const serverPort = 5000;

const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

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

app.get('/products', cors(), (req, res) => {
  return products.find({}, (err, resp) => {
    const toEmit = err ? '[]' : resp;
    io.sockets.emit('products', toEmit);
    return res.send(toEmit);
  });
});

app.get('/product/:id', cors(), (req, res) => {
  return products.find({_id: req.params.id}, (err, resp) => {
    const toEmit = err ? '[]' : resp[0];
    io.sockets.emit('product', toEmit);
    return res.send(toEmit);
  });
});

app.get('/discounts', cors(), (req, res) => {
  return discounts.find({}, (err, resp) => {
    const toEmit = err ? '[]' : resp;
    io.sockets.emit('discounts', toEmit);
    return res.send(toEmit);
  });
});

app.get('/orders', cors(), (req, res) => {
  return orders.find({}, (err, resp) => {
    const toEmit = err ? '[]' : resp;
    io.sockets.emit('orders', toEmit);
    return res.send(toEmit);
  });
});

/** POST **/

app.post('/product', cors(), (req, res) => products.create(req.body, () => {
  http.get(serverDomain + ':' + serverPort + '/products');
  return res.send('');
}));

app.post('/discount', cors(), (req, res) => discounts.create(req.body, () => {
  http.get(serverDomain + ':' + serverPort + '/discounts');
  return res.send('');
}));

app.post('/order', cors(), (req, res) => orders.create(req.body, () => {
  http.get(serverDomain + ':' + serverPort + '/orders');
  return res.send('');
}));

/** PATCH **/

app.patch('/product/:id', cors(), (req, res) => {
  products.findById(req.params.id, (err, product) => {
    product.set(req.body);
    product.save(() => {
      http.get(serverDomain + ':' + serverPort + '/products');
      return res.send('');
    });
  });
});

app.patch('/order/:id', cors(), (req, res) => {
  orders.findById(req.params.id, (err, order) => {
    order.set(req.body);
    order.save(() => {
      http.get(serverDomain + ':' + serverPort + '/orders');
      return res.send('');
    });
  });
});

/** DELETE **/

app.delete('/product/:id', cors(), (req, res) => {
  products.findById(req.params.id, (err, product) => product.remove(() => {
    http.get(serverDomain + ':' + serverPort + '/products');
    return res.send('');
  }));
});

/** ****** **/

server.listen(serverPort, () => {
  console.log("REST SERVICE - %s:%s", serverDomain, serverPort);
});
