angular.module('plunkSource', ['ngSelect', 'hljs'])

.factory('_apiPlunkData', function($http) {
  return function (plunkId) {
    var api = "http://api.plnkr.co/plunks/",
        config = {
          cache: true
        };
    return $http.get(api + plunkId, config)
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

.directive('plunkSource', function (_apiPlunkData, _openPlunker, $q) {
  return {
    restrict: 'EA',
    scope: {
      plunkId: "@plunkSource",
      config: "=plunkSourceOptions"
    },
    templateUrl: 'plunk-source-template.html',
    link: function(scope, iElm, iAttrs) {
      var _plunkData = null,
          _config = null,
          // first highlight flag
          _highlighted = false;

      scope.fileIndex = null;
      scope.files = [];

      scope.model = {
        currentFilename: null,
        specifiedFileContent: null
      };

      scope.editOnPlunker = function () {
        _openPlunker(_plunkData);
      };

      scope.onHighlight = function () {
        _highlighted = true;

        _digestConfig(_config);
      };

      scope.$watch('plunkId', function (newId, oldId) {
        if (angular.isString(newId) && newId) {
          scope.fileIndex = {};
          scope.model.currentFilename = null;
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

            scope.model.currentFilename = scope.files[0].name;

            // save plunk data
            _plunkData = data;
          });
        }
      });

      scope.$watch('config', function (config) {
        if (angular.isDefined(config) && angular.isObject(config)) {
          _config = angular.copy(config);

          // process config
          
          angular.forEach(_config, function (k, v) {
            switch (v) {
              case 'result':
                _config[v] = scope.$eval(k);
                break;
            }
          });

          if (_highlighted) {
            _digestConfig(_config);
          }
        }
      }, true);

      function _digestConfig(config) {
        if (!config) {
          return;
        }

        if (config.fontsize) {
          iElm.find('pre').css('font-size', config.fontsize + 'px');
        }

        scope.model.specifiedFileContent = null;
        if (config.file && config.file in scope.fileIndex) {
          scope.model.specifiedFileContent = scope.fileIndex[config.file].content;

          if (config.line) {
            var buf = config.line.split('-'),
                fromLine, toLine;

            if (buf.length < 2) {
              fromLine = toLine = Math.max(1, parseInt(buf[0], 10));
            }
            else {
              fromLine = buf[0];
              toLine = buf[1];
            }

            var lines = scope.model.specifiedFileContent.match(/^.*$/mg);
            if (lines) {
              scope.model.specifiedFileContent = lines.slice(fromLine - 1, toLine).join('\n');
            }
          }
        }
      }
    }
  };
});
