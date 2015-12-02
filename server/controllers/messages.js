'use strict';

var config    = require('../../config'),
    _         = require('underscore'),
    mongoose  = require('mongoose'),
    io        = require('socket.io');

/**
 * @class Default controller
 *
 * @author Soloschenko G. soloschenko@gmail.com
 * @copyright FaceLess Inc (c) 2015 faceless.club
 *
 */
var Messages = function(server)
{
  var sio = io.listen(server);

  sio.sockets.on('connection', function (socket) {

    socket.on('disconnect', function() {
    });

    socket.on('subscribe', function(room) {
      socket.join(room);
    });

    socket.on('message', function (data) {
      data.message.conversation = data.room;

      mongoose.model('message').create({
        data: data.message,
        success: function(message){

          mongoose.model('conversation').change({
            criteria  : {_id: data.room},
            data:{
              message: { id: message._id }
            },
            success: function(conversation){
              socket.broadcast.to(data.room).emit('message', message);
            },
            error: function(err){
              socket.broadcast.to(data.room).emit('error', err);
            }
          });
        },
        error: function(err){
          socket.broadcast.to(data.room).emit('error', err);
        }
      });
    });
  });

  return this;
};

module.exports = Messages;