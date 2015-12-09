var jsList = ["angular.min.js", "angular-route.min.js", "angular-animate.min.js", "angular-aria.min.js", "angular-messages.min.js", "angular-material.min.js", "app.js"]; 

jsList.forEach(function(file) { 
  cachedLoader.addJs('js/' + file); 
}); 
 
cachedLoader.addStyle('style/angular-material.min.css'); 
 
cachedLoader.load() 
  .then(function() { 
    angular.bootstrap(document, ['app']); 
  }); 

