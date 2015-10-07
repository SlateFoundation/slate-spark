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
                    a: 'I can interpret complicated expressions, in terms of the context, by viewing one or more of their parts as a single entity for expressions that represent a contextual quantity.'
                },
                {
                    q: 'Describe the steps used to show understanding of the skill.',
                    a: '<ol><li>Identify parts of an expression - such as terms, factors, and coefficients.</li><li>identify parts of a complicated expressions by viewing one or more of their parts as a single entity.</li></ol>'
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