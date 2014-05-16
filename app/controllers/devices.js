CMS.controller('devices', ['$scope', '$routeParams', '$location', '$cookies','$rootScope','OpenDisplayAPI','$timeout','$alert','$aside','Playlist','GlobalState','$modal','$interval', 'gettextCatalog',
function($scope, $routeParams, $location, $cookies, $rootScope, OpenDisplayAPI, $timeout,$alert,$aside,Playlist,GlobalState,$modal,$interval, gettextCatalog) {
      $rootScope.Flow = true;
      
      $scope.Devices = {};
      $scope.Devices.Items = [];
      $scope.Devices.Count = 0;
      $scope.Search = {};
      $scope.Search.Start   = 0;
      $scope.Search.Limit   = 10;
      $scope.Search.Value   = "";
      $scope.NewDeviceView  = false;
      $scope.NewDevice      = {};
      $scope.PendingDevice = "";
      $scope.PendingDeviceInfo = "";
      $scope.PendingStatus = 0;
      $scope.SelectedDeviceInfo = {};
      $scope.DeviceSettingsSaved = false;
      $scope.SelectSwitchBool = false;
      $scope.DeviceSelected   = false;
      $scope.StatusCounter    = 0;
      
      $scope.GlobalState = GlobalState;
      $scope.Playlist    = Playlist;
      
      $scope.MoveDeviceModal = null;
      
      var Timeout              = null;
      var RegisterTimeout      = null;
      
      $scope.CurrentNode       = -1;
      $scope.CurrentNodeInfo   = {};
      $scope.NewNodeName       = "";
      $scope.NewNodeModal      = null;
      $scope.MoveNodeModal     = null;
      $scope.RenameNodeModal   = null;
      
      $scope.SelectedTemp = [];
      
      $scope.DeviceStatusUpdate = null;
      
      
      //set the cookie for new device to true
      $cookies.NewDeviceOnce = "true";
      
      
      
      $scope.FolderMenu = [
      {
        "text": gettextCatalog.getString("New folder"),
        "click": "NewNode()",
        "href": "#devices"
      },
      {
        "text": gettextCatalog.getString("Rename folder"),
        "click": "RenameFolderPopUp()",
        "href": "#devices"
      },{
        "text": gettextCatalog.getString("Move folder"),
        "click": "MoveFolderPopUp()",
        "href": "#devices"
      },{
        "text": gettextCatalog.getString("Delete Folder"),
        "click": "DeleteNode()",
        "href": "#devices"
      }
    ];
    
    $scope.FolderMenuHome = [
      {
        "text": gettextCatalog.getString("New folder"),
        "click": "NewNode()",
        "href": "#devices"
      }
    ];
    
    $scope.NewNode = function(){ 
        $scope.NewNodeName = "";
        $scope.NewNodeModal = $modal({scope: $scope, template: 'app/pages/NodeTemplates/NewNode.html'});
    }
    
    $scope.CreateNewNode = function(Name,ParentID){
       OpenDisplayAPI.Run(0,"ContentTree","New", { Name:Name, ParentID:ParentID}, function(Json, Token){
              $scope.LoadContentTree();  
              
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
              
              $scope.FilterDevices();    
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
              if($scope.CurrentNode >= 0){ 
               $scope.DeSelectAll();
               $scope.SelectSwitchBool = false;
             }
             
              $scope.CurrentNode = 0;
              $scope.GlobalState.ContentTreeList.Selected = "";
             if(ID == 0){
               $scope.GlobalState.ContentTreeList.Selected = "btn-info";
               $scope.CurrentNodeInfo.ID = 0;
               $scope.CurrentNodeInfo.ParentID = "";
               $scope.CurrentNodeInfo.Name = gettextCatalog.getString("Home Folder");
             }
             
             $scope.FindContentTree($scope.GlobalState.ContentTreeList,ID);
             
             
             $scope.GlobalState.ContentTreeSelected = $scope.CurrentNode;
             $scope.FilterDevices(0,'Name',GlobalState.SearchValueDevices);
           }
      }
     
      
      $scope.GetStatus = function(Time){
        if(Time > 0){
          var unix = Math.round(+new Date()/1000);
          
          if((unix - Time) < 900){ 
             return gettextCatalog.getString("Online");
          }else if((unix - Time) < 3600){
            return gettextCatalog.getString("Pending");
          }else{
            return gettextCatalog.getString("Offline");
          }
        }
        return gettextCatalog.getString("Offline");
     };
     
     
     $scope.OffLineFor = function(Time){ 
        if(Time > 0){
           var unix = Math.round(+new Date()/1000);
           
           if((unix - Time) > 3600){ 
               return $scope.secondsToTime((unix - Time));
           }
        }
        
        return "";
     };
     
     $scope.SelectAllDevices = function(){
        for (var i = 0; i < $scope.Devices.Items.length; i++) {
                $scope.Devices.Items[i].Selected = true;
        }
        
        $scope.CheckSelection();
     }
     
     $scope.DeSelectAll = function(){
       for (var i = 0; i < $scope.Devices.Items.length; i++) {
                $scope.Devices.Items[i].Selected = false;
        }
        
        $scope.CheckSelection();
     }
          
     $scope.CheckSelection = function(){ 
       $scope.DeviceSelected   = false;
       
       for (var i = 0; i < $scope.Devices.Items.length; i++) {
              if($scope.Devices.Items[i].Selected)
                 $scope.DeviceSelected   = true;
          }
     }
     
     $scope.SelectSwitch = function(){
        if($scope.SelectSwitchBool){
           $scope.SelectAllDevices();
        }else{ 
           $scope.DeSelectAll();
        }
     }
     
     $scope.Reboot = function(){
       var SelectedDeviceArray = [];
       
       for (var i = 0; i < $scope.Devices.Items.length; i++) {
              if($scope.Devices.Items[i].Selected)
                 SelectedDeviceArray.push($scope.Devices.Items[i].ID);
       }
       
       if(SelectedDeviceArray.length > 0){   
       var r=confirm(gettextCatalog.getString("Are you sure you want to reset the device data of these devices?"));
       if (r==true) {     
             OpenDisplayAPI.Run(0,"Devices","RebootReset", { IDS:SelectedDeviceArray, Reboot: true }, function(Json, Token){
                      $alert({title: gettextCatalog.getString('System'), 
                       content: gettextCatalog.getString("Device(s) triggered for reboot."), 
                       placement: 'top-right', type: 'success', show: true, duration: 3});
                      
                      
                      //console.log(Json);
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
       }else{ 
           $alert({title: gettextCatalog.getString('System'), 
           content: gettextCatalog.getString("Please select a device."), 
           placement: 'top-right', type: 'info', show: true, duration: 3});
       }
     }
     
     
     $scope.Reset = function(){
       var SelectedDeviceArray = [];
       
       for (var i = 0; i < $scope.Devices.Items.length; i++) {
              if($scope.Devices.Items[i].Selected)
                 SelectedDeviceArray.push($scope.Devices.Items[i].ID);
       }
       
       if(SelectedDeviceArray.length > 0){      
            var r=confirm(gettextCatalog.getString("Are you sure you want to reset the device data of these devices?"));
            if (r==true) { 
           OpenDisplayAPI.Run(0,"Devices","RebootReset", { IDS:SelectedDeviceArray, Reset: true }, function(Json, Token){
                          $alert({title: gettextCatalog.getString('System'), 
                           content: gettextCatalog.getString("Device(s) triggered for Reset."), 
                           placement: 'top-right', type: 'success', show: true, duration: 3});
                          
                          
                          //console.log(Json);
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
       }else{ 
           $alert({title: gettextCatalog.getString('System'), 
           content: gettextCatalog.getString("Please select a device."), 
           placement: 'top-right', type: 'info', show: true, duration: 3});
       }
     }
     
     $scope.MoveDevicePopUp = function(){ 
         $scope.MoveDeviceModal = $modal({scope: $scope, template: 'app/pages/NodeTemplates/MoveDevice.html'});
      }
     
     $scope.MoveDevice = function(ID){
       var SelectedDeviceArray = [];
       
       for (var i = 0; i < $scope.Devices.Items.length; i++) {
              if($scope.Devices.Items[i].Selected)
                 SelectedDeviceArray.push($scope.Devices.Items[i].ID);
       }
       
       if(SelectedDeviceArray.length > 0){      
           OpenDisplayAPI.Run(0,"Devices","SetNode", { IDS:SelectedDeviceArray, Tree: ID }, function(Json, Token){
                          $alert({title: gettextCatalog.getString('System'), 
                           content: gettextCatalog.getString("Device(s) moved."), 
                           placement: 'top-right', type: 'success', show: true, duration: 3});
                          
                          $scope.FilterDevices();
                          $scope.MoveDeviceModal.hide();
                          $scope.DeSelectAll();
                          $scope.SelectSwitchBool = false;
                          //console.log(Json);
                       }, function(Code, Message){ 
                         $alert({title: gettextCatalog.getString('API Error'), 
                         content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                         placement: 'top-right', type: 'info', show: true, duration: 3});
                       },function(data, status, headers, config){ 
                         $alert({title: 'Connection error', 
                         content: "Error connecting to the server code: "+status, 
                         placement: 'top-right', type: 'info', show: true, duration: 3});
                       });
       }else{ 
           $alert({title: gettextCatalog.getString('System'), 
           content: gettextCatalog.getString("Please select a device."), 
           placement: 'top-right', type: 'info', show: true, duration: 3});
       }
     }
     
    $scope.DeviceInfoChecker = function(){
      
      if(RegisterTimeout)
           $timeout.cancel(RegisterTimeout);
       
      if($scope.PendingDevice != ""){    
           RegisterTimeout = $timeout(function (){ 
             OpenDisplayAPI.Run(0,"Devices","Info", { ID:$scope.PendingDevice }, function(Json, Token){
                      $scope.PendingDeviceInfo = Json;
                      var Insync = false; 
                      $scope.StatusCounter++;
                       
                      try{
                        if(Json.Info != null){
                          if(Json.Info.Status.InSync){
                            $scope.PendingStatus = 2;
                          }else{
                            Insync = true;
                            $scope.PendingStatus = 2;
                          }
                        }else{
                          $scope.PendingStatus = 0;
                        }
                      }catch(e){ }
                       
                      //recheck 
                      if(!Insync){
                        $scope.DeviceInfoChecker();
                      }else{
                        $scope.FilterDevices();
                      }
                      //console.log(Json);
                   }, function(Code, Message){ 
                     //$alert({title: gettextCatalog.getString('API Error'), 
                     //content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                     //placement: 'top-right', type: 'info', show: true, duration: 3});
                   },function(data, status, headers, config){ 
                     $alert({title: 'Connection error', 
                     content: "Error connecting to the server code: "+status, 
                     placement: 'top-right', type: 'info', show: true, duration: 3});
                   });
           },4000);
      }
    }
    
    $scope.SaveDeviceSettings = function(DeviceSettings){
       var tempDeviceSettings = angular.copy(DeviceSettings.Settings);
       
       tempDeviceSettings.ID   = DeviceSettings.ID;
       tempDeviceSettings.Name = DeviceSettings.Name;
       
       if(tempDeviceSettings.IconControl == 1)
          tempDeviceSettings.IconControl = 1;
       
       OpenDisplayAPI.Run(0,"Devices","Update", tempDeviceSettings, function(Json, Token){
                       $scope.DeviceSettingsSaved = true;
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
    
    $scope.ShowDeviceSettings = function(DeviceInfo){
       $scope.DeviceInfo = DeviceInfo;
       $scope.DeviceSettingsSaved = false;
       
       $aside({scope: $scope, template: 'app/pages/DeviceSettings.html'});
    }
    
    $scope.NewDevicePage = function(){
      $scope.NewDevice.Name = "";
      $scope.NewDevice.Key1 = "";
      $scope.NewDevice.Key2 = "";
      $scope.NewDevice.Key3 = "";
      $scope.NewDevice.Key4 = "";
      $scope.PendingDevice = "";
      $scope.NewDeviceView = true;
      $scope.PendingStatus = 0;
      $scope.StatusCounter = 0;
    }
    
    $scope.PageBack = function(){
      $scope.NewDeviceView = false;
      $scope.PendingDevice = "";
    }
    
    $scope.RegisterDevice = function(Name,Key){
       OpenDisplayAPI.Run(0,"Devices","New", { Name:Name, Key:Key, Tree: $scope.CurrentNode }, function(Json, Token){
                        $alert({title: gettextCatalog.getString('System'), 
                         content: gettextCatalog.getString("New device add to your account"), 
                         placement: 'top-right', type: 'success', show: true, duration: 3});
                       
                       $scope.PendingDevice = Json.Token;
                       $scope.DeviceInfoChecker();
                       $scope.FilterDevices();
                       
                       //reset deviceoverview state
                       $scope.GlobalState.Devices = [];
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
    
    
    $scope.IsSelected = function(ID){          
      for (var i = 0; i < $scope.SelectedTemp.length; i++) {       
            if($scope.SelectedTemp[i] == ID)
            return true;
        }
        
        return false;
    }
    
      $scope.BuildSelectedList = function(){ 
         $scope.SelectedTemp = [];
         
         for (var i = 0; i < $scope.Devices.Items.length; i++) {
              if($scope.Devices.Items[i].Selected)
                 $scope.SelectedTemp.push($scope.Devices.Items[i].ID);
         }
         
         if($scope.SelectedTemp.length == 0){
           $scope.CheckSelection();
           $scope.SelectSwitchBool = false;
         }
      }
      
      $scope.FilterDevices = function(Start, Key, Value, PageLimit,AppendResults){
           var Filter = [];
           var Limit  = 100;
           var Count  = 0;
           
           if(PageLimit > 0){
               Limit = PageLimit;
           }
           
           if(Start < 0)
              Start = 0;
           
            Filter[0] = {};
            //Filter[Count].Key = "TimeStamp";
            //Filter[Count].Sort = "DESC";
           
                    
           if(Value != "" && Value != undefined){
              Filter[Count] = {};
              Filter[Count].Key = Key;
              Filter[Count].Selector = "and";
              Filter[Count].Operator = "like";
              Filter[Count].Sort = "ASC";
              Filter[Count].Value = Value;
              
              Count++;
           }
           
           
           
           Filter[Count] = {};
           Filter[Count].Key = "Tree";
           Filter[Count].Selector = "and";
           Filter[Count].Operator = "=";
           Filter[Count].Sort = "ASC";
           Filter[Count].Value = $scope.CurrentNode;
           
           if(Timeout)
           $timeout.cancel(Timeout);
           
           Timeout = $timeout(function (){
           OpenDisplayAPI.Run(0,"Devices","List", { "ResultsStart":Start,"ResultsLimit":Limit,"Filter":  Filter  }, function(Json, Token){
                      $scope.BuildSelectedList();
                      
                      if(!AppendResults){
                        $scope.Devices.Items = [];
                        $scope.Devices.Count = Json.Count;
                      }

                                         
                      for (var i = 0; i < Json.Items.length; i++) {
                           if($scope.IsSelected(Json.Items[i].ID)){
                              Json.Items[i].Selected = true;
                           }else{ 
                              Json.Items[i].Selected = false;
                           }
                              
                          $scope.Devices.Items.push(Json.Items[i]);
                      }
                   }, function(Code, Message){ 
                     $alert({title: gettextCatalog.getString('API Error'), 
                     content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                     placement: 'top-right', type: 'info', show: true, duration: 3});
                   },function(data, status, headers, config){ 
                     $alert({title: 'Connection error', 
                     content: "Error connecting to the server code: "+status, 
                     placement: 'top-right', type: 'info', show: true, duration: 3});
                   });
           }, 500);
        }
        
       $scope.RemoveDevice = function (ID,Name,idx){
          var r=confirm(gettextCatalog.getString("Are you sure you want to remove the device ") +Name+"?");
            if (r==true) {
             OpenDisplayAPI.Run(0,"Devices","Remove", { ID: ID  }, function(Json, Token){
                       $alert({title: gettextCatalog.getString('System'), 
                             content: gettextCatalog.getString("Device removed"), 
                           placement: 'top-right', type: 'success', show: true, duration: 3});
                             
                            $scope.Devices.Items.splice(idx, 1);
                            
                            // per item maak Themes.Count -1 result (loading bug solution) 16-5-2014
                            $scope.Devices.Count = $scope.Devices.Count - 1; 
                             
                             //reset deviceoverview state
                             $scope.GlobalState.Devices = [];
                             $scope.Playlist.ClearItems();
                             
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
       
     $scope.secondsToTime = function(secs){
            var days = Math.floor(secs / (60 * 60 * 24));
            
            var hours = Math.floor(secs / (60 * 60));
           
            var divisor_for_minutes = secs % (60 * 60);
            var minutes = Math.floor(divisor_for_minutes / 60);
         
            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);
            
            if(seconds < 10){ seconds = "0"+seconds; }
            if(minutes < 10){ minutes = "0"+minutes; }
            if(hours < 10){   hours = "0"+hours; }


            var obj = {
                "h": hours,
                "m": minutes,
                "s": seconds
            };
            if(days > 0){ 
               return days+" Days";
            }else{
              return hours+":"+minutes+":"+seconds;
            }
     }  
      
     $scope.IsHTMLDevice = function(Device){
        if(Device.match(/webkit/i))
           return true;
           
           return false;
     } 
      
      if($scope.GlobalState.ContentTreeList.length == 0 && $scope.GlobalState.SearchValueDevices == ""){
        $scope.LoadContentTree();  
      }else{ 
        $scope.CurrentNode = $scope.GlobalState.ContentTreeSelected;
        $scope.FilterDevices(0,'Name',GlobalState.SearchValueDevices, $scope.Devices.Items.length,false);
      }   
       
     $scope.DeviceStatusUpdate = $interval(function() {
       if($scope.CurrentNode > -1)
          $scope.FilterDevices(0,'Name',GlobalState.SearchValueDevices, $scope.Devices.Items.length,false);
     },25000);    
         
          
     $scope.$on('$destroy', function() {
        $interval.cancel($scope.DeviceStatusUpdate);
      });
}]);