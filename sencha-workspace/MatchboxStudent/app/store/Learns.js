/**
 * This store contains the learn items
 */
Ext.define('MatchbookStudent.store.Learns', {
    extend: 'Ext.data.Store',
    storeId: 'Learns',

    fields: [
        { name: 'Completed', type: 'boolean', defaultValue: false },
        { name: 'Title', type: 'string' },
        { name: 'Url', type: 'string' },
        { name: 'Vendor', type: 'string' },
        { name: 'DOK', type: 'string' },
        { name: 'Category', type: 'string' },
        { name: 'Avg_Student_Rating', type: 'string' },
        { name: 'Avg_Teacher_Rating', type: 'string' },
        { name: 'Score', type: 'string' }
    ],

    data: [{
        Completed: true,
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Vendor: 'YouTube',
        DOK: 3,
        Category: 'Video',
        Avg_Student_Rating: 5,
        Avg_Teacher_Rating: 4,
        Score: 3
    },{
        Completed: false,
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Vendor: 'YouTube',
        DOK: 3,
        Category: 'Video',
        Avg_Student_Rating: 5,
        Avg_Teacher_Rating: 4,
        Score: 3
    },{
        Completed: false,
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Vendor: 'YouTube',
        DOK: 3,
        Category: 'Video',
        Avg_Student_Rating: 5,
        Avg_Teacher_Rating: 4,
        Score: 3
    },{
        Completed: false,
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Vendor: 'YouTube',
        DOK: 3,
        Category: 'Video',
        Avg_Student_Rating: 5,
        Avg_Teacher_Rating: 4,
        Score: 3
    },{
        Completed: false,
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Vendor: 'YouTube',
        DOK: 3,
        Category: 'Video',
        Avg_Student_Rating: 5,
        Avg_Teacher_Rating: 4,
        Score: 3
    },{
        Completed: false,
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Vendor: 'YouTube',
        DOK: 3,
        Category: 'Video',
        Avg_Student_Rating: 5,
        Avg_Teacher_Rating: 4,
        Score: 3
    },{
        Completed: false,
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Vendor: 'YouTube',
        DOK: 3,
        Category: 'Video',
        Avg_Student_Rating: 5,
        Avg_Teacher_Rating: 4,
        Score: 3
    }]

});
