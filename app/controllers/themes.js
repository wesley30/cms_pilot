CMS.controller('themes', 
['$scope', '$routeParams', '$location', '$cookies','$timeout','OpenDisplayAPI','$rootScope','$alert','$modal','$interval','gettextCatalog', 
function($scope, $routeParams, $location, $cookies, $timeout, OpenDisplayAPI, $rootScope, $alert,$modal,$interval,gettextCatalog) {
      $rootScope.Flow = true;
      $scope.Themes = {};
      $scope.Themes.Items = [];
      $scope.Themes.Count = 0;
      $scope.Search = {};
      $scope.Search.Start   = 0;
      $scope.Search.Limit   = 10;
      $scope.Search.Value   = "";
      
      $scope.NewThemeModal = null;
      $scope.NewThemeResolutions = [];
      $scope.NewThemeFolders     = [];
      $scope.UseCustomResolution = false;
      
      
      $scope.NewTheme        = {};
      $scope.NewTheme.Name   = "";
      $scope.NewTheme.DID    = 0;
      $scope.NewTheme.Width  = 1280;
      $scope.NewTheme.Height = 720;
    
      $scope.NewThemeCreated = false;
      $scope.NewThemeCreatedInfo = {};
      
      $scope.NewFolderName   = "";
      $scope.CurrentFolderInfo = {};
      $scope.CurrentFolderInfo.ID = 0;
      $scope.CurrentFolderInfo.PID = 0;
      $scope.CurrentFolderInfo.Name = gettextCatalog.getString("Home Folder");
      
      $scope.MoveFolderModal   = null;
      $scope.RenameFolderModal = null;
      $scope.MoveToFolderModal = null;
      $scope.SendThemeModal    = null;
      
      $scope.PendingImportsStatusUpdate = null;
      
      $scope.ThemesSelected   = false;
      $scope.SelectSwitchBool = false;
      
      $scope.SendThemeInfo = {};
      $scope.SendThemeInfo.UserName = "";
      $scope.SendThemeInfo.ID       = 0;
      $scope.SendThemeInfo.Name     = "";
      $scope.SendThemeInfo.Sent     = false;
           
      $scope.PendingImports = [];     
           
      $scope.Dirs = [];
      $scope.CurrentDir = -1;
      var Timeout    = null;
      $scope.FolderMenu = [
      {
        "text": gettextCatalog.getString("New folder"),
        "click": "NewFolder()",
        "href": "#themes"
      },
      {
        "text": gettextCatalog.getString("Rename"),
        "click": "RenameFolderPopUp()",
        "href": "#themes"
      },{
        "text": gettextCatalog.getString("Move folder"),
        "click": "MoveFolderPopUp()",
        "href": "#themes"
      },{
        "text": gettextCatalog.getString("Delete Folder"),
        "click": "DeleteFolder()",
        "href": "#themes"
      }
    ];
    
    $scope.FolderMenuHome = [
      {
        "text": gettextCatalog.getString("New folder"),
        "click": "NewFolder()",
        "href": "#themes"
      }
    ];
      
       
    $scope.NewFolder = function(){ 
        $scope.NewFolderName = "";
        $scope.NewFolderModal = $modal({scope: $scope, template: 'app/pages/Folders/NewFolder.html'});
    }
    
    $scope.CreateNewFolder = function(Name){
       OpenDisplayAPI.Run(0,"DisplayContentFolders","New", { Name:Name, PID:$scope.CurrentDir}, function(Json, Token){
              $scope.LoadDirs();
              
              $scope.NewFolderModal.hide(); 
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
     
      $scope.DeleteFolder = function(){
            var r=confirm(gettextCatalog.getString("Are you sure you want to remove this folder?"));
            if (r==true) {
             OpenDisplayAPI.Run(0,"DisplayContentFolders","Remove", { ID: $scope.CurrentDir,  }, function(Json, Token){
                       $alert({title: gettextCatalog.getString('System'), 
                             content: gettextCatalog.getString("Folder removed"), 
                           placement: 'top-right', type: 'success', show: true, duration: 3});
                             
                             $scope.LoadDirs();
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
         $scope.MoveFolderModal = $modal({scope: $scope, template: 'app/pages/Folders/MoveFolder.html'});
      }
      
      $scope.MoveFolder = function(PID){ 
          OpenDisplayAPI.Run(0,"DisplayContentFolders","Update", { ID:$scope.CurrentFolderInfo.ID,Name:$scope.CurrentFolderInfo.Name, PID:PID }, function(Json, Token){
               $scope.LoadDirs();
               
               $scope.MoveFolderModal.hide();  
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
         $scope.RenameFolderModal = $modal({scope: $scope, template: 'app/pages/Folders/RenameFolder.html'});
      }
      
      $scope.RenameFolder = function(){ 
         OpenDisplayAPI.Run(0,"DisplayContentFolders","Update", { ID:$scope.CurrentFolderInfo.ID,Name:$scope.CurrentFolderInfo.Name, PID:$scope.CurrentFolderInfo.PID }, function(Json, Token){
              $scope.LoadDirs();
              
              $scope.RenameFolderModal.hide();    
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
      
      
      $scope.MoveMediaToFolderPopUp = function(){ 
         $scope.MoveToFolderModal = $modal({scope: $scope, template: 'app/pages/Folders/MoveToFolder.html'});
      }
      
      $scope.MoveMediaToFolder = function(DID){ 
          OpenDisplayAPI.Run(0,"DisplayContent","SetDir", { IDS:$scope.GetSelected(), DID:DID }, function(Json, Token){
               $scope.SelectSwitchBool = false;
               $scope.DeSelectAllContent();
               $scope.FilterThemes(0,'Name',$scope.Search.Value, $scope.Search.Limit);
                
               $scope.MoveToFolderModal.hide();  
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
      
      
      $scope.SelectAllContent = function(){
        for (var i = 0; i < $scope.Themes.Items.length; i++) {
                $scope.Themes.Items[i].Selected = true;
        }
        
        $scope.CheckSelection();
     }
     
     $scope.DeSelectAllContent = function(){
       for (var i = 0; i < $scope.Themes.Items.length; i++) {
                $scope.Themes.Items[i].Selected = false;
        }
        
        $scope.CheckSelection();
     }
          
     $scope.CheckSelection = function(){ 
       $scope.ThemesSelected   = false;
       
       for (var i = 0; i < $scope.Themes.Items.length; i++) {
              if($scope.Themes.Items[i].Selected)
                 $scope.ThemesSelected   = true;
          }
     }
     
     $scope.GetSelected = function(){ 
        var SelectedItems = [];
         
        for (var i = 0; i < $scope.Themes.Items.length; i++) {
              if($scope.Themes.Items[i].Selected)
                 SelectedItems.push($scope.Themes.Items[i].ID);
        }
        
        return SelectedItems;
     }
     
     $scope.SelectSwitch = function(){
        if($scope.SelectSwitchBool){
          $scope.SelectAllContent();
        }else{ 
          $scope.DeSelectAllContent();
        }
     }
      
      
      $scope.FindDir = function(Dirs, ID){
          var arrayLength = Dirs.length;
          for (var i = 0; i < arrayLength; i++) {
             if(Dirs[i].ID == ID){
               Dirs[i].Selected = "btn-info";
               $scope.CurrentDir = ID;
               $scope.CurrentFolderInfo.ID = Dirs[i].ID;
               $scope.CurrentFolderInfo.PID = Dirs[i].PID;
               $scope.CurrentFolderInfo.Name = Dirs[i].Name;
             }else{
               Dirs[i].Selected = "";
             }
             
             $scope.FindDir(Dirs[i].Dirs,ID);
          }
      }
      
      $scope.SelectDir = function (ID){
          if(ID != $scope.CurrentDir){
             
             if($scope.CurrentDir >= 0){ 
               $scope.DeSelectAllContent();
               $scope.SelectSwitchBool = false;
             }
          
             $scope.CurrentDir = 0;
             $scope.Dirs.Selected = "";
             
             if(ID == 0){ 
               $scope.Dirs.Selected = "btn-info";
               $scope.CurrentFolderInfo.ID = 0;
               $scope.CurrentFolderInfo.PID = 0;
               $scope.CurrentFolderInfo.Name = "Home Folder";
             }
             
             $scope.FindDir($scope.Dirs,ID);
             
             
             
             $scope.FilterThemes(0,'Name',$scope.Search.Value, $scope.Search.Limit);
           }
      }
      
      $scope.LoadDirs = function () {
            OpenDisplayAPI.Run(0,"DisplayContentFolders","List", { }, function(Json, Token){
                      $scope.Dirs = Json;
                      $scope.Dirs.Selected = "btn-info";
                      
                      $scope.SelectDir(0);
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
      
      
      $scope.NewThemePopUp = function(){ 
         $scope.LoadResolutions();
         $scope.NewThemeCreated     = false;
         $scope.NewThemeModal = $modal({scope: $scope, template: 'app/pages/Newtheme.html'});
      }
      
      
      $scope.CreateNewTheme = function(){ 
      
         $scope.NewTheme.DID = $scope.CurrentDir;
      
         OpenDisplayAPI.Run(0,"DisplayContent","New",$scope.NewTheme, function(Json, Token){
             $scope.FilterThemes(0,'Name',$scope.Search.Value, $scope.Search.Limit);
              
              $scope.NewTheme        = {};
              $scope.NewTheme.Name   = "";
              $scope.NewTheme.DID    = 0;
              $scope.NewTheme.Width  = 1280;
              $scope.NewTheme.Height = 720;
              
              
              $scope.NewThemeCreated     = true;
              $scope.NewThemeCreatedInfo = Json;

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
      
      $scope.SelectResolution = function(Width,Height){ 
         $scope.UseCustomResolution = false;
         $scope.NewTheme.Width  = Width;
         $scope.NewTheme.Height = Height;
      }
      
      $scope.SelectCustomResolution = function(){ 
         $scope.UseCustomResolution = true;
      }
      
      $scope.LoadResolutions = function () {
            $scope.UseCustomResolution = false; 
            
            OpenDisplayAPI.Run(0,"DisplayContent","Resolutions", { }, function(Json, Token){
                      $scope.NewThemeResolutions = Json;
                      $scope.NewThemeFolders     = [];
                      
                      for (var i = 0; i < Json.length; i++) {
                          $scope.NewThemeFolders.push({ 
                            "text": Json[i].Name+" ("+Json[i].Width+"x"+Json[i].Height+")",
                            "click": "SelectResolution("+Json[i].Width+","+Json[i].Height+")",
                            "href": "#themes" });
                      }
                      
                      $scope.NewThemeFolders.push({ 
                            "text": "Custom resolution",
                            "click": "SelectCustomResolution()",
                            "href": "#themes" });
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
      
      $scope.DeleteTheme = function(ID,Name,idx){
                      
            var r=confirm(gettextCatalog.getString("Are you sure you want to remove ")+Name+"?");
            if (r===true) {
                        
            OpenDisplayAPI.Run(0,"DisplayContent","Remove", { ID: ID }, function(Json, Token){
                    $alert({
                        title: gettextCatalog.getString('System'), 
                        content: gettextCatalog.getString("Theme removed"), 
                        placement: 'top-right', type: 'success', show: true, duration: 3
                    });

                    $scope.Themes.Items.splice(idx, 1);
                    
                    // per item maak Themes.Count -1 result (loading bug solution) 16-5-2014
                    $scope.Themes.Count = $scope.Themes.Count - 1;
                    
                    }, function(Code, Message){ 
                      $alert({
                        title: gettextCatalog.getString('API Error'), 
                        content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                        placement: 'top-right', 
                        type: 'info', show: true, duration: 3});
                    },function(data, status, headers, config){ 
                      $alert({title: 'Connection error', 
                      content: "Error connecting to the server code: "+status, 
                      placement: 'top-right', type: 'info', show: true, duration: 3});
                    });
             }

      };
      
      $scope.RenameItem = function(Theme){
         OpenDisplayAPI.Run(0,"DisplayContent","Update", { ID: Theme.ID, Name:Theme.Name,DID:Theme.DID  }, function(Json, Token){
           $alert({title: gettextCatalog.getString('System'), 
                 content: gettextCatalog.getString("New name saved"), 
               placement: 'top-right', type: 'success', show: true, duration: 3});
                 Theme.Rename = false;
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
      
      
       $scope.SendThemePopUp = function(Name,CID){ 
         $scope.SendThemeInfo.ID       = CID;
         $scope.SendThemeInfo.Name     = Name;
         $scope.SendThemeInfo.UserName = "";
         $scope.SendThemeInfo.Sent     = false;
         
         $scope.SendThemeModal = $modal({scope: $scope, template: 'app/pages/SendTheme.html'});
      };
      
       $scope.SendTheme = function(UserName,CID){
         OpenDisplayAPI.Run(0,"DisplayContent","SendTheme", { ID: CID, UserName: UserName  }, function(Json, Token){
                $scope.SendThemeInfo.Sent     = true;
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
      
      $scope.GetPendingImports = function () {
         OpenDisplayAPI.Run(0,"DisplayContent","GetSentThemes", { }, function(Json, Token){                 
                 if($scope.PendingImports.length != Json.length){ 
                    $scope.FilterThemes(0,'Name',$scope.Search.Value, $scope.Search.Limit);
                 }

                 $scope.PendingImports = Json;
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
      
      $scope.RemoveImports = function (AccountID,ID) {
         OpenDisplayAPI.Run(0,"DisplayContent","RemoveSentTheme", { AccountID:AccountID, ID:ID }, function(Json, Token){
                 $scope.GetPendingImports();
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
      
       $scope.TriggerImport = function (AccountID,ID) {
         OpenDisplayAPI.Run(0,"DisplayContent","ImportSentTheme", { AccountID:AccountID, ID:ID }, function(Json, Token){
                 $scope.GetPendingImports();
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
      
      $scope.secondsToTime = function(secs){
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
            return hours+":"+minutes+":"+seconds;
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
         
         for (var i = 0; i < $scope.Themes.Items.length; i++) {
              if($scope.Themes.Items[i].Selected)
                 $scope.SelectedTemp.push($scope.Themes.Items[i].ID);
         }
      
         if($scope.SelectedTemp.length == 0){
           $scope.CheckSelection();
           $scope.SelectSwitchBool = false;
         }
            
      }
      
      $scope.FilterThemes = function(Start, Key, Value, PageLimit,AppendResults){
           var Filter = [];
           var Limit = 10;
           var Count = 0;
           
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
            Filter[Count].Key  = "CID";
            Filter[Count].Sort = "DESC";
            
            Count++;
            
            Filter[Count] = {};
            Filter[Count].Key = "DID";
            Filter[Count].Selector = "and";
            Filter[Count].Operator = "=";
            Filter[Count].Sort = "ASC";
            Filter[Count].Value = $scope.CurrentDir;
           
           if(Timeout)
           $timeout.cancel(Timeout);
           
           Timeout = $timeout(function (){
           OpenDisplayAPI.Run(0,"DisplayContent","List", { "ResultsStart":Start,"ResultsLimit":Limit,"Filter":  Filter  }, function(Json, Token){                 
                      
                      $scope.BuildSelectedList();
                      
                      if(!AppendResults){
                          $scope.Themes.Items = [];
                          $scope.Themes.Count = Json.Count;
                      }    
                                            
                      for (var i = 0; i < Json.Items.length; i++) {
                          if($scope.IsSelected(Json.Items[i].ID))
                             Json.Items[i].Selected = true;
                          
                          $scope.Themes.Items.push(Json.Items[i]);
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
        
     $scope.LoadDirs();
     $scope.GetPendingImports();
     
     $scope.PendingImportsStatusUpdate = $interval(function() {
         $scope.GetPendingImports();
     },25000);    
         
          
     $scope.$on('$destroy', function() {
        $interval.cancel($scope.PendingImportsStatusUpdate);
      });
          
}]);