// Override existing openDatabase to automaticly cdelete and recreate a sqllte database when it is corrupt
var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {

    return originalOpenDatabase.call(window.sqlitePlugin, newOptions, successCallback, function() {

        var now = new Date();
        now.setTime(now.getTime() + 1 * 3600 * 1000);
        var dbObj = { name: ApplicationInfo.getDatabaseName(), location: "default" };

        sqlitePlugin.openDatabase(dbObj, function(db) {
       
        // Tests the connection to SQL Lite
        db.transaction(function(tx) {
            tx.addStatement("PRAGMA journal_mode;", [], function() { 
                // Success - connection is working, no need to upgrade

            }, function() {
                // Error - connection is not working, likely the database file is corrupt
                // Delete the database, and reload the screen so a new empty database will be created
                document.cookie = "NewDatabaseIsCreated=1; expires=" + now.toUTCString() + "; path=/";

                sqlitePlugin.deleteDatabase(dbObj, function() {
                    var now = new Date();
                    now.setTime(now.getTime() + 1 * 3600 * 1000);

                    document.cookie = "NewDatabaseIsCreated=1; expires=" + now.toUTCString() + "; path=/";

                    sqlitePlugin.openDatabase(options, successCallback, errorCallback);
                });
            });
        })
    });
};
