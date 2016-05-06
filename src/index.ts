import dht from 'node-dht-sensor';
import http from 'http';
import sockets from 'socket.io';
import Express from 'express';
import mg from 'mongoose';

import { CircsModel } from './model/circs';

class Thermometer {
  Circs = CircsModel(mg);
  circs: any;
  server;
  app;
  io;

  constructor() {
    if (!dht) return;

    this.app = new Express();
    this.server = http.Server(this.app);
    this.io = sockets(this.server);

    this.server.listen(2525);
    this.io.on('connection', this.socket.bind(this));

    mg.connect('localhost', 'temp');

    dht.initialize(11, 16);
    setInterval(this.temp.bind(this), 3000);
  }

  socket(socket) {
    socket.on('records', this.recordsEmit.bind(this, socket));
    socket.on('charts', this.charts.bind(this, socket));
  }

  charts(socket) {
    this.Circs
      .find()
      .limit(100)
      .then(circs =>
        socket.emit('charts', circs));
  }

  recordsEmit(socket) {
    this.Circs
      .count()
      .then(amount =>
        socket.emit('records', amount));
  }

  temp() {
    this.circs = dht.read();
    this.io.sockets.emit('circs', this.circs);
    this.Circs.create(this.circs);

    console.log(new Date().toLocaleTimeString(), this.circs);
  }
}

new Thermometer();
