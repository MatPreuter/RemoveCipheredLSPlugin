// Override existing openDatabase to automatically provide the `key` option
var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {

    return originalOpenDatabase.call(window.sqlitePlugin, newOptions, successCallback, function() {
    sqlitePlugin.deleteDatabase(options, function() {
        var now = new Date();
        now.setTime(now.getTime() + 1 * 3600 * 1000);

        document.cookie = "NewDatabaseIsCreated=1; expires=" + now.toUTCString() + "; path=/";

        window.sqlitePlugin.openDatabase(options, successCallback, errorCallback);
    }, function() {
        errorCallback();
    });
};