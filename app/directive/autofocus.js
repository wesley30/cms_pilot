CMS.directive('autofocus', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope

    link: function(scope, element, attrs) {
          $timeout(function() {
            element[0].focus(); 
          },100);
    }
  };
});