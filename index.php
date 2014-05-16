<!DOCTYPE html>
<html lang="en" ng-app="CMS">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>CMS</title>
    
    <!-- Bootstrap core CSS -->
    <link href="angular/css/bootstrap.min.css" rel="stylesheet">
    <link href="angular/css/bootstrap-additions.min.css" rel="stylesheet">
    <link href="angular/css/angular-motion.min.css" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
    <link href="css/home.css" rel="stylesheet">
    <link href="css/contenttree.css" rel="stylesheet">
    <link href="css/wizard.css" rel="stylesheet">
    <link href="css/boolean.css" rel="stylesheet">
    <link href="css/playlist.css" rel="stylesheet">
  </head>
  <body ng-init="loading = false" ng-controller="main" class="ng-cloak" >
  
    <div class="navbar navbar-default" role="navigation" bs-navbar="" ng-show="LoadContent">
      <div class="navbar-header">
        <a class="navbar-brand" href="#" style="width: 50px;"><img ng-src="images/loading_bg.gif" ng-show="OpenDisplayApiLink.AjaxLoading" /></a>
      </div>
      <ul class="nav navbar-nav">
        <li data-match-route="/home"><a href="#/home"><span class="glyphicon glyphicon-home"></span> <span translate="">Home</span></a></li>
        
        <span translate="" style="margin-right: 5px;position: absolute;right: 135px;top: 15px; color:white;" ng-show="AccountInfo.UserName">Hello, {{ AccountInfo.UserName }} </span>
        
        <a href="https://connect.novaapi.com/authenticate.html?AppID=MyApps" style="margin-right: 50px;position: absolute;right: 39px;top: 0px;padding: 9px !important;" class="btn navbar-btn btn-success navbar-right glyphicon glyphicon-th"></a>
        <a  href="" style="margin-right: 5px;position: absolute;right: 11px;top: 0px; padding: 6px !important;" data-loginbutton="" class="btn navbar-btn navbar-right btn-success">Sign in</a>
      </ul>
    </div>
   
  <div style="margin-left:5px;margin-right:5px;" data-ng-view="" ng-show="LoadContent"></div>
  <div id="alerts-container"></div>
  <div ng-hide="LoadContent"><span translate="">Loading</span> <img ng-src="images/loading.gif" ></div>
  <div class="Loading" ng-show="loading"></div>
  </body>
  <script src="angular/js/angular.min.js"></script>
  <script src="angular/js/angular-route.min.js"></script>
  <script src="angular/js/angular-animate.min.js"></script>
  <script src="angular/js/angular-cookies.min.js"></script>
  <script src="angular/js/angular-sanitize.min.js"></script>
  <script src="angular/js/placeholders.js"></script>
  <script src="angular/js/lrDragNDrop.js"></script>
  <script src="angular/js/country-select.js"></script>
  <script src="angular/js/angular-gettext.min.js"></script>
  
  <script src="angular/js/angular-strap.min.js"></script>
  <script src="angular/js/angular-strap.tpl.min.js"></script>
  
  <script src="app/app.js"></script>
  
  <script src="app/lang/nl.js"></script>
  
  <script src="app/services/api.js"></script>
  <script src="app/services/playlist.js"></script>
  <script src="app/services/contenttree.js"></script>
  <script src="app/services/GlobalState.js"></script>
  
  <script src="app/directive/login.js"></script>
  <script src="app/directive/device.js"></script>
  <script src="app/directive/imageloader.js"></script>
  <script src="app/directive/autofocus.js"></script>
  <script src="app/directive/onenter.js"></script>
  
  <script src="app/controllers/main.js"></script>
  <script src="app/controllers/account.js"></script>
  <script src="app/controllers/contenttree.js"></script>
  <script src="app/controllers/devices.js"></script>
  <script src="app/controllers/files.js"></script>
  <script src="app/controllers/home.js"></script>
  <script src="app/controllers/login.js"></script>
  <script src="app/controllers/playlist.js"></script>
  <script src="app/controllers/themes.js"></script>
  <script src="app/controllers/DeviceView.js"></script>
  <script src="app/controllers/alpha.js"></script>
</html>