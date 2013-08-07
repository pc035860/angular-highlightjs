angular.module('exampleApp', ['hljs'])

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
