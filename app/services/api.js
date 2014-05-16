CMS.service('OpenDisplayAPI', function ($http, $cookies, $location, $timeout){
    var ServerURL = "https://connect.novaapi.com";
    //var ServerURL = "http://alpha.opendisplayapi.appspot.com";
    var auth = {};
    var ShearSettings = {};
    var RunLastCommandFunction = null;
    var OpenDisplayAPI = this;
    
    OpenDisplayAPI.AccountInfo = {};
    OpenDisplayAPI.AjaxLoading = false;
    OpenDisplayAPI.ServerURL = ServerURL;
    auth.authorised = false;
    ShearSettings.app = {};
    
    if($cookies.alpha){ 
       ServerURL = "http://alpha.opendisplayapi.appspot.com";
    }
    
   
    OpenDisplayAPI.SetShearSettings = function (Settings){
      ShearSettings.app = Settings;
    }
    
    OpenDisplayAPI.GetShearSettings = function(){ return ShearSettings.app; }
   
    OpenDisplayAPI.authorised  = function ()    { return auth.authorised;   }
    
    OpenDisplayAPI.ForceAuthorised = function() { auth.authorised = true;   }
    
    OpenDisplayAPI.RunLastCommand = function(){
      try
{    
      if(RunLastCommandFunction)
        RunLastCommandFunction();
       }
catch(err)
{
       
       }
    }  
    
    OpenDisplayAPI.auth = function (CallBack){
       if($cookies.Token != ""){
            OpenDisplayAPI.apiCall(ServerURL+"/webapi/0/Account/Info",{ Token: $cookies.Token },function (data, status, headers, config){
            if(data.ResponseHead.Code == 200){  
                console.log("Response data:");
                console.log(data.ResponseBody.Info);
                OpenDisplayAPI.AccountInfo =  data.ResponseBody.Info;
                auth.authorised = true;
            }else if(data.ResponseHead.Code == 401){
                auth.authorised = false;
                $cookies.Token = "";
            }else{
                console.log("Code: "+data.ResponseHead.Code+" Message: "+data.ResponseHead.Message);
            }      
          });
        }
     }
     
    OpenDisplayAPI.Run = function (AppID,AppClass,AppFunction, AppData, DoneCallBack, ErrorCallBack,HttpError){
      OpenDisplayAPI.AjaxLoading = true;
      OpenDisplayAPI.apiCall(ServerURL+"/webapi/"+AppID+"/"+AppClass+"/"+AppFunction,{ Token: $cookies.Token, RequestData: angular.toJson(AppData) },function (data, status, headers, config){
            if(data.ResponseHead.Code === 200){
                auth.authorised = true;
                if(DoneCallBack)
                 DoneCallBack(data.ResponseBody);
                 
                  OpenDisplayAPI.AjaxLoading = false;
            }else if(data.ResponseHead.Code === 401){
                OpenDisplayAPI.AjaxLoading = false;
                auth.authorised = false;
                $cookies.Token = "";
                RunLastCommandFunction = function(){
                   OpenDisplayAPI.apiCall(ServerURL+"/webapi/"+AppID+"/"+AppClass+"/"+AppFunction,{ Token: $cookies.Token, RequestData: angular.toJson(AppData) },function (data, status, headers, config){
                      if(data.ResponseHead.Code === 200){
                          auth.authorised = true;
                          if(DoneCallBack)
                           DoneCallBack(data.ResponseBody);
                      }else if(data.ResponseHead.Code === 401){
                          auth.authorised = false;
                          $cookies.Token = "";
                      }else{
                          console.log("Code: "+data.ResponseHead.Code+" Message: "+data.ResponseHead.Message);
                          if(ErrorCallBack)
                             ErrorCallBack(data.ResponseHead.Code,data.ResponseHead.Message);
                      }      
                    },HttpError);
                }
            } else if(data.ResponseHead.Code === 2000){
              window.location = ServerURL+"/wallet.html?SID="+$cookies.Token;
            } else {
                OpenDisplayAPI.AjaxLoading = false;
                console.log("Code: "+data.ResponseHead.Code+" Message: "+data.ResponseHead.Message);
                if(ErrorCallBack)
                   ErrorCallBack(data.ResponseHead.Code,data.ResponseHead.Message);
            }      
          },HttpError);
    } 
    
    OpenDisplayAPI.logout = function (){
       OpenDisplayAPI.apiCall(ServerURL+"/webapi/0/Authenticate/Logout",{ Token: $cookies.Token },function (data, status, headers, config){
                auth.authorised = false;
                $cookies.Token = "";
                $cookies.NewDeviceOnce = "";
                window.location.href = ServerURL+"/authenticate.html?AppID=CMS&logout=true";
        }); 
    }
    
   OpenDisplayAPI.apiCall = function (URL,Data,Done, Error){
      $http({method: 'POST',
      url: URL,
      transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
            if (obj.hasOwnProperty(p)) {
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
          return str.join("&");
      },
      data: Data,
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function(data, status, headers, config) {
            if(Done)
              Done(data, status, headers, config);
        }).error(function(data, status, headers, config) {
            if(Error)
              Error(data, status, headers, config);
        });
  }
  
});
