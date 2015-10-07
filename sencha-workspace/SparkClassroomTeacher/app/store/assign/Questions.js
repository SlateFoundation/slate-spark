/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Questions', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'question',
            'grade',
            'created',
            'created_by',
            'assign'
        ],

        data: [
            {sparkpoints: ['9.IF.A.1','9.LE.A.3'], question: 'When was the last time you used this concept in real life?', created: '5/16/15', created_by: 'Albert Motley', grade: 9, assign: false},
            {sparkpoints: ['9.REI.D.11'], question: 'Who was the last person you saw use this concept?', created: '5/16/15', created_by: 'Nithi Thomas', grade: 9, assign: true},
            {sparkpoints: ['9.IF.C.7'], question: 'How could this sparkpoint make you a better person?', created: '6/16/15', created_by: 'Diania Henderson', grade: 9, assign: false},
            {sparkpoints: ['9.REI.D.11'], question: 'Which Learn helped you the most?', created: '5/19/15', created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9.IF.C.7'], question: 'Did you talk to your parents about this concept?', created: '5/16/15', created_by: 'Diania Henderson', grade: 9, assign: false},
            {sparkpoints: ['9.CO.C.11'], question: 'When can you apply this concept today?', created: '5/19/15', created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9.LE.A.2'], question: 'Which of your peers has demonstrated this? ', created: '5/16/15', created_by: 'Kelly Gump', grade: 9, assign: false},
            {sparkpoints: ['9.IF.C.7'], question: 'How does this relate to your personal goals?', created: '6/16/15', created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9.IF.A.2'], question: 'How would you describe this Sparkpoint to an alien?', created: '5/19/15', created_by: 'Diania Henderson', grade: 9, assign: false},
            {sparkpoints: ['9.IF.A.1','9.LE.A.3'], question: 'What are some practical ways you can apply this?', created: '6/16/15', created_by: 'Kelly Gump', grade: 9, assign: true}
        ]
    }
});