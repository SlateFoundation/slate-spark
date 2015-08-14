
Ext.define('SparkClassroom.work.conference.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-conference',
    requires: [
        'SparkClassroom.widget.SimpleHeading',
        'Jarvus.layout.Accordion'
    ],

    config: {
        items: [
            {
                xtype: 'container',
                itemId: 'standardContainer',
                items: [
                    {
                        xtype: 'container',
                        layout: 'accordion',
                        items: [
                            {
                                xtype: 'container',
                                cls: 'content-card',
                                title: 'Standard 1 - CCSS.ELA.3.CC.4.A',
                                items: [
                                    {
                                        xtype: 'spark-simpleheading',
                                        level: 2,
                                        html: 'Guiding Questions'
                                    },
                                    {
                                        // TODO would be more accessible and standards-friendly to use <ol> for the dataview and <li> for the item tags
                                        xtype: 'dataview',
                                        cls: 'spark-work-list',
                                        store: {
                                            fields: [
                                                'index',
                                                'text',
                                                'type'
                                            ],
                                            data: [
                                                { index: 1, text: 'Example of a first guiding question.' },
                                                { index: 2, text: 'Example of a second guiding question that a student should be prepared to respond to.' },
                                                { index: 3, text: 'Example of a third guiding question that a student should be prepared to respond to.', type: 'grad' },
                                                // TODO text field and button
                                                { index: 4, text: '[Add a guiding question you want to discuss with the teacher (optional)] [Add]'}
                                            ]
                                        },
                                        itemCls: 'spark-work-list-item',
                                        itemTpl: '<span class="item-index">{index}</span> <span class="item-text">{text}</span>'
                                    },
                                    {
                                        xtype: 'spark-simpleheading',
                                        level: 2,
                                        html: 'Resources'
                                    },
                                    {
                                        xtype: 'dataview',
                                        cls: 'spark-work-list',
                                        store: {
                                            fields: [
                                                'index',
                                                'text',
                                                'linkTitle',
                                                'linkUrl'
                                            ],
                                            data: [
                                                { index: 1, text: 'Title of resource', linkTitle: 'documenttoshare.pdf', linkUrl: '#' },
                                                { index: 2, text: 'Title of resource', linkTitle: 'http://example.com', linkUrl: 'http://example.com' }
                                            ]
                                        },
                                        itemCls: 'spark-work-list-item',
                                        itemTpl: '<span class="item-index">{index}</span> <span class="item-text">{text}</span> &mdash; <a href="{linkUrl}">{linkTitle}</a>'
                                    }
                                ],
/*
                                html: [
                                    '<h5>Guiding Questions</h5>',
                                    '<ol>',
                                        '<li>Example of a first guiding question that a student should me prepared to respond to.</li>',
                                        '<li>Example of a second guiding question that a student should me prepared to respond to.</li>',
                                        '<li>Example of a third guiding question that a student should me prepared to respond to.</li>',
                                        //FIXME: Replace with custod add with textfield
                                        '<li><input type="text"><span class="button">Add</span></li>',
                                    '</ol>',
                                    '<hr>',
                                    '<h5>Resources</h5>',
                                    '<ol>',
                                        '<li>Title of Resource - <a href="#">documenttoshare.pdf</a></li>',
                                        '<li>Title of Resource - <a href="#">http://webpage.com</a></li>',
                                    '</ol>'
                                ].join('')
*/
                            },
                            {
                                xtype: 'component',
                                html: 'stuff',
                                title: 'Standard 2 - CCSS.ELA.3.CC.4.A'
                            },
                            {
                                xtype: 'component',
                                html: 'stuff',
                                title: 'Standard 3 - CCSS.ELA.3.CC.4.A'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});