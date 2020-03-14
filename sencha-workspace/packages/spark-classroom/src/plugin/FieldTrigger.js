Ext.define('SparkClassroom.plugin.FieldTrigger', {
    extend: 'Ext.Widget',
    alias: 'plugin.fieldtrigger',


    config: {
        field: null,
        icon: 'angle-down',
        iconSize: 'lg'
    },

    triggerableCls: Ext.baseCSSPrefix + 'field-triggerable',

    element: {
        reference: 'element',
        cls: 'menu-trigger',
        children: [{
            reference: 'iconElement',
            tag: 'i',
            cls: 'fa'
        }]
    },

    initElement: function() {
        var me = this;

        me.callParent();

        me.iconElement.on('tap', 'onTriggerTap', me);
    },

    init: function(field) {
        this.setField(field);
    },

    updateField: function(field) {
        field.innerElement.appendChild(this.renderElement);
        field.addCls(this.triggerableCls);
    },

    updateIcon: function(icon, oldIcon) {
        var iconElement = this.iconElement;

        if (oldIcon) {
            iconElement.removeCls('fa-'+oldIcon);
        }

        if (icon) {
            iconElement.addCls('fa-'+icon);
        }
    },

    updateIconSize: function(iconSize, oldIconSize) {
        var iconElement = this.iconElement;

        if (oldIconSize) {
            iconElement.removeCls('fa-'+oldIconSize);
        }

        if (iconSize) {
            iconElement.addCls('fa-'+iconSize);
        }
    },

    onTriggerTap: function(ev) {
        var field = this.getField();
        field.fireEvent('triggertap', field, this, ev);
    }
});