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
            // TODO connect to real data
            // & investigate perf of tpl inside renderer?
            var statuses = [ 'ahead', 'on-pace', 'behind' ],
                randomStatusCls = function() { return 'is-' + statuses[Math.floor(Math.random() * statuses.length)]; },
                dataIndex = this.getDataIndex(),
                studentUsername = dataIndex.split('_').shift(),
                studentData = r.get(studentUsername),
                gaugeTpl = new Ext.XTemplate([
                    '<div class="flex-ct cycle-gauge">',
                        '<tpl for=".">',
                            '<div class="flex-1 cycle-gauge-pip {status}">',
                                '<abbr class="pip-text" title="{title}">{shortText}</abbr>',
                            '</div>',
                        '</tpl>',
                    '</div>'
                ]).compile();

            var stages = [
                {
                    title: 'Learn and Practice',
                    shortText: 'L&amp;P',
                    status: (studentData && studentData.learn_finish_time) ? randomStatusCls() : 'is-empty'
                },
                {
                    title: 'Conference',
                    shortText: 'C',
                    status: (studentData && studentData.conference_finish_time) ? randomStatusCls() : 'is-empty'
                },
                {
                    title: 'Apply',
                    shortText: 'Ap',
                    status: (studentData && studentData.apply_finish_time) ? randomStatusCls() : 'is-empty'
                },
                {
                    title: 'Assess',
                    shortText: 'As',
                    status: (studentData && studentData.assess_finish_time) ? randomStatusCls() : 'is-empty'
                }
            ];

            return gaugeTpl.apply(stages);
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
