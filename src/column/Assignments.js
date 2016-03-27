Ext.define('SparkClassroom.column.Assignments', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-assignments',
    requires: [
        'Ext.util.Format',
        'SparkClassroom.assign.Popup'
    ],

    config: {
        showTrigger: true,
        flags: [
            {
                id: 'required',
                text: 'Required',
                icon: 'exclamation-triangle'
            }
        ],

        popup: null,
        popupCell: null,

        text: null,
        width: null,

        dataIndex: 'assignments',
        cls: 'spark-column-assignments',
        cell: {
            encodeHtml: false,
            listeners: {
                element: 'element',
                delegate: '.menu-trigger',
                tap: function(ev, t) {
                    var me = this,
                        column = me.getColumn(),
                        popup = column.getPopup();

                    if (false === me.fireEvent('beforetriggertap', me)) {
                        return;
                    }

                    if (popup && column.getPopupCell() === me) {
                        column.setPopupCell(null);
                    } else {
                        column.setPopupCell(me);
                    }

                    me.fireEvent('triggertap', me);
                }
            }
        },
        renderer: function(assignments, r) {
            var me = this,
                htmlEncode = Ext.util.Format.htmlEncode,
                flags = me.getFlags(),
                flagsLength = flags.length,
                i = 0, flag, cls, assignmentKey,
                out = [];

            out.push('<ul class="assign-control-list">');

            for (; i < flagsLength; i++) {
                flag = flags[i];

                if (assignments.section == flag.id) {
                    cls = 'is-full';
                } else {
                    cls = 'is-empty';

                    for (assignmentKey in assignments) {
                        if (assignments[assignmentKey] == flag.id) {
                            cls = 'is-partial';
                            break;
                        }
                    }
                }

                out.push(
                     // Supported states: is-full, is-empty, is-partial
                    '<li class="assign-control-item '+cls+'" title="'+htmlEncode(flag.text)+'">',
                        '<div class="assign-control-frame">',
                            '<div class="assign-control-indicator"></div>',
                        '</div>',
                    '</li>'
                );
            }

            if (me.getShowTrigger()) {
                out.push(
                    '<li class="assign-control-item">',
                        '<div class="menu-trigger"><i class="fa fa-lg fa-angle-down"></i></div>',
                    '</li>'
                );
            }

            out.push('</ul>');

            return out.join('');
        }
    },

    updateFlags: function(flags)  {
        var me = this,
            htmlEncode = Ext.util.Format.htmlEncode,
            flagsLength = flags.length,
            i = 0, flag,
            textOut = [],
            width = 16;

        // generate column text and column width
        textOut.push('<div class="flex-ct">');

        for (; i < flagsLength; i++) {
            flag = flags[i];

            textOut.push(
                '<div class="flex-1">',
                    '<i class="fa fa-lg fa-'+flag.icon+'" title="'+htmlEncode(flag.text)+'"></i>',
                '</div>'
            );

            width += 32;
        }

        if (me.getShowTrigger()) {
            textOut.push('<div class="flex-1"></div>');

            width += 32;
        }

        textOut.push('</div>');

        // write dynamic configuration
        me.setText(textOut.join(''));
        me.setWidth(width);
    },

    updatePopupCell: function(cell, oldCell) {
        var me = this,
            popup = this.getPopup(),
            assignCellEl, x, y, scrollable;

        if (!cell) {
            popup.hide();
            return;
        }

        if (!popup) {
            me.setPopup(popup = Ext.create('SparkClassroom.assign.Popup', {
                hidden: true,
                flags: me.getFlags()
            }));

            (me.up('grid').up('{getScrollable()}') || Ext.Viewport).add(popup);
        }

        // initially render popup invisibly so it can be measuerd
        popup.setVisibility(false);
        popup.show();

        // start positioning at bottom-left corner of assign cell
        assignCellEl = cell.element;
        x = assignCellEl.getLeft();
        y = assignCellEl.getBottom();

        // shift to accomodate scrollable parent
        scrollable = popup.up('{getScrollable()}').getScrollable();
        if (scrollable) {
            y += scrollable.getPosition().y;
            y -= scrollable.getElement().getTop();
        }

        // show and position tip -- doesn't seem to have any styling at all
        // tipEl.show();
        // tipEl.addCls('x-anchor-top');

        // shift to desired corners based on size of popup and target
        x -= popup.getWidth();
        x += popup.down('spark-column-assignments').getWidth();

        popup.setLeft(x);
        popup.setTop(y);
        popup.setVisibility(true);
    }
});