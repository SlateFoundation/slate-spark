Ext.define('SparkRepositoryManager.view.lessons.editor.Assess', {
    extend: 'Ext.Panel',
    xtype: 's2m-lessons-editor-assess',
    requires: [
        'SparkRepositoryManager.view.lessons.editor.Multiselector'
    ],


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
