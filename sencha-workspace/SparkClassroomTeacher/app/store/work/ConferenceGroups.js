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
            },
            {
                name: 'timer_started',
                allowNull: true
            },
            {
                name: 'timer_base',
                allowNull: true
            },
            {
                name: 'timer_banked',
                defaultValue: 0
            }
        ],
        sorters: 'id'
    }
});