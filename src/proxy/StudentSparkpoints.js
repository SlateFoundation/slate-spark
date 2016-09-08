/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.proxy.StudentSparkpoints', {
    extend: 'Slate.proxy.API',
    alias: 'proxy.spark-studentsparkpoints',

    config: {
        reader: {
            type: 'json',
            transform: function(data) {
                var i = 0, length = data.length,
                    record;

                for (; i < length; i++) {
                    record = data[i];
                    record.student_sparkpointid = record.student_id + '_' + record.sparkpoint_id;
                }
                return data;
            }
        },

        batchActions: false,

        writer: {
            type: 'json',
            allowSingle: true,
            writeRecordId: false
        }
    }
});