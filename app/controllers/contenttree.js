CMS.controller('contenttree', ['$scope', '$routeParams', '$location', '$cookies','$rootScope','OpenDisplayAPI','Playlist','$alert','GlobalState','$modal','gettextCatalog',
function($scope, $routeParams, $location, $cookies, $rootScope, OpenDisplayAPI, Playlist,$alert,GlobalState,$modal,gettextCatalog) {
      $rootScope.Flow          = true;
      $scope.PlaylistSerivce   = Playlist;
      
      $scope.GlobalState       = GlobalState;
      $scope.CurrentNode       = 0;
      $scope.CurrentNodeInfo   = {};
      $scope.NewNodeName       = "";
      $scope.NewNodeModal      = null;
      $scope.MoveNodeModal     = null;
      $scope.RenameNodeModal   = null;
      
      
      $scope.FolderMenu = [
      {
        "text": gettextCatalog.getString("New folder"),
        "click": "NewNode()",
        "href": "#deviceview"
      },
      {
        "text": gettextCatalog.getString("Rename folder"),
        "click": "RenameFolderPopUp()",
        "href": "#deviceview"
      },{
        "text": gettextCatalog.getString("Move folder"),
        "click": "MoveFolderPopUp()",
        "href": "#deviceview"
      },{
        "text": gettextCatalog.getString("Delete Folder"),
        "click": "DeleteNode()",
        "href": "#deviceview"
      }
    ];
    
    $scope.FolderMenuHome = [
      {
        "text": gettextCatalog.getString("New folder"),
        "click": "NewNode()",
        "href": "#deviceview"
      }
    ];
    
    $scope.NewNode = function(){ 
        $scope.NewNodeName = "";
        $scope.NewNodeModal = $modal({scope: $scope, template: 'app/pages/NodeTemplates/NewNode.html'});
    }
    
    $scope.CreateNewNode = function(Name,ParentID){
       OpenDisplayAPI.Run(0,"ContentTree","New", { Name:Name, ParentID:ParentID}, function(Json, Token){
              $scope.LoadContentTree();  
              $scope.PlaylistSerivce.ClearItems();
              $scope.PlaylistSerivce.AddToList(0,$scope.CurrentNode);
              
              $scope.NewNodeModal.hide();
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
     
      $scope.DeleteNode = function(){
            var r=confirm(gettextCatalog.getString("Are you sure you want to remove this folder?"));
            if (r==true) {
             OpenDisplayAPI.Run(0,"ContentTree","Remove", { ID: $scope.CurrentNode,  }, function(Json, Token){
                       $alert({title: gettextCatalog.getString('System'), 
                             content: gettextCatalog.getString("Folder removed"), 
                           placement: 'top-right', type: 'success', show: true, duration: 3});
                             
                            $scope.LoadContentTree();  
                            $scope.PlaylistSerivce.ClearItems();
                            $scope.PlaylistSerivce.AddToList(0,$scope.CurrentNode);
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
      }
      
      $scope.MoveFolderPopUp = function(){ 
         $scope.MoveNodeModal = $modal({scope: $scope, template: 'app/pages/NodeTemplates/MoveNode.html'});
      }
      
      $scope.MoveNode = function(ParentID){ 
          OpenDisplayAPI.Run(0,"ContentTree","Update", { ID:$scope.CurrentNodeInfo.ID,Name:$scope.CurrentNodeInfo.Name, ParentID:ParentID }, function(Json, Token){
              $scope.LoadContentTree();  
              $scope.PlaylistSerivce.ClearItems();
              $scope.PlaylistSerivce.AddToList(0,$scope.CurrentNode);  
              
              $scope.MoveNodeModal.hide();    
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
      
      $scope.RenameFolderPopUp = function(){ 
         $scope.RenameNodeModal = $modal({scope: $scope, template: 'app/pages/NodeTemplates/RenameNode.html'});
      }
      
      $scope.RenameNode = function(){ 
         OpenDisplayAPI.Run(0,"ContentTree","Update", { ID:$scope.CurrentNodeInfo.ID,Name:$scope.CurrentNodeInfo.Name, ParentID:$scope.CurrentNodeInfo.ParentID }, function(Json, Token){
              $scope.LoadContentTree();  
              $scope.PlaylistSerivce.ClearItems();
              $scope.PlaylistSerivce.AddToList(0,$scope.CurrentNode);  
              
              $scope.RenameNodeModal.hide();    
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
      
      $scope.LoadContentTree = function(){
          OpenDisplayAPI.Run(0,"ContentTree","List", {}, function(Json, Token){
              $scope.GlobalState.ContentTreeList = Json;
              $scope.GlobalState.ContentTreeList.Selected = "btn-info";
              $scope.SelectContentTree(0);         
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
      
      $scope.FindContentTree = function(Dirs, ID){
          var arrayLength = Dirs.length;
          for (var i = 0; i < arrayLength; i++) {
             if(Dirs[i].Node.ID == ID){
               Dirs[i].Node.Selected = "btn-info";
               $scope.CurrentNode = ID;
               $scope.CurrentNodeInfo = angular.copy(Dirs[i].Node);
             }else{
               Dirs[i].Node.Selected = "";
             }
             
             $scope.FindContentTree(Dirs[i].Nodes,ID);
          }
      }
      
      $scope.SelectContentTree = function (ID){
          if(ID != $scope.CurrentNode){
              $scope.CurrentNode = 0;
              $scope.GlobalState.ContentTreeList.Selected = "";
             
             if(ID == 0){
               $scope.GlobalState.ContentTreeList.Selected = "btn-info";
               $scope.CurrentNodeInfo.ID = 0;
               $scope.CurrentNodeInfo.ParentID = "";
               $scope.CurrentNodeInfo.Name = gettextCatalog.getString("Home Folder");
             }
             
             $scope.FindContentTree($scope.GlobalState.ContentTreeList,ID);
             
             $scope.PlaylistSerivce.ClearItems();
             $scope.PlaylistSerivce.AddToList(0,$scope.CurrentNode);
             
             $scope.GlobalState.ContentTreeSelected = $scope.CurrentNode;
           }
      }
      

      if($scope.GlobalState.ContentTreeList.length == 0){
        $scope.LoadContentTree();  
        $scope.PlaylistSerivce.ClearItems();
        $scope.PlaylistSerivce.AddToList(0,$scope.CurrentNode);
      }else{
        $scope.CurrentNode =  $scope.GlobalState.ContentTreeSelected;
        $scope.PlaylistSerivce.ClearItems();
        $scope.PlaylistSerivce.AddToList(0,$scope.CurrentNode);
      }        
}]);