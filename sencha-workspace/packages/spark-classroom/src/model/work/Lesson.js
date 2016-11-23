Ext.define('SparkClassroom.model.work.Lesson', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.API'
    ],

    idProperty: 'id',
    fields: [],

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/modules'
    }
});