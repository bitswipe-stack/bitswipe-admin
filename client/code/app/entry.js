

var Models = require('./Models') //the app's backbone models
var Views = require('./Views') //the app's backbone views

window.ss = require('socketstream')

ss.server.on('disconnect', function(){
  console.log('Connection down :-(')
})

ss.server.on('reconnect', function(){
  console.log('Connection back up :-)')
})

ss.server.on('ready', function(){

  Backbone.View.prototype.user = new Models.User() // make user available to every view

  $(function(){ 

    window.app = new Views.App() // create main app view

  })

})
