/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.apply.Tasks', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['Completed', 'Title', 'DueDate', 'Assign', 'CreatedBy', 'DOK'],


        data: [
            {Title: 'Second task that needs to be done for this Apply', DueDate: 'Tomorrow'},
            {Title: 'Third task that needs to be done for this Appl'},
            {Title: 'Fourth task that need sot be done fore this Apply lorem ipset dolor sit amet, cosectetur adipsicing orem ipsum dolor sit amet, consectetur adipiscing', DueDate: 'Thursday, 3/5'},
            {Completed: true, Title: 'Firthe task that needs to be done for this apply', DueDate: 'Monday, 3/2'}
        ]
    }
});