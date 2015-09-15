Ext.define('SparkClassroom.standards.Container', {
    extend: 'Ext.Container',
    requires: [
        'SparkClassroom.standards.Grid'
    ],
    xtype: 'spark-standards',

    config: {
        cls: 'page-wrap',
        items: [
            { xtype: 'spark-standards-grid' }
        ]
    }
});