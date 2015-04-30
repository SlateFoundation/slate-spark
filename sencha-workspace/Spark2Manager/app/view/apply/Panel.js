Ext.define('Spark2Manager.view.apply.Panel', {
    requires: [
        'Spark2Manager.store.ApplyProjects',
        'Spark2Manager.store.ApplyLinks',
        'Spark2Manager.store.ApplyToDos'
    ],

    extend: 'Ext.Container',

    xtype: 's2m-apply-panel',

    html: '<h1>Apply</h1>'
});
