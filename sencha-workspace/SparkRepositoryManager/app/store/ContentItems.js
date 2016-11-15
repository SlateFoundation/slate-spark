Ext.define('SparkRepositoryManager.store.ContentItems', {
    extend: 'Ext.data.Store',

    requires: [
        'SparkRepositoryManager.model.ContentItem'
    ],

    model: 'SparkRepositoryManager.model.ContentItem',

    groupField: 'sparkpointGroup',

    proxy: {
        // TODO: this proxy is a dev workaround to contact a different API host
        type: 'sandbox-school',
        url: '/spark/api/work/resources',
        reader: {
            type: 'json'
        }
    },

/*
    listeners: {
        'load': function(store, records) {
            if (store.count()>0 && store.lastOptions && store.lastOptions.params && store.lastOptions.params.sparkpoint_ids) {
                this.setGroupFieldValue(records, store.lastOptions.params.sparkpoint_ids.split(','));
            }
        }
    },

    setGroupFieldValue: function(records, sparkpointIds) {
        var recordsLength = records.length,
            sparkpointIdsLength = sparkpointIds.length,
            sparkpointId,
            sparkpointIndex,
            recordSparkpointIds,
            rec,
            newRec,
            i = 0,
            r;

        for (; i < sparkpointIdsLength; i++) {
            sparkpointId = sparkpointIds[i];

            for (r=0; r < recordsLength; r++) {
                rec = records[r];

                recordSparkpointIds = records[r].get('sparkpoint_ids');
                sparkpointIndex = recordSparkpointIds.indexOf(sparkpointId);

                if (sparkpointIndex >= 0) {
                    if (rec.get('sparkpointGroup')) {
                        newRec = rec.copy(null);
                        newRec.set('sparkpointGroup', rec.get('sparkpoints')[sparkpointIndex]);
                        this.add(newRec);
                    } else {
                        rec.set('sparkpointGroup', rec.get('sparkpoints')[sparkpointIndex]);
                    }
                }
            }
        }
    }
*/

});
