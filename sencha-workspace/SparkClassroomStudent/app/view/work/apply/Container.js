/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomStudent.view.work.apply.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-student-work-apply',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'Jarvus.form.GooglePicker',
        'SparkClassroom.work.apply.TasksGrid',
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
                        xtype: 'container',
                        margin: '0 0 32',
                        layout: {
                            type: 'hbox',
                            pack: 'start'
                        },
                        items: [
                            {
                                itemId: 'chooseAgainBtn',

                                xtype: 'button',
                                ui: 'action',
                                text: '&larr; Choose a Different Apply'
                            }
                        ]
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
                                    // TODO: restore once rubric content is available
                                    // {
                                    //     xtype: 'button',
                                    //     ui: 'action',
                                    //     text: 'Grading Rubric'
                                    // },
                                    {
                                        itemId: 'timelineCmp',

                                        cls: 'text-right',
                                        tpl: [
                                            '<dl class="kv-list align-right">',
                                                '<tpl if="start">',
                                                    '<div class="kv-pair">',
                                                        '<dt class="kv-key">Start Date</dt>',
                                                        '<dd class="kv-value">{start:date("n/j/y")}</dd>',
                                                    '</div>',
                                                '</tpl>',
                                                '<tpl if="finish">',
                                                    '<div class="kv-pair">',
                                                        '<dt class="kv-key">Finish Date</dt>',
                                                        '<dd class="kv-value">{finish:date("n/j/y")}</dd>',
                                                    '</div>',
                                                '<tpl elseif="estimate">',
                                                    '<div class="kv-pair">',
                                                        '<dt class="kv-key">Expected End Date</dt>',
                                                        '<dd class="kv-value">{estimate:date("n/j/y")}</dd>',
                                                    '</div>',
                                                '</tpl>',
                                            '</dl>'
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
                                        xtype: 'spark-work-apply-tasksgrid',
                                        allowToggleComplete: true
                                    },
                                    {
                                        xtype: 'fieldset',
                                        cls: 'content-card',
                                        title: 'Reflection',
                                        items: [
                                            {
                                                itemId: 'reflectionField',

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
                                                styleHtmlContent: true,
                                                tpl: [
                                                    '<ol class="link-list">',
                                                        '<tpl for=".">',
                                                            '<li class="link-list-item"><a href="{url:htmlEncode}" title="{title:htmlEncode}" target=_blank>{title:htmlEncode}</a></li>',
                                                        '</tpl>',
                                                    '</ol>'
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'spark-panel',
                                        title: 'Submitted Docs',
                                        items: [
                                            {
                                                itemId: 'submissionsView',

                                                xtype: 'dataview',
                                                cls: 'link-list', // has-checkboxes // TODO: move back into classes
                                                itemCls: 'link-list-item',
                                                emptyText: 'None attached yet',
                                                deferEmptyText: false,
                                                allowDeselect: true,
                                                store: {
                                                    // TODO: move to model
                                                    idProperty: 'url',
                                                    fields: [
                                                        {
                                                            name: 'id',
                                                            mapping: 'url',
                                                        },
                                                        {
                                                            name: 'url'
                                                        },
                                                        {
                                                            name: 'title',
                                                            depends: ['url'],
                                                            convert: function(v, r) {
                                                                return v || r.get('url').replace(/^https?:\/\//, '');
                                                            }
                                                        },
                                                    ]
                                                },
                                                itemTpl: '<a href="{url:htmlEncode}" title="{title:htmlEncode}" target=_blank>{title:htmlEncode}</a>'
                                            },
                                            {
                                                itemId: 'attachFileBtn',

                                                xtype: 'button',
                                                ui: 'action',
                                                iconCls: 'fa fa-paperclip',
                                                text: 'Attach File'
                                            },
                                            {
                                                itemId: 'attachLinkBtn',

                                                xtype: 'button',
                                                margin: '16 0 0',
                                                ui: 'action',
                                                iconCls: 'fa fa-link',
                                                text: 'Attach Link'
                                            }
                                            // TODO: implement portfolio flag
                                            // {
                                            //     xtype: 'component',
                                            //     margin: '16 0 0',
                                            //     html: '<p class="hint">Checked documents will be added to your portfolio.</p>'
                                            // }
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
                    }
                    // {
                    //     xtype: 'spark-panel',
                    //     title: 'Feedback from Teacher',
                    //     data: {
                    //         feedbackNotes: [
                    //             {
                    //                 date: '2015-04-10',
                    //                 text: 'Any information a teacher wants to leave for astudent, comments to share, and other feedback they want to offer. This could be related to any one of the fields and information on this page.'
                    //             },
                    //             {
                    //                 date: '2015-04-07',
                    //                 text: 'Any information a teacher wants to leave for astudent, comments to share, and other feedback they want to offer. This could be related to any one of the fields and information on this page.'
                    //             }
                    //         ]
                    //     },
                    //     tpl: [
                    //         '<ol class="dated-list">',
                    //             '<tpl for="feedbackNotes">',
                    //                 '<li class="dated-list-item">',
                    //                     '<h3 class="dated-list-date">{date:date}</h3>',
                    //                     '<div class="dated-list-content">{text}</div>',
                    //                 '</li>',
                    //             '</tpl>',
                    //         '</ol>'
                    //     ]
                    // }
                ]
            }
        ]
    }
});
