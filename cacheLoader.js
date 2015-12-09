(function() {

  'use strict';

  window.cachedLoader = {};
  
  var cachedLoader = window.cachedLoader;

  /**
   * Handles local storage
   */
  cachedLoader.storageManager = {
    putFile: function(key, value) {
      window.localStorage.setItem(key, value);
    },
    getFile: function(key) {
      return window.localStorage.getItem(key);
    }
  };

  /**
   * Makes XMLHttpRequest for files and returns promise
   */
  cachedLoader.loadFile = function(fileName) {
    var local = this;
    return new Promise(function(resolve, reject) {
      var script = local.storageManager.getFile(fileName);
      if (local.debug) {
        script = false;
      }
      if (script) {
        resolve(script);
      } else {
        var oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function() {
          local.storageManager.putFile(fileName, this.responseText);
          resolve(this.responseText);
        });
        oReq.open("GET", fileName);
        oReq.send();
      }
    });
  }

  /**
   * Handles css Files
   */
  cachedLoader.styleList = [];
  cachedLoader.addStyle = function(styleName) {
    this.styleList.push(styleName);
  }

  /**
   * Handles js Files
   */
  cachedLoader.jsList = [];
  cachedLoader.addJs = function(jsName) {
    this.jsList.push(jsName);
  }

  /**
   * If set gets new version of files
   */
  cachedLoader.debug = false;
  cachedLoader.setDebug = function(bool) {
    this.debug = bool;
  }

  /**
   * Begins load of js list
   */
  cachedLoader.loadJs = function() {
    var local = this;
    return new Promise(function(resolve, reject) {
      var promiseList = [];
      local.jsList.forEach(function(js) {
        promiseList.push(local.loadFile(js))
      });
      Promise.all(promiseList)
        .then(function(scripts) {
          scripts.forEach(function(script) {
            eval(script);
          });
          resolve();
        });
    });
  }

  /**
   * Begins load of style list
   */
  cachedLoader.loadStyle = function() {
    var local = this;
    return new Promise(function(resolve, reject) {
      var promiseList = [];
      local.styleList.forEach(function(style) {
        promiseList.push(local.loadFile(style));
      });

      Promise.all(promiseList)
        .then(function(styles) {
          styles.forEach(function(style) {
            var styleTag = document.createElement("style");
            styleTag.innerHTML = style;
            document.getElementsByTagName("head")[0].appendChild(styleTag);
          });
          resolve();
        });
    });
  }

  /**
   * Starts load
   */
  cachedLoader.load = function() {
    var stylePromise = this.loadStyle();
    var jsPromise = this.loadJs();

    return Promise.all([stylePromise, jsPromise]);
  }
})();
