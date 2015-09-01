/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.work.conference.peer.Component', {
    extend: 'Ext.Container',
    xtype: 'spark-teacher-work-conference-peer-component',
    cls: 'content-card',

    config: {
        data: {
            questions: [
                {
                    q: 'Restate the Learn target in your own words.',
                    a: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
                },
                {
                    q: 'Describe the steps used to show understanding of the skill.',
                    a: '<ol><li>First step</li><li>Second step</li><li>Third step</li></ol>'
                },
                {
                    q: 'Cite three real-world examples of the learning target.',
                    a: '<ol><li>First example</li><li>Second example</li><li>Third example</li></ol>'
                }
            ]
        },
        tpl: [
            '<dl class="spark-qna">',
                '<tpl foreach="questions">',
                    '<div class="spark-qna-item">',
                        '<dt class="spark-qna-q">{q}</dt>',
                        '<dd class="spark-qna-a">{a}</dd>',
                    '</div>',
                '</tpl>',
            '</dl>'
        ]
    }
});