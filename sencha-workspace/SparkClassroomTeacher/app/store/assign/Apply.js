/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Apply', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'title',
            'grade',
            'assign',
            'created_by',
            'dok'
        ],

        data: [
            {sparkpoints: ['9-12.LS.1.2'], title: 'Jewelry with a purpose?', dok: 3, created_by: 'Diania Henderson', grade: 9, assign: false},
            {sparkpoints: ['9-12.LS.1.1'], title: 'Bracelet DNA', dok: 2, created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9-12.LS.1.2'], title: 'Organs and Systems and Functions Oh My!', dok: 3, created_by: 'Kelly Gump', grade: 9, assign: false},
            {sparkpoints: ['9-12.LS.1.2'], title: 'A non stop journey', dok: 1, created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9-12.LS.1.3'], title: 'Its all about balance', dok: 3, created_by: 'Kelly Gump', grade: 9, assign: false},
            {sparkpoints: ['9-12.LS.1.3'], title: 'Out of whack', dok: 3, created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9-12.LS.1.4'], title: 'Mitosis in clay', dok: 3, created_by: 'Kelly Gump', grade: 9, assign: false},
            {sparkpoints: ['9-12.LS.1.4'], title: 'The great conversation', dok: 1, created_by: 'Diania Henderson', grade: 9, assign: true},
            {sparkpoints: ['9-12.LS.1.5'], title: 'In goes the sun...out comes energy!', dok: 2, created_by: 'Kelly Gump', grade: 9, assign: false},
            {sparkpoints: ['9-12.LS.1.5'], title: 'House of cards', dok: 1, created_by: 'Kelly Gump', grade: 9, assign: true}
        ]
    }
});