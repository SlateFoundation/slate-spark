Ext.define('SparkClassroomTeacher.view.assign.Popup', {
    extend: 'Ext.Panel',
    xtype: 'spark-teacher-assign-popup',
    requires: [
        'Jarvus.plugin.GridFlex',
        'SparkClassroom.column.AssignMulti'
    ],

    manageBorders: false, // manageBorders adds a class that leaks down to the grid and hides the bottom border on its header

    config: {
        cls: 'spark-teacher-assign-popup',
        floating: true,
        items: [
            {
                xtype: 'grid',
                titleBar: null,
                height: 400,
                width: 560,
                margin: 0,
                store: 'assign.Learn',
                plugins: [
                    'gridflex'
                ],
                columns: [
                    {
                        // TODO hide trigger using showTrigger: false, once that config works
                        dataIndex: 'SRating',
                        xtype: 'spark-assign-column-multi'
                    },
                    {
                        dataIndex: 'Title',
                        text: 'Name',
                        flex: 1
                    },
                    {
                        dataIndex: 'Standards',
                        text: 'Current Standard',
                        flex: 1
                    }
                ]
            }
        ]
    }
});