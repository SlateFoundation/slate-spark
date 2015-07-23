/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroomTeacher.view.gps.StudentList', {
    extend: 'Ext.dataview.List',
    xtype: 'spark-gps-studentList',

    config: {
        itemTpl: [
            '{FirstName} {LastName} <tpl if="Grade">- {Grade}</tpl><br>',
            '<tpl for="Standards">',
                '{.}',
            '</tpl>'
        ],
        grouped: true,
        removeEmptyHeaders: true,
        
        initialize: function () {
            this.callParent(arguments);

            this.pinnedHeader = Ext.factory({
                xtype: 'listitemheader',
                translatable: {
                    translationMethod: this.translationMethod
                },
                cls: [baseCls + '-header', baseCls + '-header-swap'],
                config: {
                    initialize: function () {
                        this.callParent(arguments);
                        debugger;
                        if (Ext.isEmpty(this.getInnerHtmlElement().dom.innerHTML)) {
                            this.hide();
                        }
                    }
                }
            });
        },

        store: {
            fields: ['FirstName', 'LastName', 'Grade', 'Level', 'Status', 'Standards', 'Flag'],
            grouper: {
                property: 'Flag',
                direction: 'ASC'
            },
            data:[
                //Learn Data
                {FirstName: "Milton", LastName: 'Jossund', Level: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content'], Flag: 'Help'},
                {FirstName: "John", LastName: 'Angeloff', Level: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content'], Flag: 'Help'},
                {FirstName: "Delila", LastName: 'Dach', Level: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Billie", LastName: 'Heimbuch', Grade: 'G?', Level: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Kimiko", LastName: 'Sasaki', Level: 'Learn', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                
                //Conference Data
                {FirstName: "Reanna", LastName: 'Mask', Status: 'Waiting', Grade: '*', Level: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Zora", LastName: 'Catherwood', Status: 'Waiting', Grade: '*', Level: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content'], Flag: 'Help'},
                {FirstName: "Julene", LastName: 'Sander', Status: 'In Conference', Grade: 'L', Level: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content'], Flag: 'Help'},
                {FirstName: "Milton", LastName: 'Vanvorst', Status: 'In Conference', Grade: 'G', Level: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content'], Flag: 'Help'},
                {FirstName: "Milton", LastName: 'Jossund', Status: 'In Conference', Level: 'Conference', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                
                //Apply Data
                {FirstName: "Milton", LastName: 'Vanvorst', Status: 'Working', Grade: 'N', Level: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Milton", LastName: 'Catherwood', Status: 'Working', Grade: 'G', Level: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Cheree", LastName: 'Masaro', Status: 'Needs Grading', Grade: '*', Level: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Milton", LastName: 'Heimbuch', Status: 'Needs Grading', Grade: '*', Level: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Milton", LastName: 'Jossund', Status: 'Needs Grading', Grade: '*', Level: 'Apply', Standards: ['CC.Content', 'CC.SS.Math.Content'], Flag: 'Help'},
                
                //Assess Data
                {FirstName: "Milton", LastName: 'Jossund', Status: 'Needs Grading', Grade: '*', Level: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Milton", LastName: 'Catherwood', Status: 'Needs Grading', Grade: 'A?', Level: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Brendan", LastName: 'Vanvorst', Grade: '*', Level: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content'], Flag: 'Help'},
                {FirstName: "Reanna", LastName: 'Jossund', Grade: 'IT', Level: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content']},
                {FirstName: "Kimiko", LastName: 'Heimbuch', Grade: '*', Level: 'Assess', Standards: ['CC.Content', 'CC.SS.Math.Content']},
            ]
        }
    }
});