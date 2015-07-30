/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Dependents', {
    extend: 'Ext.data.TreeStore',
    storeId: 'sparkpoints.Dependents',

    requires: [
        'SparkRepositoryManager.model.Sparkpoint',
        'SparkRepositoryManager.proxy.Records' // TODO: assuming we will need this when store is real, delete if not
    ],

    model: 'SparkRepositoryManager.model.Sparkpoint',

    root: {
        expanded: true,
        children: [
            {Code: 'K.CC.4a', leaf: true },
            {
                Code: 'K.CC.4b',
                Description: 'This is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b',
                children: [
                    { Code: 'K.CC.1a', leaf: true },
                    { Code: 'K.CC.1b', leaf: true },
                    { Code: 'K.CC.2b', leaf: true },
                    { Code: 'K.CC.3b', leaf: true }
                ]
            },
            { Code: 'K.CC.4c', leaf: true },
            {
                Code: 'K.CC.4d',
                children: [
                    { Code: 'K.CC.1c', leaf: true },
                    { Code: 'K.CC.1d', leaf: true }
                ]
            }
        ]
    }

/*
    // TODO: make this store real
    proxy: {
        type: 'spark-records',
        url: '/sparkpoints/dependents'
    }
*/
});
