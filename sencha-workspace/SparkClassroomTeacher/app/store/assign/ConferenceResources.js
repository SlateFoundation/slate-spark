/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.ConferenceResources', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],


    model: 'SparkClassroom.model.work.ConferenceResource',

    config: {
        autoSync: true,
        trackRemoved: false,

        proxy: {
            type: 'slate-api',
            url: '/spark/api/assign/conference_resources',
            reader: {
                type: 'json',
                keepRawData: true,
                messageProperty: 'error',
                rootProperty: 'conference_resources'
            }
        }
    }

/*
    config: {
        fields: [
            'sparkpoints',
            'title',
            'url',
            'grade',
            'created',
            'created_by',
            'assign'
        ],

        data: [
            {sparkpoints: ['9.LE.A.2'], url: 'http://asn.org', title: 'ASN Resource Page for: 9.LE.A.2', created: '5/16/15', created_by: 'Diania Henderson', grade: 11, assign: false},
            {sparkpoints: ['9.CO.C.11'], url: 'http://google.com', title: 'Google Search for 9.CO.C.11', created: '5/16/15', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['9.IF.A.1','9.LE.A.3'], url: 'http://google.com', title: 'Google Search for 9.IF.A.1', created: '5/16/15', created_by: 'Diania Henderson', grade: 11, assign: false},
            {sparkpoints: ['9.LE.A.2'], url: 'http://asn.org', title: 'ASN Resource Page for: 9.LE.A.2', created: '5/16/15', created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9.CO.C.11'], url: 'http://google.com', title: 'Google Search for 9.CO.C.11', created: '5/16/15', created_by: 'Diania Henderson', grade: 11, assign: false},
            {sparkpoints: ['9.IF.A.1','9.LE.A.3'], url: 'http://google.com', title: 'Google Search for 9.LE.A.3', created: '5/16/15', created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9.IF.C.7'], url: 'http://asn.org', title: 'ASN Resource Page for: 9.IF.C.7', created: '5/16/15', created_by: 'Diania Henderson', grade: 11, assign: false},
            {sparkpoints: ['9.REI.D.11'], url: 'http://asn.org', title: 'ASN Resource Page for: 9.REI.D.11', created: '5/16/15', created_by: 'Milton Jossund', grade: 9, assign: true},
            {sparkpoints: ['9.REI.D.11'], url: 'http://google.com', title: 'Google Search for 9.REI.D.11', created: '5/16/15', created_by: 'Nithi Thomas', grade: 11, assign: false},
            {sparkpoints: ['9.IF.C.7'], url: 'http://asn.org', title: 'ASN Resource Page for: 9.IF.C.7', created: '5/16/15', created_by: 'Diania Henderson', grade: 9, assign: true}
        ]
    }
*/
});