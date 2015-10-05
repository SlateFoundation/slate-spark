/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.apply.Container', {
    extend: 'Ext.Container',
    xtype: 'spark-work-apply',
    requires: [
        'Jarvus.plugin.GridFlex',
        'Jarvus.plugin.GridHeight',
        'SparkClassroom.widget.Panel',
        'SparkClassroom.widget.SimpleHeading'
    ],

    config: {
        itemId: 'apply',

        items: [
            {
                xtype: 'spark-simpleheading',
                level: 1,
                cls: 'spark-view-headline',
                html: 'Time to Apply your knowledge!'
            },
            {
                xtype: 'grid',
                plugins: [
                    'gridflex',
                    'gridheight'
                ],
                titleBar: false,
/*
                store: {
                    fields: [ 'title', 'description', 'standards', 'checked' ],
                    data: [
                        {
                            title: 'Write It',
                            description: 'Write a paragraph that has both active and passive voice sentences. Be sure to underline your sentences that display the learning target.',
                            standards: [ '8.L.01b', '8.L.7', '8.L.5' ]
                        },
                        {
                            title: 'Create It',
                            description: 'Create a Powerpoint or Prezi to teach this learning target to your peers. Don’t limit yourself. Be creative and be sure to include practice activities. You may even decide to use Storybird or Storyboard.',
                            standards: [ '8.L.7', '8.L.3' ],
                            checked: true
                        },
                        {
                            title: 'Wild Card',
                            description: 'Record a video teaching students how to use active and passive voice. In your video, be sure to identify what is active and passive voice.'
                        }
                    ]
                },
*/
                columns: [
                    {
                        xtype: 'booleancolumn',
                        dataIndex: 'checked',
                        width: 120
                    },
                    {
                        xtype: 'templatecolumn',
                        flex: 1,
                        cell: { encodeHtml: false },
                        tpl: [
                            '<div class="spark-grid-row-title">{title}</div>',
                            '<tpl if="description"><div class="spark-grid-row-detail">{description}</div></tpl>'
                        ]
                    },
                    {
                        xtype: 'templatecolumn',
                        text: 'Standards Incorporated',
                        dataIndex: 'standards',
                        cell: { encodeHtml: false },
                        tpl: '<tpl if="standards"><ul class="spark-grid-token-list"><tpl for="standards"><li class="spark-grid-token-item">{.}</li></tpl></ul></tpl>',
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
                        xtype: 'button',
                        ui: 'action',
                        text: 'Choose Selected Apply' // TODO polish this copy? include apply name?
                    }
                ]
            },
            {
                xtype: 'component',
                style: {
                    background: '#666',
                    color: '#ccc',
                    fontSize: 'small',
                    lineHeight: 2,
                    margin: '3em 0',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                },
                html: '[This will be two different sections]'
            },
            {
                layout: 'hbox',
                items: [
                    {
                        xtype: 'component',
                        flex: 1,
                        html: [
                            '<h1 class="spark-view-headline">Write It</h1>',
                            '<div class="spark-view-prompt"><p>Write a paragraph that has both active and passive voice sentences.  Be sure to underline your sentences that display the learning target.</p></div>'
                        ].join('')
                    },
                    {
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
                layout: 'hbox',
                items: [
                    {
                        flex: 1,
                        items: [
                            {
                                xtype: 'spark-panel',
                                cls: 'content-card',
                                title: 'To Do',
                                html: '[grid]',
                                height: 400 // temp
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
                        cls: 'sidebar-col',
                        items: [
                            {
                                xtype: 'spark-panel',
                                title: 'Related Docs',
                                items: [
                                    {
                                        xtype: 'component',
                                        data: {
                                            docs: [
                                                {
                                                    title: 'Some doc on Google <test></test>',
                                                    url: 'https://docs.google.com/document/d/1OFiXSz5nSEMxKutQYzHDdVxfIfNJTsyM-YJlEMiVRfQ/'
                                                },
                                                {
                                                    title: 'A Dropbox file maybe, with a longer title than usual',
                                                    url: 'https://www.dropbox.com/s/bdp8dwgssrhr6e4/Jarvus-Deliveries-B.pdf'
                                                },
                                                {
                                                    title: 'paperinpdfform.pdf',
                                                    url: 'http://example.com/paperinpdfform.pdf'
                                                }
                                            ]
                                        },
                                        tpl: [
                                            '<ul class="link-list">',
                                                '<tpl for="docs">',
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
});
