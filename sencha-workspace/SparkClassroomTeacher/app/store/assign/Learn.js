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
            {title: 'Recognize functions by comparing relationships', url: 'https://learnzillion.com/lesson_plans/887-recognize-functions-by-comparing-relationships-that-are-functions-with-relationships-that-are-not', dok: 3, type: 'video', student_rating: 3, teacher_rating: 3, assign: 1, grade: 9, sparkpoints: ['9.IF.A.1'], vendor: 'OpenEd', issue: true},
            {title: 'Understand simple square root equations', url: 'https://learnzillion.com/lesson_plans/483-understand-that-simple-square-root-equations-can-be-solved-analytically-by-using-inverse-operations', dok: 3, type: 'article', student_rating: 3, teacher_rating: 5, assign: 2, grade: 9, sparkpoints: ['9.RE.A.2'], vendor: 'LearnZillion', issue: false},
            {title: 'Analyze the unit rates of change', url: 'https://learnzillion.com/lesson_plans/746-analyze-the-unit-rates-of-change-of-translated-rational-functions-by-modeling-per-person-coste', dok: 3, type: 'video', student_rating: 3, teacher_rating: 3, assign: 4, grade: 9, sparkpoints: ['9.IF.B.6'], vendor: 'Illuminate', issue: false},
            {title: 'Understand and discover extraneous solutions', url: 'https://learnzillion.com/lesson_plans/482-understand-and-discover-extraneous-solutions-to-a-square-root-equation-by-using-inverse-operations-to-solve', dok: 3, type: 'IEPFriendly', student_rating: 4, teacher_rating: 3, assign: 1, attachment: 'google.com', grade: 9, sparkpoints: ['9.REI.A.2','9.REI.A.1'], vendor: 'OpenEd', issue: true},
            {title: 'Find where a rational function intersects', url: 'https://learnzillion.com/lesson_plans/745-find-where-a-rational-function-and-a-horizontal-line-intersect-and-interpret-this-point-in-a-particular-context', dok: 3, type: 'video', student_rating: 3, teacher_rating: 6, assign: 3, grade: 9, sparkpoints: ['9.CO.C.11'], vendor: 'LearnZillion', issue: true},
            {title: 'Graph a system of linear equations', url: 'https://learnzillion.com/lesson_plans/436-graph-a-system-of-linear-and-exponential-equations-and-interpret-regions-of-the-graph-in-context', dok: 3, type: 'Practice Problems', student_rating: 8, teacher_rating: 3, assign: 1, attachment: 'doc.com', grade: 9, sparkpoints: ['9.IF.C.7d'], vendor: 'PBS', issue: false},
            {title: 'Prove and apply relationships', url: 'https://learnzillion.com/lesson_plans/439-recognize-that-an-exponential-function-will-always-overtake-a-linear-function-by-examining-tables-and-graphs', dok: 3, type: 'video', student_rating: 3, teacher_rating: 7, assign: 2, grade: 9, sparkpoints: ['9.REI.D.11'], vendor: 'Brainpop', issue: false},
            {title: 'Analyze rate of change', url: 'https://learnzillion.com/lesson_plans/743-build-a-rational-function-by-modeling-an-inversely-proportional-relationship', dok: 3, type: 'Reading', student_rating: 3, teacher_rating: 6, assign: 1, grade: 9, sparkpoints: ['9.IF.A.2'], vendor: 'Youtube', issue: false},
            {title: 'Recognize exponential functions', url: 'https://learnzillion.com/lesson_plans/742-find-where-a-rational-function-and-a-linear-function-intersect-and-interpret-this-point-in-a-particular-context', dok: 3, type: 'video', student_rating: 3, teacher_rating: 3, assign: 3, attachment: 'link.com', grade: 9, sparkpoints: ['9.IF.C.7d'], vendor: 'OpenEd', issue: false}
        ]
    }
});