Ext.define('SparkRepositoryManager.store.StandardsTree', {
    requires: [
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json',
        'Ext.data.JsonStore',
        'Ext.data.proxy.Memory'
    ],

    extend: 'Ext.data.TreeStore',

    config: {
        proxy: {
            type: 'ajax',
            url: 'data/tree.json',
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

    restoreState: function (standards) {
        var root = this.getRoot(),
            selectedStandards = {};

        if (Array.isArray(standards)) {
            standards.forEach(function (standard) {
                selectedStandards[standard.standardCode || standard] = true;
            });
        }

        root.visitPreOrder('', function (child) {
            var checked,
                standardCode = child.get('standardCode');

            if (standardCode && typeof child.get('checked') == 'boolean') {
                checked = selectedStandards[standardCode] || false;

                child.set('checked', checked);

                if (checked) {
                    child.parentNode.expand();
                }
            } else {
                /*
                 * TODO: this shouldn't be necessary.  Top level nodes are occasionally picking up a "checked"
                 * attribute.  This resets them, but would be better to find the source.
                 */
                child.set('checked', null);
            }
        });
    },

    listeners: {
        load: function(me, records, success, eOpts) {
            var standardCodes = [];

            if (success) {
                me.getRoot().visitPreOrder('', function (child) {
                    var standardCode = child.get('standardCode');

                    if (standardCode && child.get('leaf')) {
                        standardCodes.push({standardCode: standardCode});
                    }
                });

                Ext.getStore('StandardCodes').loadData(standardCodes);
            }
        }
    }
});
