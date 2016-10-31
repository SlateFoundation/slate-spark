Ext.define('SparkRepositoryManager.view.modules.Navigator', {
    extend: 'Ext.Container',
    xtype: 's2m-modules-navigator',

    componentCls: 's2m-modules-navigator',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            padding: 10,
            defaults: {
                width: '100%'
            },
            items: [
                {
                    xtype: 'button',
                    cls: 's2m-modules-navigator-addbtn',
                    text: 'Add New Module',
                    action: 'add-new-module',
                    scale: 'large'
                },
                {
                    xtype: 'textfield',
                    cls: 's2m-modules-navigator-search',
                    margin: '10 0 0',
                    emptyText: 'Search Modules',
                    triggers: {
                        search: {
                            cls: 'x-form-search-trigger'
                        }
                    }
                }
            ]
        },
        {
            flex: 1,
            xtype: 'panel',
            title: 'Content Areas',
            layout: 'fit',
            items: [
                {
                    xtype: 'treepanel',
                    rootVisible: false,
                    displayField: 'code',
                    store: 'Modules'

/*
                    store: {
                        root: {
                            expanded: true,
                            children: [
                                {
                                    text: 'Global Modules',
                                    cls: 's2m-treepanel-heading',
                                    expanded: true,
                                    children: [
                                        { text: 'Math' },
                                        { text: 'ELA' },
                                        { text: 'Science' },
                                        { text: 'Social Studies' },
                                        { text: 'Health' },
                                        {
                                            text: 'Technology',
                                            expanded: true,
                                            children: [
                                                { text: 'G6.U.3.4.A', leaf: true },
                                                { text: 'G7.U.5.3.B', leaf: true },
                                                { text: 'G8.U.3.4.C', leaf: true }
                                            ]
                                        },
                                        { text: 'The Arts' }
                                    ]
                                },
                                {
                                    text: 'Your Modules',
                                    cls: 's2m-treepanel-heading',
                                    expanded: true,
                                    children: [
                                        { text: 'Math' },
                                        { text: 'ELA' },
                                        { text: 'Science' },
                                        { text: 'Social Studies' },
                                        { text: 'Health' },
                                        {
                                            text: 'Technology',
                                            expanded: true,
                                            children: [
                                                { text: 'G6.U.3.4.A', leaf: true },
                                                { text: 'G7.U.5.3.B', leaf: true },
                                                { text: 'G8.U.3.4.C', leaf: true }
                                            ]
                                        },
                                        { text: 'The Arts' }
                                    ]
                                }
                            ]
                        }
                    }
*/
                }
            ]
        }
    ]
});
