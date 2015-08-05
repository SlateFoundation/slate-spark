Ext.define('SparkRepositoryManager.column.StatementTree', {
    extend: 'Ext.tree.Column',
    xtype: 'srm-statementtreecolumn',


    flex: 1,

    text: 'Statement',
    dataIndex: 'title',
    cellWrap: true,
    innerCls: 'statementtree-inner-treecolumn',
    // renderer: function(value, metaData, record) {
    //     metaData.tdAttr += Ext.util.Format.attributes({
    //         'data-qtitle': value,
    //         'data-qtip': Ext.XTemplate.getTpl(record, 'tooltipTpl').apply(record.getData())
    //     });

    //     return value;
    // }
    cellTpl: [
        '<tpl for="lines">',
            '<span class="{parent.childCls} {parent.elbowCls} ', // changed img to span
            '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"></span>',
        '</tpl>',
        '<span class="{childCls} {elbowCls} {elbowCls}', // changed img to span
            '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation"></span>',
        // '<tpl if="checked !== null">',
        //     '<input type="button" {ariaCellCheckboxAttr}',
        //         ' class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
        // '</tpl>',
        '<span role="presentation" class="{childCls} {baseIconCls} ', // changed to span
            '{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
            '<tpl if="icon">style="background-image:url({icon})"</tpl>></span>',
        '<tpl if="href">',
            '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
        '<tpl else>',
            '<span class="{textCls} {childCls}">{value}</span>',
        '</tpl>'
    ]
});