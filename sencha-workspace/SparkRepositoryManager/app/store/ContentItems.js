Ext.define('SparkRepositoryManager.store.ContentItems', {
    extend: 'Ext.data.Store',
    requires: [
        'SparkRepositoryManager.model.ContentItem',
        'SparkRepositoryManager.proxy.SandboxSchool'
    ],


    model: 'SparkRepositoryManager.model.ContentItem',

    // groupField: 'sparkpointGroup',

    proxy: {
        // TODO: this proxy is a dev workaround to contact a different API host
        type: 'sandbox-school',
        url: '/spark/api/work/resources',
        reader: {
            type: 'json'
        }
    },

    listeners: {
        'beforeload': function(store) {
            // This data does not have identifying Ids so we must clear the data manually
            store.data.clear();
        },
        'load': function(store, records) {
            var me = this;

            // Get the list of requested sparkpoint IDs from url params so items can be grouped by sparkpoint
            if (store.count() > 0 && store.lastOptions && store.lastOptions.params && store.lastOptions.params.sparkpoint_ids) {
                this.setGroupFieldValue(records, store.lastOptions.params.sparkpoint_ids.split(','));
            }

            me.fireEvent('loadcomplete', me);
        }
    },

    setGroupFieldValue: function(records, sparkpointIds) {
        var me = this,
            recordsLength = records.length,
            sparkpointIdsLength = sparkpointIds.length,
            sparkpointId,
            sparkpointIndex,
            recordSparkpointIds,
            rec,
            newRec,
            newRecs = [],
            i = 0,
            r;

        for (; i < sparkpointIdsLength; i++) {
            sparkpointId = sparkpointIds[i];

            for (r = 0; r < recordsLength; r++) {
                rec = records[r];

                recordSparkpointIds = records[r].get('sparkpoint_ids');
                sparkpointIndex = recordSparkpointIds.indexOf(sparkpointId);

                if (sparkpointIndex >= 0) {
                    if (rec.get('sparkpointGroup')) {
                        newRec = rec.copy(null);
                        newRec.set('sparkpointGroup', rec.get('sparkpoints')[sparkpointIndex]);
                        newRecs.push(newRec);
                    } else {
                        rec.set('sparkpointGroup', rec.get('sparkpoints')[sparkpointIndex]);
                    }
                }
            }
        }
        me.add(newRecs);
    }

});
