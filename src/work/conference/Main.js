
Ext.define('SparkClassroom.work.conference.Main', {
    extend: 'Ext.Container',
    xtype: 'spark-work-conference',
    requires: [
        'Jarvus.touch.layout.Accordion'
    ],

    config: {
        layout: 'hbox',
        items: [
            {
                xtype: 'container',
                flex: 1,
                itemId: 'standardContainer',
                items: [
                    {
                        xtype: 'container',
                        layout: 'accordion',
                        items: [
                            {
                                xtype: 'component',
                                title: 'Standard 2 - CCSS.ELA.3.CC.4.A',
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