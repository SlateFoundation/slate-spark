/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Students', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.Records'
    ],


    model: 'Slate.model.person.Person',

    config: {
        proxy: {
            type: 'slate-records',
            limitParam: false,
            startParam: false
        },
        sorters: [{
            property: 'LastName',
            direction: 'ASC'
        },{
            property: 'FirstName',
            direction: 'ASC'
        }]
    },

    onProxyLoad: function() {
        this.callParent(arguments);
        this.studentIdStrings = null;
    },

    getStudentIdStrings: function() {
        var me = this,
            studentIdStrings = me.studentIdStrings,
            studentsLength, i = 0;

        if (!studentIdStrings) {
            studentIdStrings = [];
            studentsLength = me.getCount();

            for (; i < studentsLength; i++) {
                studentIdStrings.push(me.getAt(i).getId().toString());
            }

            me.studentIdStrings = studentIdStrings;
        }

        return studentIdStrings;
    }
});