require('../../angular-highlightjs.min');

var angular = require('angular');
require('angular-route');

angular.module('exampleApp', ['hljs', 'ngRoute'])

.constant('exampleRoutes', [
  '/hljs', '/hljs-source', '/hljs-include', '/hljs-language'
])

.config(['$routeProvider', 'exampleRoutes',
function ($routeProvider,   exampleRoutes) {

  angular.forEach(exampleRoutes, function (path) {
    $routeProvider.when(path, {
      templateUrl: 'partials' + path + '.html'
    });
  });

  $routeProvider
  .otherwise({
    redirectTo: exampleRoutes[0]
  });
}]);
