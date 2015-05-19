Ext.define('Spark2Manager.overrides.grid.RowEditor', {
    override: 'Ext.grid.RowEditor',

    requires: [
        'Ext.tip.ToolTip',
        'Ext.form.Panel'
    ],

    loadRecord: function(record) {
        var me     = this,
            form   = me.getForm(),
            fields = form.getFields(),
            items  = fields.items,
            length = items.length,
            i, displayFields,
            isValid, item;

        // temporarily suspend events on form fields before loading record to prevent the fields' change events from firing
        for (i = 0; i < length; i++) {
            item = items[i];
            item.suspendEvents();
            item.reset();
        }

        form.loadRecord(record);

        for (i = 0; i < length; i++) {
            /**********************************************************
             HACK: all fields were marked as dirty except displayFields
             **********************************************************/
            items[i].originalValue = items[i].getValue();
            items[i].resumeEvents();
        }

        // Because we suspend the events, none of the field events will get propagated to
        // the form, so the valid state won't be correct.
        if (form.hasInvalidField() === form.wasValid) {
            delete form.wasValid;
        }

        isValid = form.isValid();
        /*********************************************************
         HACK: Do not show validation errors when loading a record
         *********************************************************/
        if (me.errorSummary) {
            me.hideToolTip();
        }

        me.updateButton(isValid);

        // render display fields so they honor the column renderer/template
        displayFields = me.query('>displayfield');
        length = displayFields.length;

        for (i = 0; i < length; i++) {
            me.renderColumnData(displayFields[i], record);
        }
    },

    repositionTip: function() {
        var me = this,
            tip = me.getToolTip(),
            context = me.context,
            row = Ext.get(context.row),
            viewEl = me.scrollingViewEl,
            viewHeight = viewEl.dom.clientHeight,
            viewTop = me.lastScrollTop,
            viewBottom = viewTop + viewHeight,
            rowHeight = row.getHeight(),
            rowTop = row.getOffsetsTo(me.context.view.body)[1],
            rowBottom = rowTop + rowHeight,
            buttons = me.getFloatingButtons();

        if (rowBottom > viewTop && rowTop < viewBottom) {
            // Use the ToolTip's anchoring to get the left/right positioning correct with
            // respect to space available on the default (right) side.

            // tip.anchorTarget = me.editingPlugin.getEditor().el;
            // tip.mouseOffset = [0, row.getOffsetsTo(viewEl)[1]];

            // The tip will realign itself based upon its new offset
            tip.show();
            tip.setX((window.innerWidth - 250) / 2);
            tip.setY(buttons.el.getTop() + (buttons.getHeight() * 1.5));

            me.hiddenTip = false;
        } else {
            tip.hide();
            me.hiddenTip = true;
        }
    },

    getToolTip: function() {
        var me = this,
            tip = me.tooltip,
            grid = me.editingPlugin.grid;

        if (!tip) {
            me.tooltip = tip = new Ext.tip.ToolTip({
                cls: Ext.baseCSSPrefix + 'grid-row-editor-errors',
                title: me.errorsText,
                autoHide: false,
                closable: true,
                closeAction: 'disable'
            });

            window.tooltip = tip;

            grid.add(tip);

            // Layout may change the grid's positioning.
           me.mon(grid, {
                afterlayout: me.onGridLayout,
                scope: me
            });
        }

        return tip;
    },

    getErrors: function() {
        var me        = this,
            errors    = [],
            fields    = me.query('>[isFormField]'),
            length    = fields.length,
            i, fieldErrors, field;

        if (me.isDirty()) {
            for (i = 0; i < length; i++) {
                field = fields[i];
                fieldErrors = field.getErrors();
                if (fieldErrors.length) {
                    errors.push(me.createErrorListItem(fieldErrors[0], field.column.text));
                }
            }
        }

        // Only complain about unsaved changes if all the fields are valid
        if (!errors.length && !me.autoCancel && me.isDirty()) {
            errors[0] = me.createErrorListItem(me.dirtyText);
        }

        if (errors.length > 0) {
            return '<ul class="' + Ext.baseCSSPrefix + 'list-plain">' + errors.join('') + '</ul>';
        }
    },

    showToolTip: function() {
        var me = this,
            tip = me.getToolTip(),
            errors = me.getErrors();

        if (errors) {
            tip.update(me.getErrors());
            me.repositionTip();
            tip.enable();
        } else {
            me.hideToolTip();
        }
    }
});
