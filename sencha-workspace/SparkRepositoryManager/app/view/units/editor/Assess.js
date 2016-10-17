Ext.define('SparkRepositoryManager.view.units.editor.Assess', {
    extend: 'Ext.Panel',
    requires: [
        'SparkRepositoryManager.view.units.editor.Multiselector'
    ],
    xtype: 's2m-units-editor-assess',

    title: 'Assess',
    componentCls: 's2m-units-editor-assess',

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