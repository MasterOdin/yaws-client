# YAWS-Server

[![Build Status](https://travis-ci.com/MasterOdin/yaws-server.svg?branch=master)](https://travis-ci.com/MasterOdin/yaws-server)

Yet Another Web Socket Server

A wrapper around the immensely wonderful [websockets/ws](https://github.com/websockets/ws) that adds some needed utility
I find myself always re-implement in usage, such as wrapping JSON messaging with `stringify` and `parse` methods, easy
broadcasting, etc.

## Installation
```
npm install yaws-server
```

## Usage
```
const YawsServer = require('yaws-server');
const { createServer } = require('http');

const wsServer = new YawsServer(createServer());
wsServer.on('connection', (client) => {
  client.send('hello', {msg: 'world'});
  client.on('hello', (data) => {
    console.log(data);
  });
});

wsServer.broadcast('hello', {msg: 'world'});
```
