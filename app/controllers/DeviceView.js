CMS.controller('deviceview', ['$scope', '$routeParams', '$location', '$cookies','$timeout','OpenDisplayAPI','Playlist','GlobalState','$interval','$alert', 'gettextCatalog',
function($scope, $routeParams, $location, $cookies, $timeout,OpenDisplayAPI,Playlist,GlobalState,$interval,$alert,gettextCatalog) {
    $scope.Limit = 8;
    $scope.GlobalState = GlobalState;
    $scope.PlaylistService = Playlist;
    $scope.MaxDevice = 0;
    $scope.MoreButton = gettextCatalog.getString("Load more devices");    
    $scope.DeviceStatusUpdate = null;
    $scope.Search = {};
    var Timeout; 
    
    $scope.SelectView = function(View){
        if(View == "deviceblok"){ 
          $scope.GlobalState.DeviceViewPage = "app/pages/DeviceBlok.html";
          
          if($scope.GlobalState.DeviceView != "deviceblok" && $scope.GlobalState.DeviceView != "devicelist"){
            $scope.DeselectAll();
            $scope.PlaylistService.ClearItems();
          }
             
        }else if(View == "devicelist"){ 
          $scope.GlobalState.DeviceViewPage = "app/pages/DeviceList.html";
          
          if($scope.GlobalState.DeviceView != "deviceblok" && $scope.GlobalState.DeviceView != "devicelist"){
            $scope.DeselectAll();
            $scope.PlaylistService.ClearItems();
          }
        }else if(View == "tree"){ 
          $scope.GlobalState.DeviceViewPage = "app/pages/Tree.html";
        }else if(View == "tags"){ 
          $scope.GlobalState.DeviceViewPage = "app/pages/Tags.html";
        }
        
        $scope.GlobalState.DeviceView = View;
    }
    
    $scope.SelectAll = function(){
        $scope.PlaylistService.ClearItems();
    
        for (var i = 0; i < $scope.GlobalState.Devices.length; i++) {
            $scope.GlobalState.Devices[i].Selected = 1;
            $scope.PlaylistService.AddToList(1,$scope.GlobalState.Devices[i].ID)
        }
    };
    
    $scope.DeselectAll = function(){
        $scope.PlaylistService.ClearItems();
        
        for (var i = 0; i < $scope.GlobalState.Devices.length; i++) {
            $scope.GlobalState.Devices[i].Selected = 0;
        }
    };
    
    $scope.IsSelected = function(ID){
      var SelectedItems = $scope.PlaylistService.Get();
      
      for (var i = 0; i < SelectedItems.length; i++) {
            if(SelectedItems[i].ID == ID)
            return true;
        }
        
        return false;
    }
    
    $scope.Select = function(Device){
        if(Device.Selected == 1){
          Device.Selected = 0;
        }else{
          Device.Selected = 1;
        }
        $scope.PlaylistService.ClearItems();
        
        for (var i = 0; i < $scope.GlobalState.Devices.length; i++) {
            if($scope.GlobalState.Devices[i].Selected == 1)
               $scope.PlaylistService.AddToList(1,$scope.GlobalState.Devices[i].ID)
        }
    };
    
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
    
     $scope.FilterDevices = function(Start, Key, Value, PageLimit, AppendResults){
           var Filter = [];
           var Limit = 8;
           var Count = 0;
           
           if(PageLimit > 0){
               Limit = PageLimit;
           }
           
           if(Start < 0 && AppendResults)
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
           
           if(Timeout)
           $timeout.cancel(Timeout);
           
           $scope.MoreButton = gettextCatalog.getString("Loading...");
           
           Timeout = $timeout(function (){
           OpenDisplayAPI.Run(0,"Devices","List", { "ResultsStart":Start,"ResultsLimit":Limit,"Filter":  Filter  }, function(Json, Token){
                       if(AppendResults){
                         var arrayLength = Json.Items.length;
                          for (var i = 0; i < arrayLength; i++) {
                              if($scope.IsSelected(Json.Items[i].ID))
                                Json.Items[i].Selected = 1;
                                
                              $scope.GlobalState.Devices.push(Json.Items[i]);
                          }
                      }else{
                         $scope.GlobalState.Devices = [];
                         
                         var arrayLength = Json.Items.length;
                          for (var i = 0; i < arrayLength; i++) {
                              if($scope.IsSelected(Json.Items[i].ID))
                                Json.Items[i].Selected = 1;
                          
                                $scope.GlobalState.Devices.push(Json.Items[i]);
                          }
                      }
             
                      
                      $scope.MaxDevice = Json.Count;                      
                      $scope.MoreButton = gettextCatalog.getString("Load more devices");
                   }, function(Code, Message){ 
                     $alert({title: gettextCatalog.getString('API Error'), 
                     content: gettextCatalog.getString("Error Code ["+Code+"] "+Message), 
                     placement: 'top-right', type: 'info', show: true, duration: 3});
                     $scope.MoreButton = gettextCatalog.getString("Load more devices");
                   },function(data, status, headers, config){ 
                     $alert({title: 'Connection error', 
                     content: "Error connecting to the server code: "+status, 
                     placement: 'top-right', type: 'info', show: true, duration: 3});
                     $scope.MoreButton = gettextCatalog.getString("Load more devices");
                   });
           }, 500);
        }
     
      if($scope.GlobalState.Devices.length == 0 && $scope.GlobalState.SearchValue == ""){
        $scope.FilterDevices(0,"Name","",$scope.Limit);
      }else{ 
        //update devices
        $scope.FilterDevices(0,'Name',$scope.GlobalState.SearchValue, $scope.GlobalState.Devices.length,false);
      }
      
      $scope.DeviceStatusUpdate = $interval(function() {
          $scope.FilterDevices(0,'Name',$scope.GlobalState.SearchValue, $scope.GlobalState.Devices.length,false);
      },15000);    
         
         
         
          
     $scope.$on('$destroy', function() {
        $interval.cancel($scope.DeviceStatusUpdate);
     });
     
     $scope.SetHeight = function(){
         var Width = 1280;
         var Height = 720;
         
         if(this.Device.Info){
           if(typeof this.Device.Info.Info != 'undefined'){
            Width  = this.Device.Info.Info.Width;
            Height = this.Device.Info.Info.Height;
           }
         } 
       
         return Math.round(266/(Width/Height));
     }
}]);
