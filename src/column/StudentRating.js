Ext.define('SparkClassroom.column.StudentRating', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-studentrating',
    config: {
        enableEditing: false,

        dataIndex: 'student_rating',
        fieldName: 'rating', // This maps the records actual fieldname. TODO: find a better way to handle?

        width: 112,
        text: 'Rating',
        cell: {
            xtype: 'widgetcell',
            $configStrict: false,
            updateValue: function(val, oldVal) {
                var me = this,
                    widget = me.getWidget(),
                    column = me.getColumn(),
                    record = me.getRecord(),
                    _unpressAllBtns = function() {
                        widget.getItems().each(function(btn) {
                            var pressedCls = btn.getPressedCls();
                            btn.toggleCls(pressedCls, false);
                        });
                    },
                    btn, btnKey = 'student-thumbs';

                if (val >= 1) {
                    btnKey += 'up'
                } else if (val <= -1) {
                    btnKey += 'down';
                } else {
                    btnKey = null;
                }

                _unpressAllBtns();

                if (btnKey) {
                    btn = widget.getItems().getByKey(btnKey);
                    btn.toggleCls(btn.getPressedCls(), true);
                }
            },

            widget: {

                xtype: 'segmentedbutton',
                layout: {
                    align: 'stretch'
                },
                defaults: {
                    flex: 1,
                },

                items: [{
                    // iconCls: 'arrow_down icon-thumbs-down icon-arrow-down',
                    ui: 'round',
                    text: 'down',
                    itemId: 'student-thumbsdown'
                }, {
                    // iconCls: 'icon-thumbs-up icon-arrow-up',
                    ui: 'round',
                    text: 'up',
                    itemId: 'student-thumbsup'
                }],

                listeners: {
                    buffer: 500,
                    initialize: function() {
                        var widgetcell = this.getParent(),
                            column = widgetcell.getColumn(),
                            enableEditing = column.getEnableEditing();

                        this.setDisabled(!enableEditing);
                    },

                    toggle: function(segButton, btn, pressed) {
                        var widgetcell = this.getParent(),
                            record = widgetcell.getRecord(),
                            column = widgetcell.getColumn(),
                            dataIndex = column.getDataIndex(),
                            fieldName = column.getFieldName(),
                            liked = null;


                        if (column.getEnableEditing()) {
                            if (!pressed) {
                                record.set(fieldName, 0);
                            } else {
                                if (btn.getItemId() == 'student-thumbsup') {
                                    liked = 1;
                                } else {
                                    liked = -1;
                                }
                                record.set(fieldName, liked);
                            }

                            if (record.dirty && (record.store && !record.store.getAutoSync())) {
                                record.save();
                            }
                        }

                    }
                }
            }
        }
    },

    updateEnableEditing: function(enableEditing) {
        this.setText(enableEditing ? 'Your Rating' : 'Rating');
    }
});