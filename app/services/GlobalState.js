CMS.service('GlobalState', function ($http, $cookies, $location){
   var GlobalState = this;
   
   GlobalState.Devices = [];
   GlobalState.DeviceView = "deviceblok";
   GlobalState.DeviceViewPage = "app/pages/DeviceBlok.html";
   GlobalState.SearchValue = "";
   GlobalState.SearchValueDevices = "";
   
   GlobalState.ContentTreeList = [];
   GlobalState.ContentTreeSelected = 0;

});