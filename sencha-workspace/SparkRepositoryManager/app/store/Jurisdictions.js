/*jslint browser: true, undef: true *//*global Ext*/
// TODO: change this file name to StandardDocuments and also needs further development- bc
Ext.define('SparkRepositoryManager.store.Jurisdictions', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'SparkRepositoryManager.model.StandardDocument'
    ],

    model: 'SparkRepositoryManager.model.StandardDocument',

    listeners: {
        load: function(store, records, successful, operation, node, eOpts){
            var i = 0;

            if (node.id !== 'root') {
                children = records[0].get('standardSets');
                for (i; i<children.length; i++) {
                    node.appendChild(Ext.apply(children[i],{leaf: true}),true);
                }
            }
        }
    }

});
