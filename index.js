const dotenv = require('dotenv').config(),
  express = require('express'),
  path = require('path'),
  // cookieParser = require('cookie-parser'),
  http = require('http'),
  // https = require('https'),
  fs = require('fs'),
  pretty = require('pretty-log'),
  io = require('socket.io'),
// crypto = require('crypto'),
// SpotifyWebApi = require('spotify-web-api-node'),
// db = require('./db');

var app = express(),
  www = http.createServer(app),
  server = io(www);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.port);

www.listen(process.env.port);

www.on('error', function (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  pretty.log({
    data: `Error: port ${process.env.port}: ${error.code}`,
    action: 'error'
  })
});

www.on('listening', function () {
  pretty.log(`www: listening on ${process.env.port}`)
});

server.on('connection', socket => {
  
} )