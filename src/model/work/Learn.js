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