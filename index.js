'use strict';

const dht = require('node-dht-sensor');
const http = require('http');
const sockets = require('socket.io');
const Express = require('express');
const mg = require('mongoose');

const Circs = require('./src/model/circs')(mg);

class Thermometer {
  constructor() {
    this.app = new Express();
    this.server = http.Server(this.app);
    this.io = sockets(this.server);

    this.server.listen(2525);
    this.io.on('connection', this.socket.bind(this));

    mg.connect('localhost', 'temp');

    Circs
      .find()
      .then(circs => console.log(circs.length));

    dht.initialize(11, 16);
    setInterval(this.temp.bind(this), 3000);
  }

  socket(socket) {
    
  }

  temp() {
    this.circs = dht.read();
    console.log('update', new Date().toLocaleTimeString(), this.circs);
    Circs.create(this.circs);
  }
}

new Thermometer();
