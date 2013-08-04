var app = angular.module('plunkSource', ['ngSelect', 'hljs']);

app.config(function ($routeProvider) {
  $routeProvider
  .when('/:plunkId', {
    templateUrl: 'main.html',
    controller: 'PlunkCtrl'
  })
  .otherwise({
    redirectTo: '/OPxzDu'
  });
});

app.factory('plunkData', function($http) {
  return function (plunkId) {
    var api = "http://api.plnkr.co/plunks/";
    return $http.get(api + plunkId)
      .then(function (res) {
        return res.data;
      });
  };
});

app.directive('plunkSource', function (plunkData) {
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
});

app.controller('PlunkCtrl', function($scope, $routeParams) {

  $scope.plunkId = $routeParams.plunkId;

});
