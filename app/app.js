var CMS = angular.module('CMS', 
['ngRoute', 
'ngAnimate', 
'ngCookies', 
'placeholders',
'ngSanitize', 
'mgcrea.ngStrap',
'lrDragNDrop',
'countrySelect', 
'gettext']).run(function (gettextCatalog) {
    //gettextCatalog.debug = true;
    
}).config(function($dropdownProvider) {
  angular.extend($dropdownProvider.defaults, {
    html: true
  });
})


CMS.config(function ($routeProvider){
  $routeProvider.when('/home',{
    controller: 'home',
    templateUrl: "app/pages/Home.html"
  }).when('/contenttree',{
    controller: 'contenttree',
    templateUrl: "app/pages/ContentTree.html"
  }).when('/alpha',{
    controller: 'alpha',
    templateUrl: "app/pages/alpha.html"
  }).when('/account',{
    controller: 'account',
    templateUrl: "app/pages/Account.html"
  }).when('/devices',{
    controller: 'devices',
    templateUrl: "app/pages/Devices.html"
  }).when('/files',{
    controller: 'files',
    templateUrl: "app/pages/Files.html"
  }).when('/playlist',{
    controller: 'playlist',
    templateUrl: "app/pages/Playlist.html"
  }).when('/themes',{
    controller: 'themes',
    templateUrl: "app/pages/Themes.html"
  }).when('/settings',{
    templateUrl: "app/pages/Settings.html"
  }).when('/deviceview',{
     controller: 'deviceview',
     templateUrl: "app/pages/DeviceView.html"
  }).when('/newdevice',{
     controller: 'devices',
     templateUrl: "app/pages/newdevice.html"
  }).when('/login/:Token',{
    controller: 'login',
    templateUrl: "app/pages/logindone.html"
  }).otherwise({ redirectTo: '/home' });
});