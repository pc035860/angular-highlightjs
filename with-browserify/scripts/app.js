var angular = require('angular');

angular
.module('exampleApp', [
  require('../../angular-highlightjs')
])
.controller('MainCtrl', require('./main-ctrl'));
