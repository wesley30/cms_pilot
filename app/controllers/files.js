CMS.controller('files', ['$scope', '$routeParams', '$location', '$cookies','$timeout','OpenDisplayAPI','$rootScope','$modal','$alert','$sce', 'gettextCatalog',
function($scope, $routeParams, $location, $cookies, $timeout, OpenDisplayAPI, $rootScope, $modal, $alert, $sce, gettextCatalog) {
      $rootScope.Flow = true;
      
      $scope.Files = {};
      $scope.Files.Items = [];
      $scope.Files.Count = 0;
      $scope.Search = {};
      $scope.Search.Start   = 0;
      $scope.Search.Limit   = 3;
      $scope.Search.Value   = "";
      $scope.Dirs = [];
      $scope.CurrentDir = -1;
      
      $scope.NewFolderName   = "";
      $scope.CurrentFolderInfo = {};
      $scope.CurrentFolderInfo.ID = 0;
      $scope.CurrentFolderInfo.PID = 0;
      $scope.CurrentFolderInfo.Name = gettextCatalog.getString("Home Folder");
      
      $scope.MoveFolderModal   = null;
      $scope.RenameFolderModal = null;
      $scope.MoveToFolderModal = null;
      $scope.UploadModal       = null;
      
      $scope.UploadURL         = "";
      
      $scope.FilesSelected   = false;
      $scope.SelectSwitchBool = false;
      
      $scope.SelectedTemp     = [];
      $scope.Removing         = false;
      $scope.Filter           = "all";
      $scope.SelectTypeValue  = "No Filter";
      
      var Timeout    = null;
      $scope.FolderMenu = [
      {
        "text": gettextCatalog.getString("New folder"),
        "click": "NewFolder()",
        "href": "#files"
      },
      {
        "text": gettextCatalog.getString("Rename"),
        "click": "RenameFolderPopUp()",
        "href": "#files"
      },{
        "text": gettextCatalog.getString("Move folder"),
        "click": "MoveFolderPopUp()",
        "href": "#files"
      },{
        "text": gettextCatalog.getString("Delete Folder"),
        "click": "DeleteFolder()",
        "href": "#files"
      }
    ];
    
      $scope.SelectType = [
      {
        "text": gettextCatalog.getString("No Filter"),
        "click": function(){ $scope.SelectTypeValue = gettextCatalog.getString("No Filter"); $scope.Filter  = "all"; $scope.FilterFiles($scope.Search.Start,'Name',$scope.Search.Value, $scope.Search.Limit) },
        "href": "#files",
        "value": gettextCatalog.getString("No Filter") 
      },
      {
        "text": gettextCatalog.getString("Image"),
        "click": function(){ $scope.SelectTypeValue = gettextCatalog.getString("Image"); $scope.Filter  = "IMG"; $scope.FilterFiles($scope.Search.Start,'Name',$scope.Search.Value, $scope.Search.Limit) },
        "href": "#files",
        "value": gettextCatalog.getString("Image") 
      },{
        "text": gettextCatalog.getString("Video"),
        "click": function(){ $scope.SelectTypeValue = gettextCatalog.getString("Video"); $scope.Filter  = "VIDEO"; $scope.FilterFiles($scope.Search.Start,'Name',$scope.Search.Value, $scope.Search.Limit) },
        "href": "#files",
        "value": gettextCatalog.getString("Video") 
      },{
        "text": gettextCatalog.getString("Fonts"),
        "click": function(){ $scope.SelectTypeValue = gettextCatalog.getString("Fonts"); $scope.Filter  = "FONT"; $scope.FilterFiles($scope.Search.Start,'Name',$scope.Search.Value, $scope.Search.Limit) },
        "href": "#files",
        "value": gettextCatalog.getString("Fonts") 
      },{
        "text": gettextCatalog.getString("System"),
        "click": function(){ $scope.SelectTypeValue = gettextCatalog.getString("System"); $scope.Filter  = "SYSTEM"; $scope.FilterFiles($scope.Search.Start,'Name',$scope.Search.Value, $scope.Search.Limit) },
        "href": "#files",
        "value": gettextCatalog.getString("System") 
      }
    ];
    
    $scope.FolderMenuHome = [
      {
        "text": gettextCatalog.getString("New folder"),
        "click": "NewFolder()",
        "href": "#files"
      }
    ];
      
      $scope.NewFolder = function(){ 
        $scope.NewFolderName = "";
        $scope.NewFolderModal = $modal({scope: $scope, template: 'app/pages/Folders/NewFolder.html'});
    }
    
    $scope.CreateNewFolder = function(Name){
       OpenDisplayAPI.Run(0,"FilesFolders","New", { Name:Name, PID:$scope.CurrentDir}, function(Json, Token){
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
             OpenDisplayAPI.Run(0,"FilesFolders","Remove", { ID: $scope.CurrentDir,  }, function(Json, Token){
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
          OpenDisplayAPI.Run(0,"FilesFolders","Update", { ID:$scope.CurrentFolderInfo.ID,Name:$scope.CurrentFolderInfo.Name, PID:PID }, function(Json, Token){
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
         OpenDisplayAPI.Run(0,"FilesFolders","Update", { ID:$scope.CurrentFolderInfo.ID,Name:$scope.CurrentFolderInfo.Name, PID:$scope.CurrentFolderInfo.PID }, function(Json, Token){
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
          OpenDisplayAPI.Run(0,"Files","Update", { IDS:$scope.GetSelected(), DID:DID }, function(Json, Token){
               $scope.SelectSwitchBool = false;
               $scope.DeSelectAllContent();
               $scope.FilterFiles(0,'Name',$scope.Search.Value, $scope.Search.Limit);
                
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
        for (var i = 0; i < $scope.Files.Items.length; i++) {
                $scope.Files.Items[i].Selected = true;
        }
        
        $scope.CheckSelection();
     }
     
     $scope.DeSelectAllContent = function(){
       for (var i = 0; i < $scope.Files.Items.length; i++) {
                $scope.Files.Items[i].Selected = false;
        }
        
        $scope.CheckSelection();
     }
          
     $scope.CheckSelection = function(){ 
       $scope.FilesSelected   = false;
       
       for (var i = 0; i < $scope.Files.Items.length; i++) {
              if($scope.Files.Items[i].Selected)
                 $scope.FilesSelected   = true;
          }
     }
     
     $scope.GetSelected = function(){ 
        var SelectedItems = [];
         
        for (var i = 0; i < $scope.Files.Items.length; i++) {
              if($scope.Files.Items[i].Selected)
                 SelectedItems.push($scope.Files.Items[i].ID);
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
               $scope.CurrentFolderInfo.Name = gettextCatalog.getString("Home Folder");
             }
             
             $scope.FindDir($scope.Dirs,ID);
             
             $scope.FilterFiles(0,'Name',$scope.Search.Value, $scope.Search.Limit);
           }
      }
      
      $scope.RefeshPage = function(){ 
          var Limit = $scope.Search.Limit;
          
          if($scope.Files.Items.length > $scope.Search.Limit)
             Limit = $scope.Files.Items.length;
          
          $scope.FilterFiles(0,'Name',$scope.Search.Value, Limit);
      }
      
      $scope.LoadDirs = function () {
            OpenDisplayAPI.Run(0,"FilesFolders","List", { }, function(Json, Token){
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
      
      $scope.DeleteMedia = function(ID,Name,idx){
            var r=confirm(gettextCatalog.getString("Are you sure you want to remove ")+Name+"?");
            if (r===true) {
             OpenDisplayAPI.Run(0,"Files","Remove", { ID: ID  }, function(Json, Token){
                       $alert({title: gettextCatalog.getString('System'), 
                             content: gettextCatalog.getString("File removed"), 
                           placement: 'top-right', type: 'success', show: true, duration: 3});
                             
                            $scope.Files.Items.splice(idx, 1);
                            
                            // per item maak Themes.Count -1 result (loading bug solution) 16-5-2014
                            $scope.Files.Count = $scope.Files.Count - 1;
                            
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
      
      $scope.DeleteMediaList = function(){
            var r=confirm(gettextCatalog.getString("Are you sure you want to remove the selected media?"));
            if (r==true) {
             $scope.Removing = true;
             OpenDisplayAPI.Run(0,"Files","Remove", { ID: $scope.GetSelected()  }, function(Json, Token){
                       $alert({title: gettextCatalog.getString('System'), 
                               content: gettextCatalog.getString("Files removed"), 
                               placement: 'top-right', type: 'success', show: true, duration: 3});
                             $scope.Removing = false;
                             $scope.FilterFiles(0,'Name',$scope.Search.Value, $scope.Search.Limit);
                             
                             $scope.FilesSelected   = false;
                             $scope.SelectSwitchBool = false;
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
      
      $scope.RenameItem = function(File){
         OpenDisplayAPI.Run(0,"Files","Update", { ID: File.ID, Name:File.Name,DID:File.DID  }, function(Json, Token){
           $alert({title: gettextCatalog.getString('System'), 
                 content: gettextCatalog.getString("New name saved"), 
                 placement: 'top-right', type: 'success', show: true, duration: 3});
                 File.Rename = false;
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
      
      $scope.UploadPopUp = function(){ 
         $scope.GetUploadURL();
         $scope.UploadModal = $modal({scope: $scope, template: 'app/pages/Upload.html'});
      }
      
      $scope.GetUploadURL = function(){
         OpenDisplayAPI.Run(0,"Files","UploadURL", { DID: $scope.CurrentDir }, function(Json, Token){
                 $scope.UploadURL = $sce.trustAsResourceUrl(Json.UI);
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
         
         for (var i = 0; i < $scope.Files.Items.length; i++) {
              if($scope.Files.Items[i].Selected)
                 $scope.SelectedTemp.push($scope.Files.Items[i].ID);
         }
      
         if($scope.SelectedTemp.length == 0){
           $scope.CheckSelection();
           $scope.SelectSwitchBool = false;
         }
      }
      
      $scope.FilterFiles = function(Start, Key, Value, PageLimit, AppendResults){
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
            Filter[Count].Key  = "ID";
            Filter[Count].Sort = "DESC";
            
            Count++;
           
            Filter[Count] = {};
            Filter[Count].Key = "DID";
            Filter[Count].Selector = "and";
            Filter[Count].Operator = "=";
            Filter[Count].Sort = "ASC";
            Filter[Count].Value = $scope.CurrentDir;
            
            
            if($scope.Filter != "all"){ 
                Count++;
               
                Filter[Count] = {};
                Filter[Count].Key = "Type";
                Filter[Count].Selector = "and";
                Filter[Count].Operator = "=";
                Filter[Count].Sort = "ASC";
                Filter[Count].Value = $scope.Filter; 
            }
            

           
           if(Timeout)
           $timeout.cancel(Timeout);
           
           Timeout = $timeout(function (){
           OpenDisplayAPI.Run(0,"Files","List", { "ResultsStart":Start,"ResultsLimit":Limit,"Filter":  Filter  }, function(Json, Token){
                        $scope.BuildSelectedList();
                        
                        if(!AppendResults){
                           $scope.Files.Items = [];
                           $scope.Files.Count = Json.Count;
                        }
                                                                           
                        for (var i = 0; i < Json.Items.length; i++) {
                            if($scope.IsSelected(Json.Items[i].ID))
                               Json.Items[i].Selected = true;
                            
                            $scope.Files.Items.push(Json.Items[i]);
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
        
        
      $scope.bytesToSize = function(bytes) {
       var k = 1000;
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
       if (bytes === 0) return '0 Bytes';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)),10);
       return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
     }
     
     $scope.LoadDirs();
}]);