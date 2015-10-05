
Ext.define('SparkClassroom.work.conference.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-conference',
    requires: [
        'SparkClassroom.work.conference.WorkList',
        'SparkClassroom.widget.SimpleHeading',
        'Jarvus.layout.Accordion'
    ],

    config: {
        items: [
            {
                layout: 'accordion',
                items: [
                    {
                        expanded: true,
                        itemId: 'sparkpointCt',

                        xtype: 'container',
                        cls: 'content-card',
                        title: '[Select a Sparkpoint]',
                        items: [
                            {
                                itemId: 'questions',

                                xtype: 'spark-worklist',
                                data: {
                                    title: 'Guiding Questions',
                                    items: [
                                        { text: 'Example <foo> of a first guiding question.' },
                                        { text: 'Example of a second guiding question that a student should be prepared to respond to.' },
                                        { text: 'Example of a third guiding question that a student should be prepared to respond to.', studentSubmitted: true },
                                        { text: '<div class="inline-flex-fullwidth-ct"><input placeholder="Add a guiding question you want to discuss with the teacher (optional)" class="flex-1"> <button type="submit">Add</button></div>', skipHtmlEncode: true }
                                    ]
                                }
                            },
                            {
                                itemId: 'resources',

                                xtype: 'spark-worklist',
                                data: {
                                    title: 'Resources',
                                    items: [
                                        { text: 'Title of resource', linkTitle: 'documenttoshare.pdf', linkUrl: '#' },
                                        { text: 'Title of resource', linkUrl: 'http://example.com' }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
});