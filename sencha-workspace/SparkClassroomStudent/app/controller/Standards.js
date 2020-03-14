Ext.define('SparkClassroomStudent.controller.Standards', {
    extend: 'Ext.app.Controller',


    routes: {
        'standards': 'showStandards'
    },

    views: [
        'Grid@SparkClassroom.standards'
    ],

    refs: {
        navBar: 'spark-student-navbar',
        standardsNavButton: 'spark-student-navbar button#standards',

        tabsCt: 'spark-student-tabscontainer',

        standardsGrid: {
            selector: 'spark-standards-grid',
            autoCreate: true,

            xtype: 'spark-standards-grid'
        }
    },

    control: {
        standardsNavButton: {
            tap: 'onNavStandardsTap'
        },
        standardsGrid: {
            activate: 'onStandardsGridActivate'
        }
    },


    // route handlers
    showStandards: function() {
        var tabsCt = this.getTabsCt();

        tabsCt.removeAll();
        tabsCt.add(this.getStandardsGrid());
    },


    // event handlers
    onNavStandardsTap: function() {
        this.redirectTo('standards');
    },

    onStandardsGridActivate: function() {
        this.getNavBar().setSelectedButton(this.getStandardsNavButton());
    }
});