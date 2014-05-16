CMS.controller('account', ['$scope', '$routeParams', '$location', '$cookies','OpenDisplayAPI','$alert','gettextCatalog', 
function($scope, $routeParams, $location, $cookies, OpenDisplayAPI, $alert,gettextCatalog) {
     $scope.Account = {};
     $scope.OpenDisplayAPI = OpenDisplayAPI;
     $scope.Lang = [
        'English',
        'Nederlands'
      ];
  
     $scope.GetUserInfo = function (){
         OpenDisplayAPI.Run(0,"Account","Info", { }, function(Json, Token){
            $scope.Account = Json;
         }, function(Code, Message){ 
           $alert({title: gettextCatalog.getString('API Error'), 
           content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
           placement: 'top-right', type: 'info', show: true, duration: 3});
         },function(data, status, headers, config){ 
           $alert({title: 'Connection error', 
           content: "Error connecting to the server code: "+status, 
           placement: 'top-right', type: 'info', show: true, duration: 3});
         });
     };
     
     $scope.GetUserInfo();
   
   
     $scope.bytesToSize = function(bytes) {
       var k = 1000;
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
       if (bytes === 0) return '0 Bytes';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)),10);
       return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
     }
     
     $scope.SaveAccountInfo = function(){
         OpenDisplayAPI.Run(0,"Account","Update", $scope.Account.Info, function(Json, Token){
             if($scope.Account.Info.Lang == "Nederlands"){
              gettextCatalog.currentLanguage = 'nl';
             }else{
              gettextCatalog.currentLanguage = 'en';
             }
         
            $alert({title: gettextCatalog.getString('System'), 
            content: gettextCatalog.getString("Data saved!"), 
            placement: 'top-right', type: 'success', show: true, duration: 3});
         }, function(Code, Message){ 
           $alert({title: gettextCatalog.getString('API Error'), 
           content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
           placement: 'top-right', type: 'info', show: true, duration: 3});
         },function(data, status, headers, config){ 
           $alert({title: 'Connection error', 
           content: "Error connecting to the server code: "+status, 
           placement: 'top-right', type: 'info', show: true, duration: 3});
         });
     }
     
     
     $scope.ChangePassword = function(){
             OpenDisplayAPI.Run(0,"Account","UpdatePassword", $scope.Account.Password, function(Json, Token){
                $alert({title: 'Action', 
                content: gettextCatalog.getString("Password changed!"), 
                placement: 'top-right', type: 'success', show: true, duration: 3});
             }, function(Code, Message){ 
               $alert({title: gettextCatalog.getString('API Error'), 
               content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
               placement: 'top-right', type: 'info', show: true, duration: 3});
             },function(data, status, headers, config){ 
               $alert({title: 'Connection error', 
               content: "Error connecting to the server code: "+status, 
               placement: 'top-right', type: 'info', show: true, duration: 3});
             });

         
     }
     
     $scope.loadWallet = function(){
       newwindow=window.open($scope.OpenDisplayAPI.ServerURL+"/wallet.html?SID="+$cookies.Token,'Wallet','height=768,width=1024');
	      if (window.focus) {newwindow.focus()}
     }
}]);