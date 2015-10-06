Ext.define('SparkRepositoryManager.store.StandardsTree', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'Jarvus.proxy.API'
    ],


    config: {
        proxy: {
            type: 'api',
            url: 'https://api.matchbooklearning.com/postgrest/legacy_standards_tree'
        },

        parentIdProperty: 'parentId',
        nodeParam: null,

        fields: [
            'id',
            'parentId',
            'name',
            'grades',
            'standardCode'
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
                selectedStandards[standard] = true;
            });
        }

        root.visitPreOrder('', function (child) {
            var checked;

            if (typeof child.get('checked') == 'boolean') {
                checked = selectedStandards[child.getId()] || false;

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
                        standardCodes.push({
                            id: child.getId(),
                            code: standardCode
                        });
                        child.set('checked', false);
                    }
                });

                Ext.getStore('StandardCodes').loadData(standardCodes);
            }
        }
    }
});
