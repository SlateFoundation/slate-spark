Ext.define('SparkClassroomTeacher.view.work.apply.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-apply-main',
    requires: [
        'SparkClassroomTeacher.view.work.apply.TasksGrid'
    ],

    config: {
        items: [
            {
                layout: 'hbox',
                items: [
                    {
                        itemId: 'headerCmp',

                        xtype: 'component',
                        flex: 1,
                        tpl: [
                            '<h1 class="spark-view-headline">{title:htmlEncode}</h1>',
                            '<div class="spark-view-prompt reading-width"><p class="lead">{instructions:htmlEncode}</p></div>' // TODO: support markdown
                        ]
                    },
                    {
                        itemId: 'timelineCmp',

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
            },
            {
                layout: {
                    type: 'hbox',
                    align: 'start'
                },
                margin: '0 -12',
                defaults: {
                    flex: 1,
                    padding: 12,
                    defaults: {
                        xtype: 'spark-panel'
                    }
                },
                items: [
                    // {
                    //     items: [
                    //         {
                    //             title: 'Applied Standards',
                    //             defaults: {
                    //                 xtype: 'component',
                    //                 cls: 'spark-token-item'
                    //             },
                    //             items: [
                    //                 {
                    //                     html: 'CCSS.ELA.4.CC.4.A'
                    //                 },
                    //                 {
                    //                     html: 'CCSS.ELA.4.CC.4.A'
                    //                 },
                    //                 {
                    //                     html: 'CCSS.ELA.4.CC.4.A'
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // },
                    {
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
                                                    '<li class="link-list-item"><a href="{url:htmlEncode}" title="{title:htmlEncode}" target=_blank>{title:htmlEncode}</a></li>',
                                                '</tpl>',
                                            '</ul>'
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                // spacer
                                style: { visibility: 'hidden' }
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'spark-teacher-work-apply-tasksgrid'
            },
            {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 -12',
                defaults: {
                    padding: 12,
                    defaults: {
                        xtype: 'spark-panel'
                    }
                },
                items: [
                    {
                        flex: 2,
                        items: [
                            {
                                itemId: 'reflectionCmp',

                                title: 'Reflection',
                                tpl: '{[fm.nl2br(fm.htmlEncode(values.reflection))]}'
                            }
                        ]
                    },
                    {
                        flex: 1,
                        items: [
                            {
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
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
});