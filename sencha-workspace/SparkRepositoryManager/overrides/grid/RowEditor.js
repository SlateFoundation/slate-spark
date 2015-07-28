Ext.define('SparkRepositoryManager.overrides.grid.RowEditor', {
    override: 'Ext.grid.RowEditor',

    requires: [
        'Ext.tip.ToolTip',
        'Ext.form.Panel'
    ],

    // TODO: test if this can be removed in framework > 5.1.1.451, seems like it was worked on
    insertColumnEditor: function(column) {
        var floatingButtons = this.getFloatingButtons(),
            field = column.field,
            _syncButtons = function() {
                if (floatingButtons.rendered) {
                    floatingButtons.setButtonPosition(floatingButtons.position);
                }
            };

        this.callParent(arguments);

        if (field) {
            field.on('autosize', _syncButtons);
        }
    },

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
            return '<ul class="' + Ext.baseCSSPrefix + 'list-plain">' + me.createErrorListItem(me.dirtyText) + '</ul>';
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
    },

    // determines the amount by which the row editor will overflow, and flips the buttons
    // to the top of the editor if the required scroll amount is greater than the available
    // scroll space. Returns the scrollDelta required to scroll the editor into view after
    // adjusting the button position.
    syncButtonPosition: function(scrollDelta) {
        var me = this,
            floatingButtons = me.getFloatingButtons(),
            scrollingView = me.scrollingView,
            overflow = me.getScrollDelta() - (scrollingView.getScrollable().getSize().y -
                scrollingView.getScrollY() - me.scrollingViewEl.dom.clientHeight);

        if (overflow > 0) {
            if (!me._buttonsOnTop) {
                floatingButtons.setButtonPosition('top');
                me._buttonsOnTop = true;
            }
            scrollDelta = 0;
        } else if (me._buttonsOnTop !== false) {
            floatingButtons.setButtonPosition('bottom');
            me._buttonsOnTop = false;
        }
        // Ensure button Y position is synced with Editor height even if button
        // orientation doesn't change
        else {
            floatingButtons.setButtonPosition(floatingButtons.position);
        }

        return scrollDelta;
    }

});
