/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.apply.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-work-apply',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.widget.Panel',
        'SparkClassroom.widget.SimpleHeading',
        'SparkClassroom.column.Completed'
    ],

    config: {
        itemId: 'apply',

        items: [
            {
                itemId: 'applyPickerCt',

                items: [
                    {
                        itemId: 'appliesGrid',

                        xtype: 'grid',
                        plugins: [
                            'gridflex',
                            'gridheight'
                        ],
                        titleBar: false,
                        emptyText: 'No Applies to show for this Sparkpoint.',
                        columns: [
                            {
                                xtype: 'spark-completed-column'
                            },
                            {
                                xtype: 'templatecolumn',
                                flex: 1,
                                cell: { encodeHtml: false },
                                tpl: [
                                    '<div class="spark-grid-row-title">{title}</div>',
                                    '<tpl if="instructions"><div class="spark-grid-row-detail">{instructions}</div></tpl>'
                                ]
                            },
                            {
                                xtype: 'templatecolumn',
                                text: 'Sparkpoints',
                                dataIndex: 'sparkpointCodes',
                                cell: { encodeHtml: false },
                                tpl: [
                                    '<tpl if="sparkpointCodes">',
                                        '<ul class="spark-grid-token-list">',
                                            '<tpl for="sparkpointCodes"><li class="spark-grid-token-item">{.}</li></tpl>',
                                        '</ul>',
                                    '</tpl>'
                                ],
                                width: 320
                            }
                        ],
                        store: 'work.Applies'
                    },
                    {
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [
                            {
                                itemId: 'chooseSelectedApplyBtn',

                                xtype: 'button',
                                disabled: true,
                                ui: 'action',
                                text: 'Choose Selected Apply &rarr;' // TODO polish this copy? include apply name?
                            }
                        ]
                    }
                ]
            },
            {
                itemId: 'selectedApplyCt',

                hidden: true,
                items: [
                    {
                        itemId: 'chooseAgainBtn',

                        xtype: 'button',
                        width: 300,
                        text: '&larr; Choose a different apply'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                itemId: 'headerCmp',

                                xtype: 'component',
                                flex: 1,
                                tpl: [
                                    '<h1 class="spark-view-headline">{title:htmlEncode}</h1>',
                                    '<div class="spark-view-prompt"><p>{instructions:htmlEncode}</p></div>' // TODO: support markdown
                                ]
                            },
                            {
                                xtype: 'container',
                                cls: 'sidebar-col',
                                layout: {
                                    type: 'vbox',
                                    align: 'end'
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        ui: 'action',
                                        text: 'Grading Rubric'
                                    },
                                    {
                                        cls: 'text-right',
                                        data: {
                                            'Start Date': '2015-03-05',
                                            'Est. End Date': '2015-03-09'
                                        },
                                        tpl: [
                                            '<dl class="kv-list align-right">',
                                                '<tpl for="this.objectToArray(values)">',
                                                    '<div class="kv-pair">',
                                                        '<dt class="kv-key">{key}</dt>',
                                                        '<dd class="kv-value">{value:date}</dd>',
                                                    '</div>',
                                                '</tpl>',
                                            '</dl>',
                                            {
                                                objectToArray: function(values){
                                                    var array = [];
                                                    for(var key in values){
                                                        if(values.hasOwnProperty(key)){
                                                            array.push({key: key, value: values[key]});
                                                        }
                                                    }
                                                    return array;
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                flex: 1,
                                xtype: 'container',
                                items: [
                                    {
                                        itemId: 'todosGrid',

                                        xtype: 'grid',
                                        plugins: [
                                            'gridflex',
                                            'gridheight'
                                        ],
                                        titleBar: false,
                                        emptyText: 'There are no To Dos for this apply project',
                                        deferEmptyText: false,

                                        store: {
                                            fields: [
                                                'todo',
                                                {
                                                    name: 'date_due',
                                                    type: 'date',
                                                    allowNull: true
                                                },
                                                {
                                                    name: 'completed',
                                                    type: 'boolean',
                                                    defaultValue: false
                                                }
                                            ]
                                        },

                                        columns: [
                                            {
                                                xtype: 'spark-completed-column',
                                                text: null,
                                                width: 45
                                            },
                                            {
                                                xtype: 'column',
                                                flex: 1,
                                                text: 'To Dos',
                                                dataIndex: 'todo',
                                                cell: {
                                                    encodeHtml: false
                                                },
                                                renderer: function(v) {
                                                    var fm = Ext.util.Format;
                                                    return fm.nl2br(fm.htmlEncode(v));
                                                }
                                            },
                                            {
                                                xtype: 'datecolumn',
                                                text: 'Due Date',
                                                dataIndex: 'date_due',
                                                width: 150,
                                                format: 'l, n/j'
                                            }
                                        ],
                                    },
                                    {
                                        xtype: 'fieldset',
                                        cls: 'content-card',
                                        title: 'Reflection',
                                        items: [
                                            {
                                                xtype: 'textareafield',
                                                label: 'Write a paragraph about what you’ve learned with this standard.'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                cls: 'sidebar-col',
                                items: [
                                    {
                                        xtype: 'spark-panel',
                                        title: 'Related Docs',
                                        items: [
                                            {
                                                itemId: 'linksCmp',

                                                xtype: 'component',
                                                tpl: [
                                                    '<ul class="link-list">',
                                                        '<tpl for=".">',
                                                            '<li class="link-list-item"><a href="{url:htmlEncode}" target=_blank>{title:htmlEncode}</a></li>',
                                                        '</tpl>',
                                                    '</ul>'
                                                ]
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'action',
                                                iconCls: 'fa fa-paperclip',
                                                text: 'Attach File or Link'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'spark-panel',
                                        title: 'Submitted Docs',
                                        items: [
                                            {
                                                xtype: 'dataview',
                                                cls: 'link-list has-checkboxes',
                                                itemCls: 'link-list-item',
                                                allowDeselect: true,
                                                store: {
                                                    fields: [ 'title', 'url' ],
                                                    data: [
                                                        {
                                                            'title': 'essay_final_aw.doc',
                                                            'url': 'http://example.com/essay_final_aw.doc'
                                                        }
                                                    ]
                                                },
                                                itemTpl: '<a href="{url:htmlEncode}" target=_blank>{title:htmlEncode}</a>'
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'action',
                                                iconCls: 'fa fa-paperclip',
                                                text: 'Attach File or Link'
                                            },
                                            {
                                                xtype: 'component',
                                                margin: '16 0 0',
                                                html: '<p class="hint">Checked documents will be added to your portfolio.</p>'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'button',
                                        ui: 'action',
                                        margin: '0 34 24',
                                        text: 'Submit to Teacher'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'spark-panel',
                        title: 'Feedback from Teacher',
                        data: {
                            feedbackNotes: [
                                {
                                    date: '2015-04-10',
                                    text: 'Any information a teacher wants to leave for astudent, comments to share, and other feedback they want to offer. This could be related to any one of the fields and information on this page.'
                                },
                                {
                                    date: '2015-04-07',
                                    text: 'Any information a teacher wants to leave for astudent, comments to share, and other feedback they want to offer. This could be related to any one of the fields and information on this page.'
                                }
                            ]
                        },
                        tpl: [
                            '<ol class="dated-list">',
                                '<tpl for="feedbackNotes">',
                                    '<li class="dated-list-item">',
                                        '<h3 class="dated-list-date">{date:date}</h3>',
                                        '<div class="dated-list-content">{text}</div>',
                                    '</li>',
                                '</tpl>',
                            '</ol>'
                        ]
                    }
                ]
            }
        ]
    }
});
