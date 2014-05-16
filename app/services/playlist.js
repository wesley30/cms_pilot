CMS.service('Playlist', function ($http, $cookies, $location){
   this.SelectedItems = [];
 
   this.Get = function () {
     return this.SelectedItems;
   }
  
   this.ClearItems = function () {
     this.SelectedItems = [];
   }
   
   this.AddToList = function(Type,ID){
     var ListItem = {};
     
     ListItem.Type = Type;
     ListItem.ID   = ID;
     
     this.SelectedItems.push(ListItem);  
   }
});