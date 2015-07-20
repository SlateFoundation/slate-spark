Ext.define('SparkRepositoryManager.controller.Sparkpoints', {
    extend: 'Ext.app.Controller',

    views: [
        'sparkpoints.Panel',
        'sparkpoints.NavPanel',
        'sparkpoints.content.TabPanel',
        'sparkpoints.content.Grid',
        'sparkpoints.content.Graph',
        'sparkpoints.content.Coverage',
        'sparkpoints.content.DetailsView',
        'sparkpoints.content.DetailsForm',
        'sparkpoints.content.Dependencies',
        'sparkpoints.content.Dependents',
        'sparkpoints.standards.NavPanel',
        'sparkpoints.standards.Grid'
    ]

});
