CMS.directive('ipSwitcher', function(){
  return {
    restrict : 'A',
    require :  'ngModel',
    templateUrl : 'switcher.html',
    scope : true,
    replace : true,
    controller : function($scope, $attrs){
       $scope.switchVal=function(){
        $attrs.ngModel = !$scope.$eval($attrs.ngModel);
        $scope.myboolean = !$scope.myboolean;
       };
       
      
       
    },
    link : function(scope, elem, attrs){
      scope.title='Hello';
      myboolean = true;
    }
  };
});