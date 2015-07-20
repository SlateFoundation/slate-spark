/**
 * <p>A plugin for Field Components which creates clones of the Field for as
 * long as the user keeps filling them. Leaving the final one blank ends the repeating series.</p>
 * <p>Usage:</p>
 * <pre><code>
 {
     xtype: 'combo',
     plugins: [ Ext.ux.FieldReplicator ],
     triggerAction: 'all',
     fieldLabel: 'Select recipient',
     store: recipientStore
 }
 * </code></pre>
 */
Ext.define('SparkRepositoryManager.plugin.FieldReplicator', {
    requires: [
        'Ext.plugin.Abstract',
        'Ext.Function'
    ],

    xtype: 's2m-fieldreplicator',

    extend: 'Ext.plugin.Abstract',

    alias: 'plugin.fieldreplicator',

    init: function(field) {
        var me = this;

        // Assign the field an id grouping it with fields cloned from it. If it already
        // has an id that means it is itself a clone.
        if (!field.replicatorId) {
            field.replicatorId = Ext.id();
        }

        if (!me.cloneField) {
            me.cloneField = field;
        }

        field.on('blur', me.onBlur, this);
    },

    cloneField: null,

    replicate: function (field) {
        var ownerCt = field.ownerCt,
            replicatorId = field.replicatorId,
            clone = field.cloneConfig({replicatorId: replicatorId}),
            idx = ownerCt.items.indexOf(field);

        ownerCt.add(idx + 1, clone);

        if (field.onReplicate) {
            field.onReplicate(clone, field, this.cloneField);
        }

        return clone;
    },

    onBlur: function(field) {
        var ownerCt = field.ownerCt,
            replicatorId = field.replicatorId,
            isEmpty = Ext.isEmpty(field.getRawValue()),
            siblings = ownerCt.query('[replicatorId=' + replicatorId + ']'),
            isLastInGroup = siblings[siblings.length - 1] === field;

        // If a field before the final one was blanked out, remove it
        if (isEmpty && !isLastInGroup) {
            Ext.Function.defer(field.destroy, 10, field); //delay to allow tab key to move focus first
        }
        // If the field is the last in the list and has a value, add a cloned field after it
        else if(!isEmpty && isLastInGroup) {
            this.replicate(field);
        }
    },

    getValues: function() {
        var me = this,
            ownerCt = me.cloneField.ownerCt,
            values = [];

        ownerCt.items.each(function(field) {
            var val = field.getValue();

            if (field.replicatorId && val) {
                values.push(val);
            }
        });

        me.hasChanged = false;

        return values;
    },

    setValues: function(vals) {
        var me = this,
            ownerCt = me.cloneField.ownerCt;

        me.removeClones();

        vals.forEach(function(val) {
            var clone = me.replicate(me.cloneField);
            clone.setValue(val);
        });

        ownerCt.add(me.cloneField);
    },

    removeClones: function() {
        var me = this,
            cloneField = me.cloneField,
            ownerCt;

        if (cloneField) {
            ownerCt = cloneField.ownerCt;

            ownerCt.items.each(function(field) {
                if (field.replicatorId && field != cloneField) {
                    ownerCt.remove(field);
                }
            });
        }
    }
});