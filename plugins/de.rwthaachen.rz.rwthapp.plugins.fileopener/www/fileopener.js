cordova.define("de.rwthaachen.rz.rwthapp.plugins.fileopener.FileOpener", function(require, exports, module) {var fileopener = {
	open:function (url, failureCB) {
      	 	var success = function() {
       			console.log("success!");
       		}
       		var failure = function(error) {
      			console.log(error);
			if(typeof failureCB === "function"){            
				failureCB(error);
	   		}
		}
		cordova.exec(success, failure, "FileOpener", "openFile", [url]);
	}
}
module.exports = fileopener;





});
