Ext.define('SparkClassroomTeacher.view.work.conference.Worksheet', {
    extend: 'Ext.Component',
    xtype: 'spark-teacher-work-conference-worksheet',


    config: {
        cls: 'content-card',
        tpl: [
            '<dl class="spark-qna">',
                '<div class="spark-qna-item">',
                    '<dt class="spark-qna-q">Restate the Sparkpoint in your own words.</dt>',
                    '<dd class="spark-qna-a">{restated:nl2br}</dd>',
                '</div>',

                '<div class="spark-qna-item">',
                    '<dt class="spark-qna-q">Describe the steps used to show understanding of the skill.</dt>',
                    '<dd class="spark-qna-a">{steps:nl2br}</dd>',
                '</div>',

                '<div class="spark-qna-item">',
                    '<dt class="spark-qna-q">Cite three real world examples of the Sparkpoint</dt>',
                    '<dd class="spark-qna-a">',
                        '<ol>',
                            '<li>{example_1}</li>',
                            '<li>{example_2}</li>',
                            '<li>{example_3}</li>',
                        '</ol>',
                    '</dd>',
                '</div>',

                '<div class="spark-qna-item">',
                    '<dt class="spark-qna-q">Peer&rsquo;s name</dt>',
                    '<dd class="spark-qna-a"><tpl if="peer">{[values.peer.get("FullName")]}</tpl></dd>',
                '</div>',

                '<div class="spark-qna-item">',
                    '<dt class="spark-qna-q">Feedback from peer</dt>',
                    '<dd class="spark-qna-a">{peer_feedback:nl2br}</dd>',
                '</div>',
            '</dl>'
        ]
    }
});