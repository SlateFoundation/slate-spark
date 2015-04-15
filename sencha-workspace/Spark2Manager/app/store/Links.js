/**
 * Created by jmealo on 4/14/15.
 */
Ext.define('Spark2Manager.store.Links', {
    requires: [
        'Spark2Manager.model.Links'
    ],

    extend: 'Ext.data.Store',

    model: 'Spark2Manager.model.Link',

    autoSync: true
});
