/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.Students', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.model.person.Person',
        'Slate.proxy.Records'
    ],
    
    config: {
        model: 'Slate.model.person.Person',
        
        proxy: {
            type: 'slate-records',
            url: '/sections/ADV1-1/students'
        }
    }
});