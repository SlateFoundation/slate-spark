// TODO: this is a dev workaround to contact a different API host
Ext.define('SparkRepositoryManager.proxy.SandboxSchool', {
    extend: 'Jarvus.proxy.API',
    alias: 'proxy.sandbox-school',
    requires: [
        'SparkRepositoryManager.SandboxSchoolAPI'
    ],

    connection: 'SparkRepositoryManager.SandboxSchoolAPI',

    getMethod: function(request) {
        switch (request.getAction()) {
            case 'create':
                return 'PATCH';
            case 'read':
                return 'GET';
            case 'update':
                return 'PATCH';
            case 'destroy':
                return 'DELETE';
            default:
                return 'GET';
        }
    }
});
