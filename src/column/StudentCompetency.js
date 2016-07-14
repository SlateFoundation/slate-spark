Ext.define('SparkClassroom.column.StudentCompetency', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-student-competency-column',

    config: {
        dataIndex: '',
        cls: 'spark-sparkpoints-column',
        width: 192,
        cell: {
            innerCls: 'no-padding',
            encodeHtml: false
        },

        renderer: function(v, r) {
            var dataIndex = this.getDataIndex(),
                studentUsername = dataIndex.split('_').shift(),
                studentData = r.get(studentUsername),
                completedMarkup = ' is-complete">&bull;',
                html = [
                    '<div class="flex-ct cycle-gauge">',
                        '<div class="flex-1 cycle-gauge-pip',
                            (studentData && studentData["learn_finish_time"] ? completedMarkup : '">&nbsp;'),
                        '</div>',
                        '<div class="flex-1 cycle-gauge-pip',
                            (studentData && studentData["conference_finish_time"] ? completedMarkup : '">&nbsp;'),
                        '</div>',
                        '<div class="flex-1 cycle-gauge-pip',
                            (studentData && studentData["apply_finish_time"] ? completedMarkup : '">&nbsp;'),
                        '</div>',
                        '<div class="flex-1 cycle-gauge-pip',
                            (studentData && studentData["assess_finish_time"] ? completedMarkup : '">&nbsp;'),
                        '</div>',
                    '</div>'
                ];
            return html.join('');
        }
    },

    listeners: {
        sort: function(column, direction, oldDirection) {
            var dataIndex = column.getDataIndex(),
                grid = column.up('grid'),
                store = grid.getStore(),
                sorters = store.getSorters();

            if (!direction) {
                return;
            }

            if (store.sorters.length) {
                store.sorters.removeAll();
            }

            grid.getStore().sort({
                sorterFn: function(r1, r2) {
                    var defaultValue = (direction == 'ASC' ? 100 : -100),
                        d1 = r1.get(dataIndex) || defaultValue,
                        d2 = r2.get(dataIndex) || defaultValue;

                    if (direction == 'ASC') {
                        return (d1 > d2 ? 1 : (d1 === d2 ? 0 : -1));
                    } else {
                        return (d1 > d2 ? -1 : (d1 === d2 ? 0 : 1));
                    }
                }
            });

        }
    }
});
