/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.NavSubpanel', {
    extend: 'Ext.Container',
    xtype: 'spark-navsubpanel',

    config: {
        cls: 'spark-navsubpanel',
        width: 400,
        left: 0 // must be set here to force container to add as floating, see https://www.sencha.com/forum/showthread.php?300896
    }
});