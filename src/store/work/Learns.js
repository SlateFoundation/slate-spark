/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroom.store.work.Learns', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.API'
    ],

    model: 'SparkClassroom.model.work.Learn',

    config: {
        autoSync: true,
        trackRemoved: false,

        grouper: {
            groupFn: function(r) {
                var assignments = r.get('assignments');

                switch (assignments.student || assignments.section) {
                    case 'required-first':
                        return 'Start Here';
                    case 'required':
                        return 'Required';
                    case 'recommended':
                        return 'Recommended';
                    default:
                        return 'More Learns';
                }
            },
            sorterFn: function(r1, r2) {
                var assignments1 = r1.get('assignments'),
                    assignments2 = r2.get('assignments'),
                    effective1 = assignments1.student || assignments1.section,
                    effective2 = assignments2.student || assignments2.section;

                if (effective1 == effective2) {
                    return 0;
                }

                if (effective1 == 'required-first') {
                    return -1;
                } else if (effective2 == 'required-first') {
                    return 1;
                }

                if (effective1 == 'required') {
                    return -1;
                } else if (effective2 == 'required') {
                    return 1;
                }

                if (effective1 == 'recommended') {
                    return -1;
                } else if (effective2 == 'recommended') {
                    return 1;
                }
            }
        },

        filters: [{
            filterFn: function(r) {
                var assignments = r.get('assignments');
                return (assignments.student || assignments.section) != 'hidden';
            }
        }],

        proxy: {
            type: 'slate-api',
            url: '/spark/api/work/learns'
        }
    }
});