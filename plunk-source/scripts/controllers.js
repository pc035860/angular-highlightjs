angular.module('plunkSourceApp')

.controller('MainCtrl', function($scope, $stateParams, $state, psConst) {

  var _isEmptyObj = (function () {
    var emptyObj = {};
    return function (obj) {
      return angular.equals(obj, emptyObj);
    };
  }());

  $scope.$stateParams = $stateParams;
  $scope.$watch('$stateParams', function (params) {

    if (!_isEmptyObj(params)) {
      $scope.plunkId = $stateParams.plunkId;

      var options = angular.copy(params);
      delete options.plunkId;
      $scope.options = options;

      $scope.containerTheme = 'light';
      $scope.highlightTheme = 'default';
      if ($scope.options.theme in psConst.THEME_MAP) {
        $scope.highlightTheme = $scope.options.theme;

        $scope.containerTheme = psConst.THEME_MAP[$scope.options.theme];
      }
    }

  }, true);

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
