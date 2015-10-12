 Ext.define('SparkRepositoryManager.field.ApplyLinks', {
    extend: 'Ext.form.FieldSet',
    xtype: 'srm-field-applylinks',
    requires: [
        'Ext.form.field.Text',
        'Ext.layout.container.VBox'
    ],

    title:       'Links',
    defaultType: 'textfield',
    flex:        1,
    scrollable:  true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'fieldcontainer',
        // TODO: replace style with style class?
        style: {
            border: '1px',
            borderStyle: 'solid',
            borderColor: '#ccc'
        },
        lastInGroup: true,
        isClone: false,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'textfield',
            name: 'url',
            margin: '2px 8px',
            emptyText: 'Enter your link URL here. Press tab to enter another.'
        },{
            xtype: 'textfield',
            name: 'title',
            margin: '0 8px',
            emptyText: 'Enter the title of the link here. Press tab to enter another.'
        }]
    }],

    getValues: function() {
        var me = this,
            values = [],
            link;

        me.items.each(function(ct) {
            link = {};
            ct.items.each(function(field) {
                link[field.getName()] = field.getValue();
            });
            if (link.url && link.title) {
                values.push(link);
            }
        });
        return values;
    },

    setValues: function(links) {
        var me = this,
            firstCt = me.down('fieldcontainer'),
            linkCount = links.length,
            i = 0,
            link, linkCt;

        me.items.each(function(ct) {
            if (ct.isClone) {
                me.remove(ct, true);
            }
        });

        if (linkCount > 0) {
            for (; i < linkCount; i++) {
                link = links[i];
                if (i === 0) {
                    linkCt = firstCt;
                } else {
                    linkCt = me.add(firstCt.cloneConfig({
                        isClone: true,
                        lastInGroup: false
                    }));
                }
                linkCt.down('field[name="url"]').setRawValue(link.url);
                linkCt.down('field[name="title"]').setRawValue(link.title);
            }
            me.add(firstCt.cloneConfig({isClone: true}));
        } else {
            firstCt.lastInGroup = true;
        }
    }

 });
