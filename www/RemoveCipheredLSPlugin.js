// Override existing openDatabase to automatically provide the `key` option
var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {

    return originalOpenDatabase.call(window.sqlitePlugin, options, successCallback, function() {
	    sqlitePlugin.deleteDatabase(options, function() {
		    window.sqlitePlugin.openDatabase(options, successCallback, errorCallback);
	    }, function() {
		    errorCallback();
	    });
    });
};
