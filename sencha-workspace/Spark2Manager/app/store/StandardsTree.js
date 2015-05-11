Ext.define('Spark2Manager.store.StandardsTree', {
    requires: ['Ext.data.ArrayStore'],

    extend: 'Ext.data.TreeStore',

    config: {
        proxy: {
            type: 'ajax',
            url: 'http://slate.ninja/spark2/tree.json',
            reader: {
                type: 'json'
            },
            noCache: false
        },

        parentIdProperty: 'parentId',

        fields: [
            'id',
            'parentId',
            'name',
            'gradeLevels',
            'standardCode',
            'altCode'
        ]
    },

    getChecked: function() {
        var root = this.getRoot(),
            checked = [];

        root.cascadeBy(function(rec){
            if (rec.get('checked')) {
                checked.push(rec);
            }
        });

        return checked;
    },

    restoreState: function (record) {
        var root = this.getRoot(),
            selectedStandards = {};

        if (record.get('Standards')) {
            record.get('Standards').forEach(function (standard) {
                selectedStandards[standard.standardCode || standard] = true;
            });
        }

        root.visitPreOrder('', function (child) {
            var checked;

            if (typeof child.get('standardCode') !== 'undefined') {
                checked = selectedStandards[child.get('standardCode')] || false;

                child.set('checked', checked);

                if (checked) {
                    child.parentNode.expand();
                }
            }
        });
    },

    listeners: {
        load: function(me, records, success, eOpts) {
            var standardCodes = [];

            if (success) {
                me.getRoot().visitPreOrder('', function (child) {
                    var standardCode = child.get('standardCode');

                    if (standardCode) {
                        standardCodes.push({standardCode: standardCode});
                    }
                });

                Ext.create('Ext.data.JsonStore', {
                    storeId  : 'StandardCodes',
                    data     : standardCodes,
                    idProperty: 'standardCode',
                    fields: ['standardCode'],
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    }
                });
            }
        }
    }
});
