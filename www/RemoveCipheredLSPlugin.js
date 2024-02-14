// Override existing openDatabase to automaticly cdelete and recreate a sqllte database when it is corrupt

var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {

    return originalOpenDatabase.call(window.sqlitePlugin, options, successCallback, function() {

        var now = new Date();
        now.setTime(now.getTime() + 1 * 3600 * 1000);
        var dbObj = { name: ApplicationInfo.getDatabaseName(), location: "default" };

            return originalOpenDatabase.call(window.sqlitePlugin, newOptions, successCallback, function() {
		    sqlitePlugin.deleteDatabase(options, function() {
			    window.sqlitePlugin.openDatabase(options, successCallback, errorCallback);
		    }, function() {
			    errorCallback();
		    });
	    });
        },
        errorCallback);
};
