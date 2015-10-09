Ext.define('SparkClassroom.column.StudentCompetency', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-student-competency-column',

    config: {
        dataIndex: '',
        cls: 'spark-sparkpoints-column',
        width: 192,
        text: [
            '<div class="text-center">',
                '[Student Fullname] ',
                '<small class="flex-ct text-center">',
                    '<div class="flex-1">L&amp;P</div>',
                    '<div class="flex-1">C</div>',
                    '<div class="flex-1">A</div>',
                    '<div class="flex-1">A</div>',
                '</small>',
            '</div>'
        ].join(''),
        cell: {
            innerCls: 'no-padding',
            encodeHtml: false
        },
        tpl: [
            '<div class="flex-ct cycle-gauge">',
                '<div class="flex-1 cycle-gauge-pip is-complete"><i class="fa fa-check"></i></div>',
                '<div class="flex-1 cycle-gauge-pip is-complete"><i class="fa fa-check"></i></div>',
                '<div class="flex-1 cycle-gauge-pip is-complete"><i class="fa fa-check"></i></div>',
                '<div class="flex-1 cycle-gauge-pip is-complete"><i class="fa fa-check"></i></div>',
            '</div>'
        ]
    }
});
