Ext.define('SparkClassroomTeacher.view.work.apply.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-apply-main',
    requires: [
        'SparkClassroomTeacher.view.work.apply.TaskGrid'
    ],

    config: {
        items: [
            {
                layout: 'hbox',
                items: [
                    {
                        flex: 1,
                        html: '<h1 class="spark-view-headline">Write it<h1>'
                            + '<div class="spark-view-prompt reading-width"><p class="lead">Write a paragraph that has both active and passive voice sentences. Be sure to underline your sentences that display the learning target.</p></div>'
                    },
                    {
                        html: [
                            '<dl class="kv-list align-right">',
                                '<div class="kv-pair">',
                                    '<dt class="kv-key">Start Date</dt>',
                                    '<dd class="kv-value">3/2/15</dd>',
                                '</div>',
                                '<div class="kv-pair">',
                                    '<dt class="kv-key">Expected End Date</dt>',
                                    '<dd class="kv-value">3/6/15</dd>',
                                '</div>',
                            '</dl>'
                        ].join('')
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
                    {
                        items: [
                            {
                                title: 'Applied Standards',
                                defaults: {
                                    xtype: 'component',
                                    cls: 'spark-token-item'
                                },
                                items: [
                                    {
                                        html: 'CCSS.ELA.4.CC.4.A'
                                    },
                                    {
                                        html: 'CCSS.ELA.4.CC.4.A'
                                    },
                                    {
                                        html: 'CCSS.ELA.4.CC.4.A'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        items: [
                            {
                                title: 'Related Docs',
                                items: [
                                    {
                                        xtype: 'component',
                                        styleHtmlContent: true,
                                        html: [
                                            '<ol>',
                                                '<li><a href="#">Link to Google Doc</a></li>',
                                                '<li><a href="#">Link to Google Doc</a></li>',
                                                '<li><a href="#">Link to Google Doc</a></li>',
                                            '</ol>'
                                        ].join('')
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
                xtype: 'spark-teacher-work-apply-taskgrid'
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
                                title: 'Reflection',
                                html: 'This helps me start thinking of math as a language, not a pile of numbers. Just like any other language, math can help us communicate thoughts and ideas with each other, but we need to know the basics before they can really understand it.  At its simplest, an expression is a thought or idea communicated by language. In the same way, a mathematical expression can be considered a mathematical thought or idea communicated by the language of mathematics.  Mathematics is a language, just as English, French, German, and Pig Latin are languages. '
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
                                        xtype: 'dataview',
                                        cls: 'link-list',
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