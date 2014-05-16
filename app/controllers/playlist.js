CMS.controller('playlist', ['$scope', '$routeParams', '$location', '$cookies','$rootScope','$timeout','OpenDisplayAPI','$alert','Playlist','gettextCatalog', 
function($scope, $routeParams, $location, $cookies, $rootScope, $timeout, OpenDisplayAPI,$alert, Playlist,gettextCatalog) {
        $rootScope.Flow = true;
         
        var Timeout    = null;
        var ThemeTimeout = null;
        
        $scope.Playlists = [];
        $scope.PlaylistService = Playlist;
        $scope.EditPlaylistPage = false;
        
        $scope.Dirs = [];
        $scope.CurrentDir = 0;
        $scope.Themes = [];
        $scope.Search = {};
        $scope.Search.Start   = 0;
        $scope.Search.Limit   = 10;
        
        $scope.Step  = 1;
        $scope.StepClass = {};
        $scope.StepClass.Step1 = "current";
        $scope.StepClass.Step2 = "";
        $scope.StepClass.Step3 = "";
        $scope.StepClass.Step4 = "";
        $scope.StepClass.Step5 = "";
        $scope.StepClass.Step6 = "";
        
        $scope.SelectedThemes = [];
        $scope.MaxTime        = 0;
   
        
        $scope.EditPlaylist = {};
        
        $scope.PlaylistSaveing  = false;
        $scope.EditPlaylistType = false; 
        $scope.PlaylistType     = 0;
         
        
        $scope.AddTheme = function(Theme){
            $scope.SelectedThemes.push(angular.copy(Theme));
            
            $scope.UpdateTime();
        } 
        
        $scope.RemoveTheme = function (idx) {
           $scope.SelectedThemes.splice(idx, 1);
           
           $scope.UpdateTime();
        };
        
        $scope.UpdateTime = function(){
            $scope.MaxTime = 0;
           
            for (var i = 0; i < $scope.SelectedThemes.length; i++) {
                $scope.MaxTime = parseInt($scope.SelectedThemes[i].Time)+$scope.MaxTime;
            }
            
            $scope.MaxTime =  $scope.secondsToTime($scope.MaxTime);
        }
        
        $scope.secondsToTime = function(secs){
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
         
        $scope.SetupBlankPlaylist = function(){
        
            var unix = Math.round(+new Date()/1000);
           
            var t = new Date(unix*1000);
            var tt = new Date((unix+2629743)*1000);    
        
           $scope.EditPlaylist.Active = 1;
           $scope.EditPlaylist.Name = "";
           $scope.EditPlaylist.DateActive = 0;
           $scope.EditPlaylist.DateFrom = t;
           $scope.EditPlaylist.DateTo = t;
           $scope.EditPlaylist.TimeActive = 0;
           $scope.EditPlaylist.StartTime = "";
           $scope.EditPlaylist.EndTime = "";
           $scope.EditPlaylist.DayActive = 0;
           $scope.EditPlaylist.Monday = 0;
           $scope.EditPlaylist.Tuesday = 0;
           $scope.EditPlaylist.Wednesday = 0;
           $scope.EditPlaylist.Thursday = 0;
           $scope.EditPlaylist.Friday = 0;
           $scope.EditPlaylist.Saturday = 0;
           $scope.EditPlaylist.Sunday = 0;
        } 
         
   
        
        $scope.NewPlaylist = function(){
          $scope.EditPlaylist = {}; 
          $scope.SelectedThemes = [];
          $scope.SetupBlankPlaylist();
          $scope.EditPlaylistPage = true;
          $scope.PlaylistSaveing = false;
          $scope.SelectStep(1);
          $scope.UpdateTime();
        }
        
        $scope.BackToOverview = function(){
          $scope.EditPlaylistPage = false;
        }
        
        $scope.SelectStep = function(ID){
        
            if($scope.EditPlaylist.Name == "" && ID != 1){
                $alert({title: gettextCatalog.getString('System'), 
                     content: gettextCatalog.getString("Please fill in a name."), 
                     placement: 'top-right', type: 'info', show: true, duration: 3});
                     return;
            }
            
        
            $scope.StepClass.Step1 = "";
            $scope.StepClass.Step2 = "";
            $scope.StepClass.Step3 = "";
            $scope.StepClass.Step4 = "";
            $scope.StepClass.Step5 = "";
            $scope.StepClass.Step6 = "";
            
            if(ID == 1)
            $scope.StepClass.Step1 = "current";
            if(ID == 2)
            $scope.StepClass.Step2 = "current";
            if(ID == 3)
            $scope.StepClass.Step3 = "current";
            if(ID == 4)
            $scope.StepClass.Step4 = "current";
            if(ID == 5)
            $scope.StepClass.Step5 = "current";
            if(ID == 6)
            $scope.StepClass.Step6 = "current";
            
            $scope.Step = ID;
        }
        
         $scope.FindDir = function(Dirs, ID){
          var arrayLength = Dirs.length;
          for (var i = 0; i < arrayLength; i++) {
             if(Dirs[i].ID == ID){
               Dirs[i].Selected = "btn-info";
               $scope.CurrentDir = ID;
             }else{
               Dirs[i].Selected = "";
             }
             
             $scope.FindDir(Dirs[i].Dirs,ID);
          }
      }
      
      $scope.SelectDir = function (ID){
          if(ID != $scope.CurrentDir){
             $scope.CurrentDir = 0;
             $scope.Dirs.Selected = "";
             
             if(ID == 0)
               $scope.Dirs.Selected = "btn-info";
             
             $scope.FindDir($scope.Dirs,ID);
             
             $scope.FilterThemes($scope.Search.Start,'Name',$scope.Search.Value, $scope.Search.Limit);
           }
      }
      
      $scope.LoadDirs = function () {
            OpenDisplayAPI.Run(0,"DisplayContentFolders","List", { }, function(Json, Token){
                      $scope.Dirs = Json;
                      $scope.Dirs.Selected = "btn-info";
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
           }
           
            Count++;
            Filter[Count] = {};
            Filter[Count].Key = "DID";
            Filter[Count].Selector = "and";
            Filter[Count].Operator = "=";
            Filter[Count].Sort = "ASC";
            Filter[Count].Value = $scope.CurrentDir;
           
           if(ThemeTimeout)
           $timeout.cancel(ThemeTimeout);
           
           ThemeTimeout = $timeout(function (){
           OpenDisplayAPI.Run(0,"DisplayContent","List", { "ResultsStart":Start,"ResultsLimit":Limit,"Filter":  Filter  }, function(Json, Token){
                      if(AppendResults){
                         var arrayLength = Json.Items.length;
                          for (var i = 0; i < arrayLength; i++) {
                              $scope.Themes.Items.push(Json.Items[i]);
                          }
                      }else{
                        $scope.Themes = Json;
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
           }, 100);
        }
        
        $scope.SavePlaylist = function(){
            var PlaylistByTree = [];
            var PlaylistByDevice = [];
            var PlaylistByTag   = [];
            var CopyOfPlaylist  = angular.copy($scope.EditPlaylist);
            
            $scope.Playlists = [];
            
           
          
            for (var i = 0; i < $scope.PlaylistService.SelectedItems.length; i++) {
                if($scope.PlaylistService.SelectedItems[i].Type == 0){
                  PlaylistByTree.push(angular.copy($scope.PlaylistService.SelectedItems[i].ID));
                }
                
                if($scope.PlaylistService.SelectedItems[i].Type == 1){
                  PlaylistByDevice.push(angular.copy($scope.PlaylistService.SelectedItems[i].ID));
                }
                
                if($scope.PlaylistService.SelectedItems[i].Type == 2){
                  PlaylistByTag.push(angular.copy($scope.PlaylistService.SelectedItems[i].ID));
                }
            }
            
            if (PlaylistByTree.length > 0 || PlaylistByDevice.length > 0 || PlaylistByTag.length > 0){
               
               //format date for sending to the server
               CopyOfPlaylist.DateFrom = Math.round((new Date(CopyOfPlaylist.DateFrom)).getTime() / 1000);
               CopyOfPlaylist.DateTo = Math.round((new Date(CopyOfPlaylist.DateTo)).getTime() / 1000);
                 
               var StartTime = new Date(CopyOfPlaylist.StartTime);
               var StartTimeMin = StartTime.getMinutes();
               var StartTimeHour = StartTime.getHours();
                
               if(StartTimeMin < 10)
                  StartTimeMin = "0"+StartTimeMin; 
                
               if(StartTimeHour < 10)
                  StartTimeHour = "0"+StartTimeHour; 
                
               CopyOfPlaylist.StartTime = StartTimeHour+":"+StartTimeMin; 
               
               
               var EndTime = new Date(CopyOfPlaylist.EndTime);
                              
               var EndTimeMin =  EndTime.getMinutes();
               var EndTimeHour = EndTime.getHours();
                
               if(EndTimeMin < 10)
                  EndTimeMin = "0"+EndTimeMin; 
                
               if(EndTimeHour < 10)
                  EndTimeHour = "0"+EndTimeHour;
               
               
               CopyOfPlaylist.EndTime = EndTimeHour+":"+EndTimeMin;  
                  
               CopyOfPlaylist.Items = [];
               
                for (var i = 0; i < $scope.SelectedThemes.length; i++) {
                     var Item = { ID: $scope.SelectedThemes[i].ID, Time: $scope.SelectedThemes[i].Time, NoPlay: 0  }
                     CopyOfPlaylist.Items.push(Item);
                }
              
              
              if (PlaylistByDevice.length > 0){
              
                  CopyOfPlaylist.Devices = PlaylistByDevice;
                                    
                  $scope.PlaylistSaveing = true;
                  
                  if($scope.EditPlaylistType){
                     OpenDisplayAPI.Run(0,"Playlist","Update", CopyOfPlaylist, function(Json, Token){
                               $alert({title: gettextCatalog.getString('System'), 
                               content: gettextCatalog.getString("Playlist saved!"), 
                               placement: 'top-left', type: 'success', show: true, duration: 3});
                             
                              $scope.GetPlaylist();
                              $scope.EditPlaylistPage = false;
                              $scope.PlaylistSaveing = false;
                              $scope.EditPlaylistType = false;
                              //console.log(Json);
                           }, function(Code, Message){ 
                             $alert({title: gettextCatalog.getString('API Error'), 
                             content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                             placement: 'top-right', type: 'info', show: true, duration: 3});
                             
                             $scope.PlaylistSaveing = false;
                           },function(data, status, headers, config){ 
                             $alert({title: 'Connection error', 
                             content: "Error connecting to the server code: "+status, 
                             placement: 'top-right', type: 'info', show: true, duration: 3});
                             
                             $scope.PlaylistSaveing = false;
                           });
                  }else{
                    OpenDisplayAPI.Run(0,"Playlist","New", CopyOfPlaylist, function(Json, Token){
                               $alert({title: gettextCatalog.getString('System'), 
                               content: gettextCatalog.getString("Playlist saved!"), 
                               placement: 'top-left', type: 'success', show: true, duration: 3});
                             
                              $scope.GetPlaylist();
                              $scope.EditPlaylistPage = false;
                              $scope.PlaylistSaveing = false;
                              //console.log(Json);
                           }, function(Code, Message){ 
                             $alert({title: gettextCatalog.getString('API Error'), 
                             content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                             placement: 'top-right', type: 'info', show: true, duration: 3});
                             
                             $scope.PlaylistSaveing = false;
                           },function(data, status, headers, config){ 
                             $alert({title: 'Connection error', 
                             content: "Error connecting to the server code: "+status, 
                             placement: 'top-right', type: 'info', show: true, duration: 3});
                             
                             $scope.PlaylistSaveing = false;
                           });
                           
                    }
                  }
                  
                  if(PlaylistByTree.length > 0){
                  
                  CopyOfPlaylist.Tree = PlaylistByTree[0];
                  
                  //console.log(CopyOfPlaylist);
                  
                  $scope.PlaylistSaveing = true;
                  
                  if($scope.EditPlaylistType){
                     OpenDisplayAPI.Run(0,"Playlist","Update", CopyOfPlaylist, function(Json, Token){
                               $alert({title: gettextCatalog.getString('System'), 
                               content: gettextCatalog.getString("Playlist saved!"), 
                               placement: 'top-left', type: 'success', show: true, duration: 3});
                             
                              $scope.GetPlaylist();
                              $scope.EditPlaylistPage = false;
                              $scope.PlaylistSaveing = false;
                              $scope.EditPlaylistType = false;
                              //console.log(Json);
                           }, function(Code, Message){ 
                             $alert({title: gettextCatalog.getString('API Error'), 
                             content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                             placement: 'top-right', type: 'info', show: true, duration: 3});
                             
                             $scope.PlaylistSaveing = false;
                           },function(data, status, headers, config){ 
                             $alert({title: 'Connection error', 
                             content: "Error connecting to the server code: "+status, 
                             placement: 'top-right', type: 'info', show: true, duration: 3});
                             
                             $scope.PlaylistSaveing = false;
                           });
                  }else{
                    OpenDisplayAPI.Run(0,"Playlist","New", CopyOfPlaylist, function(Json, Token){
                               $alert({title: gettextCatalog.getString('System'), 
                               content: gettextCatalog.getString("Playlist saved!"), 
                               placement: 'top-left', type: 'success', show: true, duration: 3});
                             
                              $scope.GetPlaylist();
                              $scope.EditPlaylistPage = false;
                              $scope.PlaylistSaveing = false;
                              //console.log(Json);
                           }, function(Code, Message){ 
                             $alert({title: gettextCatalog.getString('API Error'), 
                             content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                             placement: 'top-right', type: 'info', show: true, duration: 3});
                             
                             $scope.PlaylistSaveing = false;
                           },function(data, status, headers, config){ 
                             $alert({title: 'Connection error', 
                             content: "Error connecting to the server code: "+status, 
                             placement: 'top-right', type: 'info', show: true, duration: 3});
                             
                             $scope.PlaylistSaveing = false;
                           });
                           
                    }
                    
                  }
              }else {
                             $location.path("/deviceview"); 
              }
            
        }
        
        $scope.GetPlaylist = function(){
            var PlaylistByTree = [];
            var PlaylistByDevice = [];
            var PlaylistByTag   = [];
            
            $scope.Playlists = [];
          
            for (var i = 0; i < $scope.PlaylistService.SelectedItems.length; i++) {
                if($scope.PlaylistService.SelectedItems[i].Type == 0){
                  PlaylistByTree.push(angular.copy($scope.PlaylistService.SelectedItems[i].ID));
                }
                
                if($scope.PlaylistService.SelectedItems[i].Type == 1){
                  PlaylistByDevice.push(angular.copy($scope.PlaylistService.SelectedItems[i].ID));
                }
                
                if($scope.PlaylistService.SelectedItems[i].Type == 2){
                  PlaylistByTag.push(angular.copy($scope.PlaylistService.SelectedItems[i].ID));
                }
            }
            
             if (PlaylistByTree.length > 0 || PlaylistByDevice.length > 0 || PlaylistByTag.length > 0){
                  if (PlaylistByDevice.length > 0){
                       $scope.PlaylistType = 1;
                       
                       OpenDisplayAPI.Run(0,"Playlist","ListByDevice", { "Devices": PlaylistByDevice  }, function(Json, Token){
                           
                           var arrayLength = Json.Items.length;
                            for (var i = 0; i < arrayLength; i++){
                                $scope.Playlists.push(Json.Items[i]);
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
                  }
                  
                  if(PlaylistByTree.length > 0){
                      $scope.PlaylistType = 0;
                      
                      var Count = 0;
                      var Filter = [];
                     
                      Filter[Count] = {};
                      Filter[Count].Key = "Tree";
                      Filter[Count].Selector = "and";
                      Filter[Count].Operator = "=";
                      Filter[Count].Sort = "ASC";
                      Filter[Count].Value = PlaylistByTree[0];
                  
                      Count++;
                  
                      Filter[Count] = {};
                      Filter[Count].Key = "Type";
                      Filter[Count].Selector = "and";
                      Filter[Count].Operator = "=";
                      Filter[Count].Sort = "ASC";
                      Filter[Count].Value = 0;
                  
                     OpenDisplayAPI.Run(0,"Playlist","List", { "ResultsStart":0,"ResultsLimit":100,"Filter":  Filter  }, function(Json, Token){
                           
                           var arrayLength = Json.Items.length;
                            for (var i = 0; i < arrayLength; i++){
                                $scope.Playlists.push(Json.Items[i]);
                            }

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
               $location.path("/deviceview"); 
            }
        }
        
        $scope.LoadPlaylistInfo = function(ID,GID){
          if(GID > 0){
             OpenDisplayAPI.Run(0,"Playlist","Info", { GID: GID  }, function(Json, Token){
                  $scope.EditPlaylist   = Json.Settings;
                  $scope.SelectedThemes = Json.Items;
                  
                  if($scope.EditPlaylist.DateFrom > 0)
                     $scope.EditPlaylist.DateFrom    = $scope.UnixTimeToDate($scope.EditPlaylist.DateFrom);
                  
                  if($scope.EditPlaylist.DateTo > 0)
                     $scope.EditPlaylist.DateTo      = $scope.UnixTimeToDate($scope.EditPlaylist.DateTo);
                     
                  if($scope.EditPlaylist.EndTime != "" && $scope.EditPlaylist.EndTime != "Invalid Date" && $scope.EditPlaylist.EndTime != "NaN:N"){
                    $scope.EditPlaylist.EndTime     = new Date("October 13, 1975 "+$scope.EditPlaylist.EndTime+":11 GMT+0100 (CET)");
                  }else{ $scope.EditPlaylist.EndTime = new Date(); }

                  if($scope.EditPlaylist.StartTime != "" && $scope.EditPlaylist.StartTime != "Invalid Date" && $scope.EditPlaylist.StartTime != "NaN:N"){
                     $scope.EditPlaylist.StartTime   = new Date("October 13, 1975 "+$scope.EditPlaylist.StartTime+":11 GMT+0100 (CET)");
                  }else{ $scope.EditPlaylist.StartTime = new Date(); }

                  
                  $scope.EditPlaylistType = true;
                  
                  $scope.EditPlaylistPage = true;
                  $scope.PlaylistSaveing  = false;
                  $scope.SelectStep(1);
                  $scope.UpdateTime();
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
             OpenDisplayAPI.Run(0,"Playlist","Info", { ID: ID  }, function(Json, Token){
                  $scope.EditPlaylist   = Json.Settings;
                  $scope.SelectedThemes = Json.Items;
                  
                  $scope.EditPlaylist.DateFrom = $scope.UnixTimeToDate($scope.EditPlaylist.DateFrom);
                  $scope.EditPlaylist.DateTo   = $scope.UnixTimeToDate($scope.EditPlaylist.DateTo);

                  if($scope.EditPlaylist.EndTime != "" && $scope.EditPlaylist.EndTime != "Invalid Date" && $scope.EditPlaylist.EndTime != "NaN:N"){
                    $scope.EditPlaylist.EndTime     = new Date("October 13, 1975 "+$scope.EditPlaylist.EndTime+":11 GMT+0100 (CET)");
                  }else{ $scope.EditPlaylist.EndTime = new Date(); }

                  if($scope.EditPlaylist.StartTime != "" && $scope.EditPlaylist.StartTime != "Invalid Date" && $scope.EditPlaylist.StartTime != "NaN:N"){
                     $scope.EditPlaylist.StartTime   = new Date("October 13, 1975 "+$scope.EditPlaylist.StartTime+":11 GMT+0100 (CET)");
                  }else{ $scope.EditPlaylist.StartTime = new Date(); }

                  
                  $scope.EditPlaylistType = true;
                  
                  $scope.EditPlaylistPage = true;
                  $scope.PlaylistSaveing  = false;
                  $scope.SelectStep(1);
                  $scope.UpdateTime();
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
        }
        
        $scope.UnixTimeToDate = function(UnixTime){
          return new Date(UnixTime*1000);
        }
                
        $scope.DeletePlaylist = function(ID,Name,GID){
            var r=confirm(gettextCatalog.getString("Are you sure you want to remove the playlist ")+Name+"?");
            if (r==true) {
             OpenDisplayAPI.Run(0,"Playlist","Remove", { ID: ID, GID: GID  }, function(Json, Token){
                 $alert({title: gettextCatalog.getString('System'), 
                       content: gettextCatalog.getString("Playlist removed"), 
                       placement: 'top-left', type: 'success', show: true, duration: 3});
                       
                       $scope.GetPlaylist();
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
        
        $scope.LinkPlaylist = function(ID){ 
             var PlaylistByDevice = [];
        
            for (var i = 0; i < $scope.PlaylistService.SelectedItems.length; i++) {                
                if($scope.PlaylistService.SelectedItems[i].Type == 1){
                  PlaylistByDevice.push(angular.copy($scope.PlaylistService.SelectedItems[i].ID));
                }
            }
        
        
           OpenDisplayAPI.Run(0,"Playlist","Link", { ID: ID, Devices: PlaylistByDevice  }, function(Json, Token){
               $alert({title: gettextCatalog.getString('System'), 
                     content: gettextCatalog.getString("Playlist updated"), 
                   placement: 'top-left', type: 'success', show: true, duration: 3});
                     
                     $scope.GetPlaylist();
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
        
        $scope.UnLinkPlaylist = function(ID){ 
             var r=confirm(gettextCatalog.getString("Are you sure you want to unlink this playlist?"));
             if (r==true) {
             var PlaylistByDevice = [];
        
              for (var i = 0; i < $scope.PlaylistService.SelectedItems.length; i++) {                
                  if($scope.PlaylistService.SelectedItems[i].Type == 1){
                    PlaylistByDevice.push(angular.copy($scope.PlaylistService.SelectedItems[i].ID));
                  }
              }
          
          
             OpenDisplayAPI.Run(0,"Playlist","UnLink", { ID: ID, Devices: PlaylistByDevice  }, function(Json, Token){
                 $alert({title: gettextCatalog.getString('System'), 
                       content: gettextCatalog.getString("Playlist updated"), 
                       placement: 'top-left', type: 'success', show: true, duration: 3});
                       
                       $scope.GetPlaylist();
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
             
     $scope.AddTime = function (ItemTime){ 
           this.SelectedTheme.Time = (parseInt(this.SelectedTheme.Time)+ItemTime);
           $scope.UpdateTime();
     }
     
     $scope.RemoveTime = function (ItemTime){ 
           if((parseInt(this.SelectedTheme.Time)-ItemTime) > 4)
           this.SelectedTheme.Time = (parseInt(this.SelectedTheme.Time)-ItemTime);
           $scope.UpdateTime();
     }
     
     $scope.FilterThemes();
     $scope.LoadDirs();
     $scope.GetPlaylist();
     
}]);