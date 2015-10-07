/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Learn', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'grade',
            'title',
            'url',
            'dok',
            'type',
            'student_rating',
            'teacher_rating',
            'assign',
            'vendor',
            'issue'
        ],

        data: [
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'video', student_rating: 3, teacher_rating: 3, assign: 1, grade: 9, sparkpoints: ['4.LA.M.B','5.ZA.U.B'], vendor: 'Youtube', issue: true},
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'article', student_rating: 3, teacher_rating: 3, assign: 2, grade: 12, sparkpoints: ['4.LA.M.B','5.ZA.U.B'], vendor: 'PBS', issue: false},
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'video', student_rating: 3, teacher_rating: 3, assign: 4, grade: 11, sparkpoints: ['4.LA.M.B','5.ZA.U.B'], vendor: 'Illuminate', issue: false},
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'IEPFriendly', student_rating: 3, teacher_rating: 3, assign: 1, attachment: 'google.com', grade: 11, sparkpoints: ['4.LA.M.B','5.ZA.U.B'], vendor: 'Reading', issue: true},
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'video', student_rating: 3, teacher_rating: 3, assign: 3, grade: 9, sparkpoints: ['4.LA.M.B'], vendor: 'Youtube', issue: true},
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'Practice Problems', student_rating: 3, teacher_rating: 3, assign: 1, attachment: 'doc.com', grade: 10, sparkpoints: ['4.LA.M.B','5.ZA.U.B'], vendor: 'PBS', issue: false},
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'video', student_rating: 3, teacher_rating: 3, assign: 2, grade: 9, sparkpoints: ['4.LA.M.B','5.ZA.U.B'], vendor: 'Brainpop', issue: false},
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'Reading', student_rating: 3, teacher_rating: 3, assign: 1, grade: 10, sparkpoints: ['4.LA.M.B','5.ZA.U.B'], vendor: 'Youtube', issue: false},
            {title: 'Learn Title', url: 'http://pbs.com/videos/science', dok: 3, type: 'video', student_rating: 3, teacher_rating: 3, assign: 3, attachment: 'link.com', grade: 9, sparkpoints: ['5.ZA.U.B'], vendor: 'Youtube', issue: false}
        ]
    }
});