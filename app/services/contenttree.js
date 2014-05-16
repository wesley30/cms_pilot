CMS.service('ContentTree',['$http', '$cookies', '$location', '$alert', 'OpenDisplayAPI', function ($http, $cookies, $location, $alert, OpenDisplayAPI){
    
     this.List = [];
     var NodeList = [];
    
     this.ListNodes = function () {
          return NodeList;
     }
     
     this.LoadContentTree = function(){
          OpenDisplayAPI.Run(0,"ContentTree","List", {}, function(Json, Token){
              NodeList = Json;
                            
              console.log(Json);
           }, function(Code, Message){ 
             $alert({title: 'API Error', 
             content: "Error Code ["+Code+"] "+Message, 
             placement: 'top', type: 'info', show: true, duration: 3});
           },function(data, status, headers, config){ 
             $alert({title: 'Connection error', 
             content: "Error connecting to the server code: "+status, 
             placement: 'top', type: 'info', show: true, duration: 3});
           });
      }    
}]);