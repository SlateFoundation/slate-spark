Ext.define('SparkClassroom.column.AssignSingle', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-assign-column-single',
    requires: [
        'SparkClassroom.assign.Popup'
    ],

    config: {
        popup: null,
        popupCell: null,
        showTrigger: true,

        cls: 'spark-assign-column-single',
        text: 'Assign',
        width: 80,
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
        renderer: function(v, r) {
            // TODO get rid of randomized junk
            // TODO? use View Models instead of renderer/tpl?
            var states = [ 'is-empty', 'is-partial', 'is-full' ],
                out = ['<div class="flex-ct">'];

            out.push(
                '<div class="assign-control-item ' + states[Math.floor(Math.random() * 3)] + '">',
                    '<div class="assign-control-frame single-control">',
                        '<i class="assign-control-indicator"></i>',
                    '</div>',
                '</div>'
            );

            if (this.getShowTrigger()) {
                out.push(
                    '<div class="assign-control-item">',
                        '<div class="menu-trigger"><i class="fa fa-lg fa-angle-down"></i></div>',
                    '</div>'
                );
            }

            out.push('</div>');
            return out.join('');
        }
    },

    updatePopupCell: function(cell, oldCell) {
        var me = this,
            popup = this.getPopup();

        if (!cell) {
            popup.hide();
            return;
        }

        if (!popup) {
            me.setPopup(popup = Ext.create('SparkClassroom.assign.Popup', {
                hidden: true
            }));
            (me.up('{getScrollable()}') || Ext.Viewport).add(popup);
        }

        popup.showBy(cell.element.down('.menu-trigger'), 'tr-b?');

    }
});
