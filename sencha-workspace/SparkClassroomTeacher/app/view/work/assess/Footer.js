Ext.define('SparkClassroomTeacher.view.work.assess.Footer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-assess-footer',
    requires: [
        'SparkClassroom.widget.SparkpointField',
        'SparkClassroom.store.SparkpointsLookup'
    ],

    config: {
        cls: 'assess-footer',
        layout: 'hbox',
        defaults: {
            xtype: 'button',
            ui: 'action'
        },
        items: [
            {
                text: 'Assign Learns',
                margin: '0 16 0 0',
                disabled: true,
                hidden: true
            },
            {
                text: 'Schedule Interaction',
                disabled: true,
                hidden: true
            },
            {
                xtype: 'spark-sparkpointfield',
                placeHolder: 'Suggest Next Sparkpoint',
                width: 190
            },
            {
                itemId: 'suggestBtn',
                text: 'Suggest Next Sparkpoint',
                margin: '0 16 0 0',
                height: 37
            },
            {
                xtype: 'component',
                flex: 1
            },
            {
                xtype: 'panel',
                cls: 'sparkpoint-select-list',
                items: [{
                    xtype: 'component',
                    docked: 'top',
                    padding: '9.6px 14.4px',
                    html: '<div class="select-all select-indicator"></div><span>Select All</span>'
                },
                {
                    xtype: 'list',
                    itemId: 'sparkpointSelectList',
                    allowDeselect: true,
                    mode: 'MULTI',
                    hidden: true,
                    itemTpl: '<div class="select-indicator" data-id="{id}"></div>{code}',
                    store: {
                        fields: [{
                            name: 'code',
                            type: 'string'
                        },
                        {
                            name: 'id',
                            type: 'string'
                        },
                        {
                            name: 'willBeEvaluated',
                            type: 'bool'
                        }]
                    },
                    listeners: {
                        refresh: function(list) {
                            var recs = list.getStore().getRange(),
                                record, i;

                            if (!recs || recs.length === 0) {
                                return;
                            }

                            for (i = 0; i < recs.length; i++) {
                                record = recs[i];

                                if (record.get('willBeEvaluated') && !list.isSelected(record)) {
                                    list.select(record, true);
                                }
                            }
                        }
                    }
                }]
            },
            {
                itemId: 'completeBtn',
                text: 'Mark Standard Complete',
                iconCls: 'fa fa-check',
                height: 37
            }
        ],
        listeners: {
            click: {
                element: 'element',
                fn: 'onElementClick',
                delegate: [
                    '.select-all'
                ]
            }
        }
    },

    onElementClick: function(evt) {
        var me = this,
            list = me.query('#sparkpointSelectList')[0],
            target = Ext.fly(evt.getTarget());

        if (target.hasCls('select-all')) {
            if (target.hasCls('selected')) {
                target.removeCls('selected');
                list.deselectAll();
            } else {
                target.addCls('selected');
                list.selectAll();
            }
        }
    }
});