angular.module('plunkSource', ['ngSelect', 'hljs'])

.factory('_apiPlunkData', function($http) {
  return function (plunkId) {
    var api = "http://api.plnkr.co/plunks/";
    return $http.get(api + plunkId)
      .then(function (res) {
        return res.data;
      });
  };
})

// ref: https://github.com/angular/code.angularjs.org/blob/master/1.1.5/docs/js/docs.js#L263
.factory('_formPostData', function ($document) {
  return function(url, fields) {
    var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
    angular.forEach(fields, function(field) {
      var name = field.name,
          value = field.value;

      var input = angular.element('<input type="hidden" name="' +  name + '">');
      input.attr('value', value);
      form.append(input);
    });
    $document.find('body').append(form);
    form[0].submit();
    form.remove();
  };
})

// ref: https://github.com/angular/code.angularjs.org/blob/master/1.1.5/docs/js/docs.js#L277
.factory('_openPlunker', function (_formPostData) {
  return function (plunkData) {
    var postData = [];

    angular.forEach(plunkData.files, function (file) {
      postData.push({
        name: 'files[' + file.filename + ']',
        value: file.content
      });
    });

    angular.forEach(plunkData.tags, function (tag) {
      postData.push({
        name: 'tags[]',
        value: tag
      });
    });

    postData.push({
      name: 'private',
      value: true
    });
    postData.push({
      name: 'description',
      value: plunkData.description
    });

    _formPostData('http://plnkr.co/edit/?p=preview', postData);
  };
})

.directive('plunkSource', function (_apiPlunkData, _openPlunker) {
  return {
    restrict: 'EA',
    scope: {
      plunkId: "@plunkSource"
    },
    templateUrl: 'plunk-source-template.html',
    link: function(scope, iElm, iAttrs) {
      var _plunkData = null;

      scope.fileIndex = null;
      scope.currentFilename = null;
      scope.files = [];

      scope.$watch('plunkId', function (newId, oldId) {
        if (angular.isString(newId) && newId) {
          scope.fileIndex = {};
          scope.currentFilename = null;
          scope.files.length = 0;

          _apiPlunkData(newId)
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

            // save plunk data
            _plunkData = data;
          });
        }

      });

      scope.editOnPlunker = function () {
        _openPlunker(_plunkData);
      };
    }
  };
});
