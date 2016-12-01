Ext.define('SparkRepositoryManager.view.lessons.editor.Assess', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.lessons.editor.Multiselector'
    ],
    xtype: 's2m-lessons-editor-assess',

    title: 'Assess',
    componentCls: 's2m-lessons-editor-assess',

    layout: {
        type: 'hbox',
        pack: 'center'
    },
    items: [
        {
            xtype: 'button',
            scale: 'large',
            text: 'Go to Illuminate to Create Assessment',
            href: 'https://www.illuminateed.com/'
        }
    ]
});
