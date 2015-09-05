/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.application({
    name: 'SparkClassroomStudent',

    extend: 'SparkClassroomStudent.Application',
    requires: [
        'SparkClassroom.TitleBar',
        'SparkClassroom.NavBar',
        'SparkClassroom.work.TabBar',
        'SparkClassroomStudent.view.TabsContainer'
    ],

    //-------------------------------------------------------------------------
    // Most customizations should be made to SparkClassroomStudent.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------

    views: [
        'work.apply.Container',
        'work.learn.Container',
        'work.conference.Container',
        'work.assess.Container',
        'SparkStudentNavBar'
    ],

    controllers: [
        'Viewport'
    ],

    config: {
        viewport: {
            layout: 'auto',
            scrollable: 'vertical'
        }
    }
});