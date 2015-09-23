Ext.define('SparkClassroom.column.AssignSingle', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-assign-column-single',

    config: {
        cls: 'spark-assign-column-single',
        showTrigger: true,
        text: 'Assign',
        width: 80,
        cell: {
            encodeHtml: false
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
    }
});
