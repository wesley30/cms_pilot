CMS.directive('cmsimageloader', function () {       
    return {
        link: function(scope, element, attrs) {   
            var d = new Date();
            var n = d.getTime();
                        
            //remove class after load
            element.bind("load" , function(event){ 
                    var dC = new Date();
                    var nC = dC.getTime();
               
                    if(nC > (n+100)){ 
                       element.removeClass("imageloading").addClass("imageloadinganimation");
                    }else{ 
                       element.removeClass("imageloading");
                    }
                    
            });

        }
    }
});