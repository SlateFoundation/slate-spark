Ext.define('SparkClassroom.model.work.Lesson', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.API'
    ],


    idProperty: 'id',

    getGroupData: function(id) {
        var me = this,
            groups = me.get('learn_groups'),
            group, i;

        for (i = 0; i < groups.length; i++) {
            group = groups[i];

            if (group.id === id) {
                return group;
            }
        }

        return null;
    },

    proxy: {
        type: 'slate-api',
        url: '/spark/api/work/modules'
    }
});