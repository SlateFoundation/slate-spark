Ext.define('Ext.overrides.selection.CheckboxModel', {
    override: 'Ext.selection.CheckboxModel',
    privates: {
        selectWithEventMulti: function(record, e, isSelected) {
            var me = this;

            if (!e.shiftKey && !e.ctrlKey && e.getTarget(me.checkSelector)) {
                if (isSelected) {
                    me.doDeselect(record); // Second param here is suppress event, not "keep selection"
                } else {
                    me.doSelect(record, true);
                }
            } else {
                me.callParent([record, e, isSelected]);
            }
        }
    }
});
