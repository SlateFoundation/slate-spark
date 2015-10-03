/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomStudent.model.work.ConferenceQuestion', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id',
            'question',
            'gradeLevel'
        ],

        proxy: {
            type: 'slate-records',
            url: '/spark/api/work/conferences',
            extraParams: {
                sparkpoints: 'MATH.G9-12.BF.4.b'
            }
        }

    }
});
