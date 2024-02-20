const NewDatabase = (() => {
  let globalNewDatabase = -1;

  const getValue = () => globalNewDatabase;
  const setValue = (newValue) => { globalNewDatabase = newValue; };

  return { getValue, setValue };
})();

// Override existing openDatabase to automatically provide the `key` option
var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {

    return originalOpenDatabase.call(window.sqlitePlugin, options, successCallback, function() {
	    sqlitePlugin.deleteDatabase(options, function() {
		    NewDatabase.setValue(1);
		    window.sqlitePlugin.openDatabase(options, successCallback, errorCallback);
	    }, function() {
		    errorCallback();
	    });
    });
};

module.exports = new NewDatabase();
