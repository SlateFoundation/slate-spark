/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Assess', {
    extend: 'Ext.data.Store',


    config: {
        fields: [
            'sparkpoints',
            'title',
            'url',
            'grade',
            'type',
            'assign',
            'vendor',
            'issue'
        ],

        data: [
            {sparkpoints: ['9.ID.C.9'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=9601&page=Assessment_OverviewController', title: 'Math 1.OA.D8', type: 'Digital', grade: 9, assign: false, vendor: 'Illuminate', issue: true},
            {sparkpoints: ['9.ID.C.9'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=9543&page=Assessment_OverviewController', title: 'Math 1.OA.A1', type: 'Digital', grade: 9, assign: true, vendor: 'Illuminate', issue: true},
            {sparkpoints: ['9.ID.C.9'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=9526&page=Assessment_OverviewController', title: 'Math Quiz', type: 'Digital', grade: 9, assign: false, vendor: 'Illuminate', issue: false},
            {sparkpoints: ['9.BF.A.1b'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=9570&page=Assessment_OverviewController', title: 'Math 3.OA.04', type: 'Digital', grade: 9, assign: true, vendor: 'Illuminate', issue: false},
            {sparkpoints: ['9.BF.A.1b'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=2025&page=Assessment_OverviewController', title: 'Key Data Systems', type: 'Digital', grade: 9, assign: false, vendor: 'Illuminate', issue: false},
            {sparkpoints: ['9.BF.A.1b'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=8983&page=Assessment_OverviewController', title: '3.OA.4 Retest', type: 'Digital', grade: 9, assign: true, vendor: 'Illuminate', issue: true},
            {sparkpoints: ['9.BF.A.1b'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=7338&page=Assessment_OverviewController', title: 'Math 3.OA.04', type: 'Digital', grade: 9, assign: false, vendor: 'Illuminate', issue: false},
            {sparkpoints: ['9.BF.A.1b'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=7335&page=Assessment_OverviewController', title: 'Math 3.OA.09', type: 'Digital', grade: 9, assign: true, vendor: 'Illuminate', issue: true},
            {sparkpoints: ['9.CP.A.3'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=9636&page=Assessment_OverviewController', title: 'Math 3.OA.09', type: 'Digital', grade: 9, assign: false, vendor: 'Illuminate', issue: false},
            {sparkpoints: ['9.CP.A.3'], url: 'https://matchbook.illuminateed.com/live/?assessment_id=9602&page=Assessment_OverviewController', title: 'Math 3.OA.09', type: 'Digital', grade: 9, assign: true, vendor: 'Illuminate', issue: false}
        ]
    }
});