window.NewDatabaseIsCreated = -1;

function GetNewDatabaseIsCreated() {
  return window.NewDatabaseIsCreated;
};

// Override existing openDatabase to automatically provide the `key` option
var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {

    return originalOpenDatabase.call(window.sqlitePlugin, options, successCallback, function() {
	    sqlitePlugin.deleteDatabase(options, function() {
		    window.NewDatabaseIsCreated = 1;
		    window.sqlitePlugin.openDatabase(options, successCallback, errorCallback);
	    }, function() {
		    errorCallback();
	    });
    });
};

module.exports = new GetNewDatabaseIsCreated();
