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
            itemId: 'url',
            margin: '2px 8px',
            emptyText: 'Enter your link URL here. Press tab to enter another.',
            listeners: {
                blur: function(field) {
                    field.up('srm-field-applylinks').onLinkBlur(field);
                }
            }
        },{
            xtype: 'textfield',
            itemId: 'title',
            margin: '0 8px',
            emptyText: 'Enter the title of the link here. Press tab to enter another.',
            listeners: {
                blur: function(field) {
                    field.up('srm-field-applylinks').onLinkBlur(field);
                }
            }
        }]
    }],

    onLinkBlur: function(field) {
        var ct = field.up('fieldcontainer'),
            ctOwner = ct.up('fieldset'),
            link = {},
            clone;

        // get link from this field container
        ct.items.each(function(field) {
            link[field.getItemId()] = field.getValue();
        });

        // create new link fieldcontainer if this container is last and has a valid link
        if (ct.lastInGroup && link.url) {
            ct.lastInGroup = false;
            clone = ctOwner.add(ct.cloneConfig({isClone: true}));
        }
    },

    getValues: function() {
        var me = this,
            values = [],
            link;

        me.items.each(function(ct) {
            link = {};
            ct.items.each(function(field) {
                link[field.getItemId()] = field.getValue();
            });
            if (link.url) {
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
                linkCt.down('field[itemId="url"]').setRawValue(link.url);
                linkCt.down('field[itemId="title"]').setRawValue(link.title);
            }
            me.add(firstCt.cloneConfig({isClone: true}));
        } else {
            firstCt.lastInGroup = true;
        }
    }

 });
