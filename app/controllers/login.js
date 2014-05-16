CMS.controller('login', ['$scope', '$routeParams', '$location', '$cookies','$rootScope','OpenDisplayAPI', function($scope, $routeParams, $location, $cookies, $rootScope, OpenDisplayAPI) {
     
     $cookies.Token = $routeParams.Token.replace("&Window=true","");
     $scope.OpenDisplayAPI = OpenDisplayAPI;
     
     if($routeParams.Token != ""){
       $scope.OpenDisplayAPI.ForceAuthorised();
     }
     
     //console.log("Window:"+location.search.split('Window=')[1]);
     
     if(location.search.split('Window=')[1] == undefined){ 
        $location.path( "/home" );
     }
     
}]);