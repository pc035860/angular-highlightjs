/*global angular, hljs*/

function shouldHighlightStatics(attrs) {
  var should = true;
  angular.forEach([
    'source', 'include'
  ], function (name) {
    if (attrs[name]) {
      should = false;
    }
  });
  return should;
}

var ngModule = angular.module('hljs', []);

/**
 * hljsService service
 */
ngModule.provider('hljsService', function () {
  var _hljsOptions = {};

  return {
    setOptions: function (options) {
      angular.extend(_hljsOptions, options);
    },
    getOptions: function () {
      return angular.copy(_hljsOptions);
    },
    $get: function () {
      (hljs.configure || angular.noop)(_hljsOptions);
      return hljs;
    }
  };
});

/**
 * hljsCache service
 */
ngModule.factory('hljsCache', [
         '$cacheFactory',
function ($cacheFactory) {
  return $cacheFactory('hljsCache');
}]);

/**
 * HljsCtrl controller
 */
ngModule.controller('HljsCtrl', [
                  'hljsCache', 'hljsService', '$interpolate', '$window', '$log',
function HljsCtrl (hljsCache,   hljsService,   $interpolate,   $window,   $log) {
  var ctrl = this;

  var _elm = null,
      _lang = null,
      _code = null,
      _interpolateScope = false,
      _stopInterpolateWatch = null,
      _hlCb = null;

  ctrl.init = function (codeElm) {
    _elm = codeElm;
  };

  ctrl.setInterpolateScope = function (scope) {
    _interpolateScope = scope;

    if (_code) {
      ctrl.highlight(_code);
    }
  };

  ctrl.setLanguage = function (lang) {
    _lang = lang;

    if (_code) {
      ctrl.highlight(_code);
    }
  };

  ctrl.highlightCallback = function (cb) {
    _hlCb = cb;
  };

  ctrl._highlight = function (code) {
    $log.debug('# ctrl._highlight #');

    if (!_elm) {
      return;
    }

    var res, cacheKey;

    _code = code;

    if (_lang) {
      // language specified
      cacheKey = ctrl._cacheKey(_lang, _code);
      res = hljsCache.get(cacheKey);

      if (!res) {
        res = hljsService.highlight(_lang, hljsService.fixMarkup(_code), true);
        hljsCache.put(cacheKey, res);
      }
    }
    else {
      // language auto-detect
      cacheKey = ctrl._cacheKey(_code);
      res = hljsCache.get(cacheKey);

      if (!res) {
        res = hljsService.highlightAuto(hljsService.fixMarkup(_code));
        hljsCache.put(cacheKey, res);
      }
    }

    if (_interpolateScope) {
      (_stopInterpolateWatch||angular.noop)();

      var interpolateFn = $interpolate(res.value);
      _stopInterpolateWatch = _interpolateScope.$watch(interpolateFn, function (newVal, oldVal) {
        if (newVal !== oldVal) {
          _elm.html(newVal);
        }
      });
      _elm.html(interpolateFn(_interpolateScope));
    }
    else {
      _elm.html(res.value);
    }

    // language as class on the <code> tag
    _elm.addClass(res.language);

    if (_hlCb !== null && angular.isFunction(_hlCb)) {
      _hlCb();
    }
  };
  ctrl.highlight = debounce(ctrl._highlight, 20, true);

  ctrl.clear = function () {
    if (!_elm) {
      return;
    }
    _code = null;
    _elm.text('');
  };

  ctrl.release = function () {
    _elm = null;
    _interpolateScope = null;
    (_stopInterpolateWatch||angular.noop)();
    _stopInterpolateWatch = null;
  };

  ctrl._cacheKey = function () {
    var args = Array.prototype.slice.call(arguments),
        glue = "!angular-highlightjs!";
    return args.join(glue);
  };


  // http://davidwalsh.name/function-debounce
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      $window.clearTimeout(timeout);
      timeout = $window.setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
}]);


var hljsDir, interpolateDirFactory, languageDirFactory, sourceDirFactory, includeDirFactory;

/**
 * hljs directive
 */
hljsDir = ['$parse', function ($parse) {
  return {
    restrict: 'EA',
    controller: 'HljsCtrl',
    compile: function(tElm, tAttrs, transclude) {
      // get static code
      // strip the starting "new line" character
      var staticHTML = tElm[0].innerHTML.replace(/^(\r\n|\r|\n)/m, ''),
          staticText = tElm[0].textContent.replace(/^(\r\n|\r|\n)/m, '');

      // put template
      tElm.html('<pre><code class="hljs"></code></pre>');

      return function postLink(scope, iElm, iAttrs, ctrl) {
        var escapeCheck;

        if (angular.isDefined(iAttrs.escape)) {
          escapeCheck = $parse(iAttrs.escape);
        } else if (angular.isDefined(iAttrs.noEscape)) {
          escapeCheck = $parse('false');
        }

        ctrl.init(iElm.find('code'));

        if (iAttrs.onhighlight) {
          ctrl.highlightCallback(function () {
            scope.$eval(iAttrs.onhighlight);
          });
        }

        if ((staticHTML || staticText) && shouldHighlightStatics(iAttrs)) {

          var code;

          // Auto-escape check
          // default to "true"
          if (escapeCheck && !escapeCheck(scope)) {
            code = staticText;
          }
          else {
            code = staticHTML;
          }

          ctrl.highlight(code);
        }

        scope.$on('$destroy', function () {
          ctrl.release();
        });
      };
    }
  };
}];

/**
 * language directive
 */
languageDirFactory = function (dirName) {
  return [function () {
    return {
      require: '?hljs',
      restrict: 'A',
      link: function (scope, iElm, iAttrs, ctrl) {
        if (!ctrl) {
          return;
        }      
        iAttrs.$observe(dirName, function (lang) {
          if (angular.isDefined(lang)) {
            ctrl.setLanguage(lang);
          }
        });
      }
    };
  }];
};

/**
 * interpolate directive
 */
interpolateDirFactory = function (dirName) {
  return [function () {
    return {
      require: '?hljs',
      restrict: 'A',
      link: function (scope, iElm, iAttrs, ctrl) {
        if (!ctrl) {
          return;
        }
        scope.$watch(iAttrs[dirName], function (newVal, oldVal) {
          if (newVal || newVal !== oldVal) {
            ctrl.setInterpolateScope(newVal ? scope : null);
          }
        });
      }
    };
  }];
};

/**
 * source directive
 */
sourceDirFactory = function (dirName) {
  return [function () {
    return {
      require: '?hljs',
      restrict: 'A',
      link: function(scope, iElm, iAttrs, ctrl) {
        if (!ctrl) {
          return;
        }

        scope.$watch(iAttrs[dirName], function (newCode, oldCode) {
          if (newCode) {
            ctrl.highlight(newCode);
          }
          else {
            ctrl.clear();
          }
        });
      }
    };
  }];
};

/**
 * include directive
 */
includeDirFactory = function (dirName) {
  return [
             '$http', '$templateCache', '$q',
    function ($http,   $templateCache,   $q) {
      return {
        require: '?hljs',
        restrict: 'A',
        compile: function(tElm, tAttrs, transclude) {
          var srcExpr = tAttrs[dirName];

          return function postLink(scope, iElm, iAttrs, ctrl) {
            var changeCounter = 0;

            if (!ctrl) {
              return;
            }

            scope.$watch(srcExpr, function (src) {
              var thisChangeId = ++changeCounter;

              if (src && angular.isString(src)) {
                var templateCachePromise, dfd;

                templateCachePromise = $templateCache.get(src);
                if (!templateCachePromise) {
                  dfd = $q.defer();
                  $http.get(src, {
                    cache: $templateCache,
                    transformResponse: function(data, headersGetter) {
                      // Return the raw string, so $http doesn't parse it
                      // if it's json.
                      return data;
                    }
                  }).success(function (code) {
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
                    // 1.1.5
                    code = code[1];
                  }
                  else if (angular.isObject(code)) {
                    // 1.0.7
                    code = code.data;
                  }

                  code = code.replace(/^(\r\n|\r|\n)/m, '');
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
  }];
};

/**
 * Add directives
 */
ngModule
.directive('hljs', hljsDir)
.directive('interpolate', interpolateDirFactory('interpolate'))
.directive('compile', interpolateDirFactory('compile'))
.directive('language', languageDirFactory('language'))
.directive('source', sourceDirFactory('source'))
.directive('include', includeDirFactory('include'));