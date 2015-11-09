Ext.define('SparkClassroomTeacher.view.work.apply.GradePanel', {
    extend: 'SparkClassroom.widget.Panel',
    xtype: 'spark-teacher-work-apply-gradepanel',


    config: {
        grade: null,

        title: 'Grade the Apply',
        data: {
            items: [ 0, 1, 2, 3, 4 ]
        },
        tpl: [
            '<div class="number-line-picker">',
                '<div class="number-line-track"></div>',
                '<div class="number-line-track-filler"></div>',
                '<ul class="number-line-items">',
                    '<tpl for="items">',
                        '<li class="number-line-item"><a href="#{.}" class="number-line-target">{.}</a></li>',
                    '</tpl>',
                '</ul>',
            '</div>'
        ],
        listeners: {
            element: 'element',
            click: function(ev, t) {
                if (ev.getTarget('.number-line-target')) {
                    ev.stopEvent();
                    this.setGrade(parseInt(t.hash.substr(1), 10));
                }
            }
        }
    },

    updateGrade: function(grade, oldGrade) {
        var me = this,
            fillerEl = me.fillerEl || (me.fillerEl = me.element.down('.number-line-track-filler')),
            lineItemEls = me.lineItemEls || (me.lineItemEls = me.element.query('.number-line-target', false)),
            len = lineItemEls.length, i = 0;

        if (grade === null) {
            grade = -1;
        }

        for (; i < len; i++) {
            lineItemEls[i].toggleCls('is-filled', grade >= i);
        }

        fillerEl.setWidth(grade / 4 * 100 + '%');

        me.fireEvent('gradechange', me, grade, oldGrade);
    }
});