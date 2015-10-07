Ext.define('SparkClassroom.column.AssignMulti', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-assign-column-multi',
    requires: [
        'SparkClassroom.assign.Popup'
    ],

    config: {
        popup: null,
        popupCell: null,
        showTrigger: true,

        dataIndex: 'assign',
        cls: 'spark-assign-column-multi',
        width: 176,
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
        text: '<div class="flex-ct">'
                + '<div class="flex-1"><i class="fa fa-lg fa-exclamation-triangle"></i></div>'
                + '<div class="flex-1"><i class="fa fa-lg fa-thumbs-up"></i></div>'
                + '<div class="flex-1"><i class="fa fa-lg fa-plus-circle"></i></div>'
                + '<div class="flex-1"><i class="fa fa-lg fa-times-circle"></i></div>'
                + '<div class="flex-1"></div>' // TODO hide me if showTrigger is false
            + '</div>',
        renderer: function(v, r) {
            var i = 1,
                controlItems = {},
                out = [];

            var filledItem = Math.floor(Math.random() * 4) + 1;

            // TODO replace all this randomized junk with real data
            for (; i<5; i++) {
                if (i == filledItem) {
                    var isFull = Math.random()<.5;
                    controlItems[i] = isFull ? 'is-full' : 'is-partial';
                } else {
                    controlItems[i] = 'is-empty';
                }
            }

            out.push('<ul class="assign-control-list">');

            out.push(
                '<li class="assign-control-item ' + controlItems[1] + '">',
                    '<div class="assign-control-frame">',
                        '<div class="assign-control-indicator"></div>',
                    '</div>',
                '</li>',
                '<li class="assign-control-item ' + controlItems[2] + '">',
                    '<div class="assign-control-frame">',
                        '<div class="assign-control-indicator"></div>',
                    '</div>',
                '</li>',
                '<li class="assign-control-item ' + controlItems[3] + '">',
                    '<div class="assign-control-frame">',
                        '<div class="assign-control-indicator"></div>',
                    '</div>',
                '</li>',
                '<li class="assign-control-item ' + controlItems[4] + '">',
                    '<div class="assign-control-frame">',
                        '<div class="assign-control-indicator"></div>',
                    '</div>',
                '</li>'
            );

            if (this.getShowTrigger()) {
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