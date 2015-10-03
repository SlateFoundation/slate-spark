
Ext.define('SparkClassroom.work.conference.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-conference',
    requires: [
        'SparkClassroom.work.conference.WorkList',
        'SparkClassroom.widget.SimpleHeading',
        'Jarvus.layout.Accordion'
    ],

    config: {
        itemId: 'conference',

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
                                        xtype: 'spark-worklist',
                                        itemId: 'questions',
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
                                        xtype: 'spark-worklist',
                                        itemId: 'resources',
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
        ]
    }
});
