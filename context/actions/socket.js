import React from 'react';
import socketio from "socket.io-client";
import { APIURL } from '../constants/api';
export const socket = socketio.connect(APIURL);
//export const backendSocket = socketio.connect(socketUrlBackend);

export const backendSocket  = socketio(APIURL, {
  path: ""
});

socket.on('connect_error', err => handleErrorsSckt(err))
socket.on('connect_failed', err => handleErrorsSckt(err))
socket.on('disconnect', err => handleErrorsSckt(err))
socket.on('error', err => console.log('socket view or updateview error =>', err))


backendSocket.on('connect_error', err => handleErrorsSckt(err))
backendSocket.on('connect_failed', err => handleErrorsSckt(err))
backendSocket.on('disconnect', err => handleErrorsSckt(err))
backendSocket.on('error', err => console.log('backendSocket error =>', err ))

export const handleErrorsSckt = (err) => {
  console.log(err.message, '-handleErrorsSckt-', err)
};

export const SocketContext = React.createContext();