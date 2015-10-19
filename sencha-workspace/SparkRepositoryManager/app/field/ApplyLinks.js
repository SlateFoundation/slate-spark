 Ext.define('SparkRepositoryManager.field.ApplyLinks', {
    extend: 'Ext.form.FieldSet',
    xtype: 'srm-field-applylinks',
    requires: [
        'Ext.form.field.Text',
        'Ext.layout.container.VBox'
    ],

    title:       'Links',

    config: {
        originalValues: []
    },

    flex:        1,
    scrollable:  true,


    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'fieldcontainer',
        // TODO: replace style with style class? Also see margin configs in child fields
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
            emptyText: 'Enter your link URL here. Press tab to enter another.'
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
            url = ct.down('textfield[itemId="url"]').getValue();

        // create new link fieldcontainer if this container is last and has a valid link
        if (ct.lastInGroup && url) {
            ct.lastInGroup = false;
            ctOwner.add(ct.cloneConfig({isClone: true}));
        }
    },

    getValues: function() {
        var me = this,
            items = me.items.items,
            itemCount = items.length,
            i = 0,
            values = [],
            ct,
            link,
            titleVal;

        for (; i<itemCount; i++) {
            ct = items[i];
            titleVal = ct.down('textfield[itemId="title"]').getValue();
            link = {
                title: titleVal === '' ? null : titleVal,
                url: ct.down('textfield[itemId="url"]').getValue()
            };
            if (link.url) {
                values.push(link);
            }
        }

        return values;
    },

    setValues: function(links) {
        var me = this,
            firstCt = me.down('fieldcontainer'),
            linkCount = links.length,
            i = 0,
            link, linkCt;

        me.setOriginalValues(links);

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
                linkCt.down('field[itemId="url"]').setValue(link.url);
                linkCt.down('field[itemId="title"]').setValue(link.title);
            }
            me.add(firstCt.cloneConfig({isClone: true}));
        } else {
            firstCt.lastInGroup = true;
        }
    },

    isDirty: function() {
        var currentVals = this.getValues(),
            originalVals = this.getOriginalValues(),
            currentLength = currentVals.length,
            originalLength = originalVals.length,
            dirty = false,
            i = 0;

        if (currentLength === originalLength) {
            // If length is zero dirty remains false
            if (currentLength !== 0) {
                for (; i<originalLength; i++) {
                    // loop through the array and compare each object value
                    if (!Ext.Object.equals(currentVals[i],originalVals[i])) {
                        dirty = true;
                    }
                }
            }
        } else {
            // if array lengths do not match dirty is true
            dirty = true;
        }
        return dirty;
    }

 });
