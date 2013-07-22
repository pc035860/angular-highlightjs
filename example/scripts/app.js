angular.module('exampleApp', ['ngHljs'], 
        ['$routeProvider', 
function ($routeProvider) {

  angular.forEach([
    '/ng-hljs', '/ng-hljs-source', '/ng-hljs-fetch'
  ], function (path) {
    $routeProvider.when(path, {
      templateUrl: 'partials' + path + '.html'
    });
  });

  $routeProvider
  .otherwise({
    redirectTo: '/ng-hljs'
  });
}]);
