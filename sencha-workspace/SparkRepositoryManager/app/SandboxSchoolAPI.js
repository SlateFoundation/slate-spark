// TODO: this is a dev workaround to contact a different API host
Ext.define('SparkRepositoryManager.SandboxSchoolAPI', {
    extend: 'Emergence.util.AbstractAPI',
    singleton: true,

    host: 'sandbox-school.matchbooklearning.com',
    useSSL: true

});
