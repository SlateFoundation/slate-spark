/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.work.ConferenceGroups', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            {
                name: 'id',
                type: 'integer'
            },
            {
                name: 'members'
            }
        ],
        sorters: 'id'
    }
});