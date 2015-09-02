/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.Students', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.model.person.Person',
        'Slate.proxy.Records'
    ],
    
    config: {
        model: 'Slate.model.person.Person',
        
        proxy: {
            type: 'slate-records',
            url: '/sections/Geometry/students?format=json'
        },

        // TODO: Replace generated data with real data
        listeners: {
            load: function(store, records){
                for(var i = 0; i < records.length; i++){
                    
                    var status = ['Learn', 'Conference', 'Apply', 'Assess'],
                        grades = ['L', '*', 'G', 'N'];
                        mod = i % 4,
                        record = records[i];

                    record.set({
                        GPSStatus: status[mod],
                        Standards: ['CC.Content', 'CC.SS.Math.Content'],
                        Help: mod == 2 ? true : '',
                        Grade: grades[mod]
                    });

                    if(mod == 3){
                        record.set({
                            Priority: 2
                        })
                    }
                }
            }
        }

    }
});