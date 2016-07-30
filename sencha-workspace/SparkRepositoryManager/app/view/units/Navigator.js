Ext.define('SparkRepositoryManager.view.units.Navigator', {
    extend: 'Ext.Container',
    xtype: 's2m-units-navigator',

    componentCls: 's2m-units-navigator',

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
                    cls: 's2m-units-navigator-addbtn',
                    text: 'Add New Unit',
                    action: 'add-new-unit',
                    scale: 'large'
                },
                {
                    xtype: 'textfield',
                    cls: 's2m-units-navigator-search',
                    margin: '10 0 0',
                    emptyText: 'Search Units',
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
                    store: {
                        root: {
                            expanded: true,
                            children: [
                                {
                                    text: 'Global Units',
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
                                    text: 'Your Units',
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
                }
            ]
        }
    ]
});