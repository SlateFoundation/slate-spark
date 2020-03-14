/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.proxy.StudentSparkpoints', {
    extend: 'Slate.proxy.API',
    alias: 'proxy.spark-studentsparkpoints',

    config: {
        idParam: null, // prevent automatically sending client generated idProperty over the wire
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