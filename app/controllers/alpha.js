CMS.controller('alpha', ['$scope', '$routeParams', '$location', '$cookies','$timeout','OpenDisplayAPI','Playlist','GlobalState','$interval','$alert', 'gettextCatalog',
function($scope, $routeParams, $location, $cookies, $timeout,OpenDisplayAPI,Playlist,GlobalState,$interval,$alert,gettextCatalog) {

   $scope.EnableAlpha = function(){ 
      $cookies.alpha = "true";
   };
   
   $scope.DisableAlpha = function(){ 
      $cookies.alpha = null;
   };

}]);