/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.model.work.Learn', {
    extend: 'Ext.data.Model',

    fields: [
        'type',
        'title',
        'url',
        'dok',
        'rating',
        'score',
        'attachments',
        'vendor',
        {
            name: 'completed',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'srating',
            convert: function(v, r) {
                var rating = r.get('rating');

                return rating ? rating.student : null;
            }
        },
        {
            name: 'trating',
            convert: function(v, r) {
                var rating = r.get('rating');

                return rating ? rating.teacher : null;
            }
        }
    ]
});