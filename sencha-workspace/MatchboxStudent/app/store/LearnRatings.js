/**
 * This store contains the learn items for rating by student on Assess page
 */
Ext.define('MatchbookStudent.store.LearnRatings', {
    extend: 'Ext.data.Store',
    storeId: 'LearnRatings',

    fields: [
        { name: 'Title', type: 'string' },
        { name: 'Url', type: 'string' },
        { name: 'Rating', type: 'int' },
        { name: 'Comments', type: 'string' }
    ],

    data: [{
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Rating: 3,
        Comments: ''
    },{
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Rating: 3,
        Comments: ''
    },{
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Rating: 3,
        Comments: ''
    },{
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Rating: 3,
        Comments: ''
    },{
        Title: 'Learn Title',
        Url: 'https://youtu.be/ubVc2MQwMkg',
        Rating: 3,
        Comments: ''
    }]

});
