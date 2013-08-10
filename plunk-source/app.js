angular.module('plunkSourceApp', ['plunkSource'])

.constant('psConst', {
  THEME_MAP: {
    'arta': 'dark',
    'ascetic': 'light',
    'brown_paper': 'dark',
    'default': 'light',
    'docco': 'light',
    'far': 'dark',
    'foundation': 'light',
    'github': 'light',
    'googlecode': 'light',
    'idea': 'light',
    'ir_black': 'dark',
    'magula': 'light',
    'mono-blue': 'light',
    'monokai': 'dark',
    'monokai_sublime': 'dark',
    'obsidian': 'dark',
    'pojoaque': 'dark',
    'railscasts': 'dark',
    'rainbow': 'dark',
    'school_book': 'dark',
    'solarized_dark': 'dark',
    'solarized_light': 'light',
    'sunburst': 'dark',
    'tomorrow-night-blue': 'dark',
    'tomorrow-night-bright': 'dark',
    'tomorrow-night-eighties': 'dark',
    'tomorrow-night': 'dark',
    'tomorrow': 'light',
    'vs': 'light',
    'xcode': 'light',
    'zenburn': 'dark'
  }
})

.config(function ($routeProvider) {
  $routeProvider
  .when('/plunk/:plunkId*options', {
    templateUrl: 'main.html',
    controller: 'PlunkCtrl'
  })
  .otherwise({
    redirectTo: '/plunk/OPxzDu'
  });
})

.controller('PlunkCtrl', function($scope, $routeParams, psConst) {

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
