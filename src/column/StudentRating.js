Ext.define('SparkClassroom.column.StudentRating', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-studentrating',
    cls: 'spark-column-studentrating',

    config: {
        enableEditing: false,

        dataIndex: 'user_rating',
        width: 112,
        text: 'Your Rating',

        renderer: function(val) {
            var enableEditing = this.getEnableEditing();
            return [
                //like button
                '<button type="button" class="plain spark-studentrating-like',
                    enableEditing ? '' : ' disabled',
                    val === 1 ? ' is-selected' : '',
                '">',
                    '<i class="fa fa-thumbs-up"></i>',
                    '<span class="visually-hidden">Like</span>',
                '</button>',
                //dislike button
                '<button type="button" class="plain spark-studentrating-dislike',
                enableEditing ? '' : ' disabled',
                    val === -1 ? ' is-selected' : '',
                '">',
                    '<i class="fa fa-thumbs-down"></i>',
                    '<span class="visually-hidden">Dislike</span>',
                '</button>'
            ].join('');
        },

        cell: {
            encodeHtml: false,
            listeners: {
                element: 'element',
                delegate: 'button',

                tap: function(ev, t) {
                    var button = Ext.fly(ev.currentTarget),
                        record = this.getRecord(),
                        selectedCls = 'is-selected',
                        rating = 0;

                    if (!button.hasCls(selectedCls)) {
                        if (button.hasCls('spark-studentrating-like')) {
                            rating = 1;
                        } else if (button.hasCls('spark-studentrating-dislike')) {
                            rating = -1;
                        }
                    }

                    record.set({
                        rating: rating
                    });

                    //save record && convert rating back into object afterwards.
                    if (record.dirty && (record.store && !record.store.getAutoSync())) {
                        record.save({
                            success: function() {
                                record.set({
                                    rating: {
                                        user: rating
                                    }
                                }, {dirty: false});
                            }
                        });
                    } else {
                        record.store.on('update', function(store, record, operation, modifiedFieldNames) {
                            record.set('rating', {
                                user: record.get('rating')
                            }, {dirty: false});
                        }, null, {single: true});
                    }

                }
            }
        }
    }
});