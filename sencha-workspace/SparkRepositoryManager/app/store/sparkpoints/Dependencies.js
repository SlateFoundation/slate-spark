/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkRepositoryManager.store.sparkpoints.Dependencies', {
    extend: 'Ext.data.TreeStore',
    storeId: 'sparkpoints.Dependencies',

    model: 'SparkRepositoryManager.model.Sparkpoint',

    root: {
        expanded: true,
        children: [
            {code: 'K.CC.4a', leaf: true },
            {
                code: 'K.CC.4b',
                Description: 'This is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b; this is some long description of K.CC.4b',
                children: [
                    { code: 'K.CC.1a', leaf: true },
                    { code: 'K.CC.1b', leaf: true },
                    { code: 'K.CC.2b', leaf: true },
                    { code: 'K.CC.3b', leaf: true }
                ]
            },
            { code: 'K.CC.4c', leaf: true },
            {
                code: 'K.CC.4d',
                children: [
                    { code: 'K.CC.1c', leaf: true },
                    { code: 'K.CC.1d', leaf: true }
                ]
            }
        ]
    }
});
