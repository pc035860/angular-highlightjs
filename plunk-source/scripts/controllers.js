angular.module('plunkSourceApp')

.controller('MainCtrl', function($scope, $routeParams, psConst) {

  $scope.plunkId = $routeParams.plunkId;
  $scope.options = _parseOptions($routeParams.options);

  $scope.containerTheme = 'light';
  $scope.highlightTheme = 'default';
  if ($scope.options.theme in psConst.THEME_MAP) {
    $scope.highlightTheme = $scope.options.theme;

    $scope.containerTheme = psConst.THEME_MAP[$scope.options.theme];
  }

  function _parseOptions(locationHash) {
    var c = 0,
        keyBuf = null,
        output = {};
    angular.forEach(locationHash.split(/\//), function (piece) {
      if (piece != '') {
        if (c % 2 === 0) {
          // key
          keyBuf = piece;
        }
        else if (keyBuf !== null) {
          // value
          output[keyBuf] = piece;
          keyBuf = null;
        }
        c++;
      }
    });
    return output;
  }
});