var MainCtrl = function MainCtrl($scope, $parse) {
  
    $scope.editObject = '{angularjs: 1, is: 2, awesome: 3}';
    
    $scope.prettyJSON = '';
    
    $scope.tabWidth = 4;
    
    var _lastGoodResult = '';
    $scope.toPrettyJSON = function (objStr, tabWidth) {
      var obj;

      try {
        obj = $parse(objStr)({});
      }catch(e){
        // eat $parse error
        return _lastGoodResult;
      }
      
      var result = JSON.stringify(obj, null, Number(tabWidth));
      _lastGoodResult = result;
      
      return result;
    };
  
};

module.exports = MainCtrl;
