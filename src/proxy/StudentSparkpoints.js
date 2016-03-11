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
                    record.student_sparkpoint = record.student_id + '-' + record.sparkpoint_id;
                }
                return data;
            }
        },

        writer: {
            type: 'json',
            allowSingle: true,
            writeRecordId: false
        }
    }
});