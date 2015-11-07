angular.module('exampleApp')

.controller('ExampleCtrl', [
                    '$scope', '$location', '$templateCache', 'exampleRoutes',
function ExampleCtrl($scope,   $location,   $templateCache,   exampleRoutes) {

  $scope.linkList = angular.copy(exampleRoutes);

  // $scope.title = titleMap[key];

  $scope.source = null;
  $scope.subSource = null;

  $scope.getNavName = function (link) {
    if (link.indexOf('hljs-') < 0) {
      return 'basic';
    }
    return link.substr(1).replace('hljs-', '');
  };

  $scope.toggleSource = function (target) {
    target = target || 'source';

    if ($scope[target] === null) {
      $scope[target] = $templateCache.get('partials' + $scope.path + '.html')[1];
    }
    else {
      $scope[target] = null;
    }
  };

  $scope.$on('$routeChangeSuccess', function () {
    $scope.path = $location.path();
    $scope.disabled = false;

    $scope.source = null;
  });
}])

.controller('InterpolateExampleCtrl', [
                               '$scope',
function InterpolateExampleCtrl($scope) {

  $scope.name = 'Robin';
  $scope.job = 'Front-end Engineer';

}]);
