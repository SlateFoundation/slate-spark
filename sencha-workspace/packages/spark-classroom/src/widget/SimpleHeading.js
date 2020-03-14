Ext.define('SparkClassroom.widget.SimpleHeading', {
    extend: 'Ext.Widget',
    xtype: 'spark-simpleheading',

    config: {
        cls: 'spark-simpleheading',
        html: null
    },

    constructor: function(config) {
        this.element.tag = 'h' + config.level || 1;
        this.callParent(arguments);
    },

    updateCls: function(cls, oldCls) {
        if (oldCls) {
            this.element.removeCls(oldCls);
        }

        this.element.addCls(cls);
    },

    updateHtml: function(html) {
        this.element.update(html);
    }
});