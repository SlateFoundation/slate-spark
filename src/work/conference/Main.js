
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

                                listeners: {
                                    tap: {
                                        element: 'element',
                                        delegate: 'button[type=submit]',
                                        fn: function() {
                                            this.fireEvent('submit', this);
                                        }
                                    },
                                    keypress: {
                                        element: 'element',
                                        delegate: 'input',
                                        fn: function(ev, t) {
                                            if (ev.getKey() == ev.ENTER) {
                                                this.fireEvent('submit', this);
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                itemId: 'resources',

                                xtype: 'spark-worklist',
                                data: {
                                    title: 'Resources',
                                    items: [
                                        // { text: 'Title of resource', linkTitle: 'documenttoshare.pdf', linkUrl: '#' },
                                        // { text: 'Title of resource', linkUrl: 'http://example.com' }
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