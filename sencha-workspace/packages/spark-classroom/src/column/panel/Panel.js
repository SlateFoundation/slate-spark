Ext.define('SparkClassroom.column.panel.Panel', {
    extend: 'Ext.Panel',
    xtype: 'spark-column-panel',

    config: {
        baseCls: 'spark-column-panel',
        left: 0 // left is required due to bug EXTJS-17697
    }
});