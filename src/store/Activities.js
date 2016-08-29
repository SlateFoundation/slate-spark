/* global Ext */
Ext.define('SparkClassroom.store.Activities', {
    extend: 'Ext.data.Store',
	model: 'SparkClassroom.model.StudentSparkpoint',
	proxy: {
		type: 'slate-api',
		url: '/spark/api/work/activity',
		batchActions: false,
		extraParams: {
			status: 'all'
		},
		writer: {
			type: 'json',
			allowSingle: true
		},
		reader: {
			type: 'json',
			transform: {
				fn: function(rawData) {
					// These pace_target overrides are needed because calculate does not allow circular referencing.
					// Also, convert prevents calling set on the field for the record.
					var count, data;

					for (count = 0; count < rawData.length; count++) {
						data = rawData[count];

						if (Ext.isEmpty(data.learn_pace_target)) {
							data.learn_pace_target = 1;
						}

						if (Ext.isEmpty(data.conference_pace_target)) {
							data.conference_pace_target = 2;
						}

						if (Ext.isEmpty(data.apply_pace_target)) {
							data.apply_pace_target = 4;
						}

						if (Ext.isEmpty(data.assess_pace_target)) {
							data.assess_pace_target = 5;
						}
					}

					return rawData;
				}
			}
		}
	}
});