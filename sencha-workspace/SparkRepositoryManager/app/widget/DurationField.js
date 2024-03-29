Ext.define('SparkRepositoryManager.widget.DurationField', {
    extend: 'Ext.form.FieldContainer',
    xtype: 'srm-durationfield',
    requires: [
        'SparkRepositoryManager.widget.PostfixField',
        'Ext.form.FieldContainer',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox'
    ],


    initComponent: function() {
        var me = this,
            hourField = Ext.create('SparkRepositoryManager.widget.PostfixField', {
                maxValue: 8765,
                name: 'hours',
                minValue: 0,
                value: 0,
                emptyText: 'Hour(s)',
                postfix: 'hours',
                width: 100,
                padding: 5,
                defaultValue: 0,

                // TODO: Learn how to "proxy" or "redirect" events
                listeners: {
                    blur: function () {
                        me.fireEvent('blur', me);
                    }
                }
            }),
            minuteField = Ext.create('SparkRepositoryManager.widget.PostfixField', {
                width: 120,
                hourField: hourField,
                name: 'minutes',
                emptyText: 'Minutes(s)',
                postfix: 'minutes',
                value: 0,
                defaultValue: 0,
                padding: 5,

                listeners: {
                    blur: function () {
                        me.fireEvent('blur', me);
                    }
                }
            }),

            container = Ext.create('Ext.form.FieldContainer', {
                layout: 'hbox',

                defaults: {
                    flex: 1
                },

                fieldDefaults: {
                    msgTarget: 'under'
                },

                items: [
                    hourField,
                    minuteField
                ]
            });

        me.hourField = hourField;
        me.minuteField = minuteField;

        me.items = container;
        me.callParent();
    },

    layout: 'fit',

    setValue: function(duration) {
        var me = this,
            hours = duration ? Math.floor(duration / 60) : 0,
            minutes = duration ? duration - hours * 60 : 0;

        me.hourField.setValue(hours);
        me.minuteField.setValue(minutes);
    },

    getValue: function() {
        var me = this,
            hours = me.hourField.getValue(),
            minutes = me.minuteField.getValue();

        return hours * 60 + minutes;
    }
});
