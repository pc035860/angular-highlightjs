angular.module('plunkSource', ['ngSelect', 'hljs'])

.constant('psConst', {
  AVAILABLE_THEMES: [
    'arta', 'ascetic', 'brown_paper', 'dark', 'default',
    'docco', 'far', 'foundation', 'github', 'googlecode', 'idea', 
    'ir_black', 'magula', 'mono-blue', 'monokai', 'monokai_sublime',
    'obsidian', 'pojoaque', 'railscasts', 'rainbow', 'school_book',
    'solarized_dark', 'solarized_light', 'sunburst', 'tomorrow-night-blue',
    'tomorrow-night-bright', 'tomorrow-night-eighties', 'tomorrow-night',
    'tomorrow', 'vs', 'xcode', 'zenburn'
  ]
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
    templateUrl: 'plunk-source-template',
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

  $scope.containerTheme = 'light';

  $scope.highlightTheme = 'default';
  angular.forEach($routeParams.options.split(/\//), function (v) {
    if (v != '' && psConst.AVAILABLE_THEMES.indexOf(v) >= 0) {
      $scope.highlightTheme = v;
    }
  });

});
