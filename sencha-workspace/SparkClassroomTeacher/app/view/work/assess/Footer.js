Ext.define('SparkClassroomTeacher.view.work.assess.Footer', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-assess-footer',
    requires: [
        'SparkClassroom.widget.SparkpointField',
        'SparkClassroom.store.SparkpointsLookup'
    ],

    config: {
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
                    html: '<input class="select-all-checkbox" type="checkbox"><span>Select All</span>'
                },
                {
                    xtype: 'list',
                    itemId: 'sparkpointSelectList',
                    allowDeselect: true,
                    mode: 'MULTI',
                    hidden: true,
                    itemTpl: '<input type="checkbox">{code}',
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
                        selectionchange: function(list, recs, eOpts) {
                            var i, item;

                            for (i = 0; i < recs.length; i++) {
                                debugger;
                                item = list.getItem(recs[i]); // TODO why is getItem not defined??? http://docs.sencha.com/extjs/6.0.1/modern/src/List.js-1.html#Ext.dataview.List-method-getItem

                                // toggle checkbox
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
                    '.select-all-checkbox'
                ]
            }
        }
    },

    onElementClick: function(evt) {
        var me = this,
            list = me.query('#sparkpointSelectList')[0];

        if (evt.getTarget('.select-all-checkbox')) {
            if (evt.getTarget().checked) {
                list.selectAll();
            } else {
                list.deselectAll();
            }
        }
    }
});