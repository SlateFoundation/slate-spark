Ext.define('Spark2Manager.widget.DurationField', {
    extend: 'Ext.form.FieldContainer',

    requires: [
        'Spark2Manager.widget.PostfixField',
        'Ext.form.FieldContainer',
        'Ext.layout.container.Fit',
        'Ext.layout.container.HBox'
    ],

    xtype: 's2m.durationfield',

    alias: 'widget.durationfield',

    config: {
        duration: 0
    },

    initComponent: function() {
        var me = this,
            hourField = Ext.create('Spark2Manager.widget.PostfixField', {
                maxValue: 8765,
                name: 'hours',
                minValue: 0,
                value: 0,
                emptyText: 'Hour(s)',
                postfix: 'hours',
                width: 100,
                padding: 5
            }),
            minuteField = Ext.create('Spark2Manager.widget.PostfixField', {
                width: 120,
                hourField: hourField,
                name: 'minutes',
                emptyText: 'Minutes(s)',
                postfix: 'minutes',
                value: 0,
                padding: 5
            }),
            hours = this.duration ? Math.floor(this.duration / 60) : 0,
            minutes = this.duration ? this.duration - (hours * 60) : 0,
            container = Ext.create('Ext.form.FieldContainer', {
                layout: 'hbox',

                items: [
                    hourField,
                    minuteField
                ]
            });

        if (this.duration) {
            hourField.setValue(hours);
            minuteField.setValue(minutes);
        }

        me.items = container;
        me.callParent();
    },

    layout: 'fit',

    items: [{
        xtype: 'fieldcontainer',

        layout: 'fit',

        defaults: {
            flex: 1
        },

        fieldDefaults: {
            msgTarget: 'under'
        },

        items: []
    }]
});
