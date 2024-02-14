// Override existing openDatabase to automatically provide the `key` option
var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {
    return acquireLsk(
        function (key) {
            // Clone the options
            var newOptions = {};
            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    newOptions[prop] = options[prop];
                }
            }
            
            // Ensure `location` is set (it is mandatory now)
            if (newOptions.location === undefined) {
                newOptions.location = "default";
            }
            
            // Set the `key` to the one provided
            newOptions.key = key;

            // Validate the options and call the original openDatabase
            validateDbOptions(newOptions);
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