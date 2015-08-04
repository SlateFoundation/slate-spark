/* global SparkRepositoryManager */
Ext.define('SparkRepositoryManager.overrides.PostgrestConnection', {
	override: 'Jarvus.connection.Postgrest',
    requires: [
        'SparkRepositoryManager.API'
    ]
}, function(PostgrestConnection) {
    var pageParams = Ext.Object.fromQueryString(location.search);

	// Configure connection while it's being required so that it's ready to go for any classes that require it
    if (pageParams.postgrestHost) {
        PostgrestConnection.setHost(pageParams.postgrestHost);
    } else {
        PostgrestConnection.setHost(SparkRepositoryManager.API.getHost());
        PostgrestConnection.setPathPrefix('/postgrest');
    }
});