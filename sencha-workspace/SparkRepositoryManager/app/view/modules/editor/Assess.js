Ext.define('SparkRepositoryManager.view.modules.editor.Assess', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.modules.editor.Multiselector'
    ],
    xtype: 's2m-modules-editor-assess',

    title: 'Assess',
    componentCls: 's2m-modules-editor-assess',

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
