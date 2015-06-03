/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.store.TeacherResources', {
    extend: 'Ext.data.Store',

    requires: [
        'Spark2Manager.model.TeacherResource'
    ],

    model: 'Spark2Manager.model.TeacherResource',

    autoSync: true,

    pageSize: 25,

    sorters:[
        {
            property:'Created',
            direction:'DESC'
        },
        {
            property:'Creator',
            direction:'DESC'
        }
    ],

    remoteSort: true,
    remoteFilter: true
});
