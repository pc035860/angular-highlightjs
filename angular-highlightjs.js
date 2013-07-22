angular.module('ngHljs', [])

.controller('NgHljsCtrl', [
         '$timeout',
function NgHljsCtrl($timeout) {
  var ctrl = this;

  var _elm = null;

  ctrl.init = function (codeElm) {
    _elm = codeElm;
  };

  ctrl.highlight = function (code) {
    if (!_elm) {
      return;
    }
    _elm.text(code);

    $timeout(function () {
      hljs.highlightBlock(_elm[0]);
    });
  };

  ctrl.clear = function () {
    if (!_elm) {
      return;
    }
    _elm.text('');
  };

  ctrl.release = function () {
    _elm = null;
  };
}])

.directive('ngHljs', [function () {
  return {
    restrict: 'EA',
    controller: 'NgHljsCtrl',
    compile: function(tElm, tAttrs, transclude) {
      // get static code
      // strip the starting "new line" character
      var staticCode = tElm[0].innerHTML.replace(/^\r\n|\r|\n/, '');

      // put template
      tElm.html('<pre><code></code></pre>');

      return function postLink(scope, iElm, iAttrs, ctrl) {
        ctrl.init(iElm.find('code'));

        if (staticCode) {
          ctrl.highlight(staticCode);
        }

        scope.$on('$destroy', function () {
          ctrl.release();
        });
      };
    }
  };
}])

.directive('source', [function () {
  return {
    require: 'ngHljs',
    restrict: 'A',
    link: function(scope, iElm, iAttrs, ctrl) {

      scope.$watch(iAttrs.source, function (newCode, oldCode) {
        if (newCode && newCode !== oldCode) {
          ctrl.highlight(newCode);
        }
        else {
          ctrl.clear();
        }
      });
    }
  };
}])

.directive('fetch', [
         '$http', '$templateCache', '$q',
function ($http,   $templateCache,   $q) {
  return {
    require: 'ngHljs',
    restrict: 'A',
    compile: function(tElm, tAttrs, transclude) {
      var srcExpr = tAttrs.fetch;

      return function postLink(scope, iElm, iAttrs, ctrl) {
        var changeCounter = 0;

        scope.$watch(srcExpr, function (src) {
          var thisChangeId = ++changeCounter;

          if (src && angular.isString(src)) {
            var templateCachePromise, dfd;

            templateCachePromise = $templateCache.get(src);
            if (!templateCachePromise) {
              dfd = $q.defer();
              $http.get(src, {cache: $templateCache}).success(function (code) {
                if (thisChangeId !== changeCounter) {
                  return;
                }
                dfd.resolve(code);
              }).error(function() {
                if (thisChangeId === changeCounter) {
                  ctrl.clear();
                }
                dfd.resolve();
              });
              templateCachePromise = dfd.promise;
            }
            
            $q.when(templateCachePromise)
            .then(function (code) {
              if (!code) {
                return;
              }

              // $templateCache from $http
              if (angular.isArray(code)) {
                code = code[1];
              }

              code = code.replace(/^\r\n|\r|\n/, '');
              ctrl.highlight(code);
            });
          }
          else {
            ctrl.clear();
          }
        });
      };
    }
  };
}]);
