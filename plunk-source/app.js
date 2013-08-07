angular.module('plunkSource', ['ngSelect', 'hljs'])

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
  .when('/:plunkId*options', {
    templateUrl: 'main.html',
    controller: 'PlunkCtrl'
  })
  .otherwise({
    redirectTo: '/OPxzDu'
  });
})

.factory('plunkData', function($http) {
  return function (plunkId) {
    var api = "http://api.plnkr.co/plunks/";
    return $http.get(api + plunkId)
      .then(function (res) {
        return res.data;
      });
  };
})

.directive('plunkSource', function (plunkData) {
  return {
    restrict: 'EA',
    scope: {
      plunkId: "@plunkSource"
    },
    templateUrl: 'plunk-source-template.html',
    link: function(scope, iElm, iAttrs) {
      scope.fileIndex = null;
      scope.currentFilename = null;
      scope.files = [];

      scope.$watch('plunkId', function (newId, oldId) {
        if (angular.isString(newId) && newId) {
          scope.fileIndex = {};
          scope.currentFilename = null;
          scope.files.length = 0;

          plunkData(newId)
          .then(function (data) {
            angular.forEach(data.files, function (fileInfo, name) {
              var obj = {
                name: name,
                content: fileInfo.content
              };
              scope.files.push(obj);
              scope.fileIndex[name] = obj;
            });

            scope.currentFilename = scope.files[0].name;
          });
        }

      });
    }
  };
})

.controller('PlunkCtrl', function($scope, $routeParams, psConst) {

  $scope.plunkId = $routeParams.plunkId;

  $scope.containerTheme = 'dark';

  $scope.highlightTheme = 'default';
  angular.forEach($routeParams.options.split(/\//), function (v) {
    if (v != '' && v in psConst.THEME_MAP) {
      $scope.highlightTheme = v;

      $scope.containerTheme = psConst.THEME_MAP[v];
    }
  });

});
