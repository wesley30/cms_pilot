//login button functions
CMS.directive('loginbutton', function(OpenDisplayAPI, $cookies, $modal,$timeout,gettextCatalog) {
    return {
        link: function (scope, element, attrs){
           var LoginModal = $modal({scope: scope, template: 'app/pages/Login.html', show: false});
           var TimerOutLogin = null;
     
          //login cheker 
          scope.$watch(function() { 
              return $cookies.Token;
          }, function(newValue, oldValue) { 
              if(newValue){                 
                        element.html(gettextCatalog.getString("Sign out"));
                        element.removeClass("btn-success").addClass('btn-primary');
                        angular.element(document.querySelector('.button-myapps')).removeClass('hide');
                        
                        if(LoginModal){
                        try{
                          LoginModal.hide();
                          }catch(e){}
                        }
                        
                       OpenDisplayAPI.ForceAuthorised(); 
                       OpenDisplayAPI.RunLastCommand();                     
              }else{
                  if(TimerOutLogin)
                     $timeout.cancel(TimerOutLogin);
                  
                  TimerOutLogin = $timeout(function (){
                      if(!$cookies.Token){
                          element.html(gettextCatalog.getString("Sign in"));
                          element.removeClass("btn-primary").addClass('btn-success');
                          angular.element(document.querySelector('.button-myapps')).addClass('hide');
                                            
                          LoginModal.$promise.then(function() {
                             if(!$cookies.Token)
                               LoginModal.show();
                          });
                     }else{ 
                        element.html(gettextCatalog.getString("Sign out"));
                        element.removeClass("btn-success").addClass('btn-primary');
                        angular.element(document.querySelector('.button-myapps')).removeClass('hide');
                        
                        if(LoginModal){
                        try{
                          LoginModal.hide();
                          }catch(e){}
                        }
                     }
                 },3000);
              }   
          });
          
          if(OpenDisplayAPI.authorised()){ 
              if(LoginModal){
                try{
                  LoginModal.hide();
                  }catch(e){}
              }
              
              element.html(gettextCatalog.getString("Sign out"));
              element.removeClass("btn-success").addClass('btn-primary');
              angular.element(document.querySelector('.button-myapps')).removeClass('hide');
          }

          //login button event   
          element.bind('click', function (e){
               if(!OpenDisplayAPI.authorised()){
                   LoginModal.$promise.then(function() {
                       LoginModal.show();
                  });
               }else {
                   OpenDisplayAPI.logout();
               }
          });
        }
    };
 
  
});