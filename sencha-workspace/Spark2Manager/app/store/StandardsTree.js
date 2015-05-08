Ext.define('Spark2Manager.store.StandardsTree', {
    extend: 'Ext.data.TreeStore',
    config: {
        proxy: {
            type: 'ajax',
            url: '/spark2/tree.json',
            reader: {
                type: 'json'
            }
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
                selectedStandards[standard.standardCode] = true;
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
    }
});
