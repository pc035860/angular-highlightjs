angular.module('exampleApp')

.controller('ExampleCtrl', [
         '$scope', '$location', '$templateCache',
function ($scope,   $location,   $templateCache) {

  $scope.linkList = [
    '/ng-hljs', '/ng-hljs-source', '/ng-hljs-fetch'
  ];

  // $scope.title = titleMap[key];

  $scope.source = null;
  $scope.toggleSource = function (target) {
    target = target || 'source';

    if ($scope[target] === null) {
      $scope[target] = $templateCache.get('partials' + $scope.path + '.html')[1];
    }
    else {
      $scope[target] = null;
    }
  };

  $scope.test = function () {
    console.log('test');
  };

  $scope.$on('$routeChangeSuccess', function () {
    $scope.path = $location.path();
    $scope.disabled = false;
    $scope.source = null;
  });
}]);
