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
            // & investigate perf of tpl inside renderer?
            var stages,
                statusCls = function(expected, actual) {
                    if (Ext.isEmpty(expected) || Ext.isEmpty(actual)) {
                        return 'is-empty';
                    }

                    if (expected == actual) {
                        return 'is-on-pace';
                    }

                    if (expected > actual) {
                        return 'is-ahead';
                    }

                    if (expected < actual) {
                        return 'is-behind';
                    }

                    return '';
                },
                dataIndex = this.getDataIndex(),
                studentUsername = dataIndex.split('_').shift(),
                studentSparkpoint = r.get(studentUsername),
                gaugeTpl = new Ext.XTemplate([
                    '<div class="flex-ct cycle-gauge">',
                        '<tpl for=".">',
                            '<div class="flex-1 cycle-gauge-pip {status}">',
                                '<abbr class="pip-text" data-student-id="' + (studentSparkpoint ? studentSparkpoint.get('student_id') : '') + '" title="{title}">{shortText}</abbr>',
                            '</div>',
                        '</tpl>',
                    '</div>'
                ]).compile();

            stages = [
                {
                    title: 'Learn and Practice',
                    shortText: 'L&amp;P',
                    status: studentSparkpoint ? statusCls(studentSparkpoint.get('learn_pace_target'), studentSparkpoint.get('learn_pace_actual')) : 'is-empty'
                },
                {
                    title: 'Conference',
                    shortText: 'C',
                    status: studentSparkpoint ? statusCls(studentSparkpoint.get('conference_pace_target'), studentSparkpoint.get('conference_pace_actual')) : 'is-empty'
                },
                {
                    title: 'Apply',
                    shortText: 'Ap',
                    status: studentSparkpoint ? statusCls(studentSparkpoint.get('apply_pace_target'), studentSparkpoint.get('apply_pace_actual')) : 'is-empty'
                },
                {
                    title: 'Assess',
                    shortText: 'As',
                    status: studentSparkpoint ? statusCls(studentSparkpoint.get('assess_pace_target'), studentSparkpoint.get('assess_pace_actual')) : 'is-empty'
                }
            ];

            return gaugeTpl.apply(stages);
        }
    },

    listeners: {
        sort: function(column, direction) {
            var dataIndex = column.getDataIndex(),
                grid = column.up('grid'),
                store = grid.getStore(),
                sorters = store.getSorters();

            if (!direction) {
                return;
            }

            if (!Ext.isEmpty(sorters)) {
                sorters.removeAll();
            }

            grid.getStore().sort({
                sorterFn: function(r1, r2) {
                    var defaultValue = (direction == 'ASC' ? 100 : -100),
                        d1 = r1.get(dataIndex) || defaultValue,
                        d2 = r2.get(dataIndex) || defaultValue;

                    if (direction == 'ASC') {
                        return (d1 > d2 ? 1 : (d1 === d2 ? 0 : -1));
                    }

                    return (d1 > d2 ? -1 : (d1 === d2 ? 0 : 1));
                }
            });

        }
    },

    onColumnTap: function(ev) {
        var me = this;

        if (ev.getTarget().className.indexOf('spark-config-btn') > -1) {
            me.fireEvent('sparkconfigclick', me.getDataIndex());
            return;
        }

        me.callParent(arguments);
    }
});
