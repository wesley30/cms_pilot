CMS.controller('main', ['$scope', '$routeParams', '$location', '$cookies','$rootScope','OpenDisplayAPI','$alert','$timeout','$modal','gettextCatalog',
function($scope, $routeParams, $location, $cookies, $rootScope, OpenDisplayAPI, $alert,$timeout, $modal, gettextCatalog) {
      
      $scope.OpenDisplayApiLink = OpenDisplayAPI;
      $scope.AccountInfo    = {};
      $scope.AccountInfo.UserName = "";
      $scope.TempUsername    = "";
      $scope.LoadContent     = false;
      $scope.EditeTheme      = 0;
      $scope.EditorModal     = null; 
      $scope.gettextCatalog_ = gettextCatalog;  
      $scope.LoadTransLate   = false;   
      $scope.LoadTransLateData   = "";
         
      $scope.$watch(function() { 
              return OpenDisplayAPI.authorised();
          }, function(newValue, oldValue) { 
              if(newValue){               
                OpenDisplayAPI.Run(0,"Account","Info", {}, function(Json, Token){
                      $scope.AccountInfo = Json.Info;
                      
                      if($scope.TempUsername != "" && $scope.TempUsername != Json.Info.UserName)
                          location.reload();
                      
                      $scope.TempUsername = Json.Info.UserName;
                      
                      if(Json.Stats.Devices == 0){
                        if($cookies.NewDeviceOnce == ""){
                          $location.path( "/newdevice" );
                        }
                      }
                      
                      if($scope.AccountInfo.Lang == "Nederlands"){
                        gettextCatalog.currentLanguage = 'nl';
                      }else{
                        gettextCatalog.currentLanguage = 'en';
                      }
                      
                   }, function(Code, Message){ 
                     $alert({title: gettextCatalog.getString('API Error'), 
                     content: "Error Code ["+Code+"] "+Message, 
                     placement: 'top-right', type: 'info', show: true});
                   },function(data, status, headers, config){ 
                     $alert({title: 'Connection error', 
                     content: "Error connecting to the server code: "+status, 
                     placement: 'top-right', type: 'info', show: true});
                   });
              }  
          });
         
    $scope.GetLangObject = function(){
          $scope.LoadTransLate = true;
          $scope.LoadTransLateData = $scope.gettextCatalog_.CreateJavascript("nl");
          
    } 
       
       
    $scope.LaunchEditor = function (ID) {
         $scope.EditeTheme = ID;
         $scope.EditorModal = $modal({scope: $scope, template: 'app/pages/EditorType.html'});      
    }  
    
    $scope.DesignEditor = function(ID){
      if($cookies.alpha == "true"){ 
       $scope.childwin = window.open('http://www.secure.open-display.com/editor/editor.html?TID='+ID+'&Token='+$cookies.Token+'&SelectLang='+$scope.gettextCatalog_.currentLanguage+"&alpha=true", 'Editor', 'Editor', 'fullscreen=yes,menubar=no,scrollbars=no,toolbar=no,location=no,resizable=no,titlebar=no,status=no');
      }else{ 
       $scope.childwin = window.open('http://www.secure.open-display.com/editor/editor.html?TID='+ID+'&Token='+$cookies.Token+'&SelectLang='+$scope.gettextCatalog_.currentLanguage, 'Editor', 'Editor', 'fullscreen=yes,menubar=no,scrollbars=no,toolbar=no,location=no,resizable=no,titlebar=no,status=no');
      }    
      $scope.childwin.moveTo(0, 0);
    	$scope.childwin.resizeTo(screen.availWidth, screen.availHeight);
      $scope.EditorModal.hide();
    }
    
    $scope.ProductEditor = function(ID){
      if($cookies.alpha == "true"){ 
          $scope.childwin2 = window.open('http://www.secure.open-display.com/editor/productEditor.html?TID='+ID+'&Token='+$cookies.Token+'&SelectLang='+$scope.gettextCatalog_.currentLanguage+"&alpha=true", 'Editor', 'Editor', 'fullscreen=yes,menubar=no,scrollbars=no,toolbar=no,location=no,resizable=no,titlebar=no,status=no');
      }else{ 
          $scope.childwin2 = window.open('http://www.secure.open-display.com/editor/productEditor.html?TID='+ID+'&Token='+$cookies.Token+'&SelectLang='+$scope.gettextCatalog_.currentLanguage, 'Editor', 'Editor', 'fullscreen=yes,menubar=no,scrollbars=no,toolbar=no,location=no,resizable=no,titlebar=no,status=no');   	
      }
      $scope.childwin2.moveTo(0, 0);
    	$scope.childwin2.resizeTo(screen.availWidth, screen.availHeight);
      $scope.EditorModal.hide();
    }
       
    if($cookies.Token){
        $scope.LoadContent = true;
    }else{
     $timeout(function (){
        $scope.LoadContent = true;
     },3000);
    }
}]);