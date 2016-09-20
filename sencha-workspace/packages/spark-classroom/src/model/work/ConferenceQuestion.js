/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.ConferenceQuestion', {
    extend: 'Ext.data.Model',


    idProperty: 'resource_id',
    fields: [
        {
            name: 'resource_id',
            type: 'int'
        },
        'source',
        'question',
        'gradeLevel',

        // for teacher assign UI
        {
            name: 'assignments',
            persist: false,

            // TODO: remove default to assignment when assignment gets changes to assignments in work/learns API response
            convert: function(v, r) {
                return v || r.get('assignment') || {};
            }
        }
    ]
});