/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.Application', {
    requires: [
        'Spark2Manager.view.Main',
        'Emergence.util.API',
        'Spark2Manager.Util',
        'Spark2Manager.store.Assessments',
        'Spark2Manager.store.AssessmentTypes',
        'Spark2Manager.store.Comments',
        'Spark2Manager.store.GradeLevels',
        'Spark2Manager.store.Links',
        'Spark2Manager.store.Ratings',
        'Spark2Manager.store.Standards',
        'Spark2Manager.store.StandardCodes',
        'Spark2Manager.store.StandardMappings',
        'Spark2Manager.store.StandardRefs',
        'Spark2Manager.store.Tags',
        'Spark2Manager.store.TagMaps',
        'Spark2Manager.store.Vendors',
        'Spark2Manager.store.VendorDomains'

    ],

    extend: 'Ext.app.Application',
    
    name: 'Spark2Manager',

    controllers: [
        'Learn',
        'Conference',
        'Apply'
    ],

    stores: [
        'Assessments',
        'AssessmentTypes',
        'Comments',
        'GradeLevels',
        'Links',
        'Ratings',
        'Standards',
        'StandardCodes',
        'StandardMappings',
        'StandardRefs',
        'Tags',
        'TagMaps',
        'Vendors',
        'VendorDomains'
    ],

    views: [
        'Main'
    ],
    
    launch: function () {
        alert('application.js launch executed');

        var me = this;
        // TODO: @themightychris said that there is a better way to do this
        if (location.hostname.indexOf('slate.ninja') === -1) {
            Emergence.util.API.setHostname('slate.ninja');
        }

        Ext.StoreMgr.requireLoaded(['Vendors', 'VendorDomains'], function() {
            alert('StoreMgr require loaded');
            me.getMainView().create({
                plugins: 'viewport'
            });
        });
    }
});
