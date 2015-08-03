/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('SparkClassroomTeacher.store.assign.Learn', {
    extend: 'Ext.data.Store',
    config: {
        fields: ['Standards', 'Grade', 'Title', 'Link', 'DOK', 'Category', 'SRating', 'TRating',  'Assign', 'Vendor', 'Issue'],


        data: [
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Assign: 1, Grade: 9, Standards: ['4.LA.M.B','5.ZA.U.B'], Vendor: 'Youtube', Issue: true},
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Article', SRating: 3, TRating: 3, Assign: 2, Grade: 12, Standards: ['4.LA.M.B','5.ZA.U.B'], Vendor: 'PBS', Issue: false},
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Assign: 4, Grade: 11, Standards: ['4.LA.M.B','5.ZA.U.B'], Vendor: 'Illuminate', Issue: false},
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'IEPFriendly', SRating: 3, TRating: 3, Assign: 1, Attachment: 'google.com', Grade: 11, Standards: ['4.LA.M.B','5.ZA.U.B'], Vendor: 'Reading', Issue: true},
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Assign: 3, Grade: 9, Standards: ['4.LA.M.B'], Vendor: 'Youtube', Issue: true},
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Practice Problems', SRating: 3, TRating: 3, Assign: 1, Attachment: 'doc.com', Grade: 10, Standards: ['4.LA.M.B','5.ZA.U.B'], Vendor: 'PBS', Issue: false},
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Assign: 2, Grade: 9, Standards: ['4.LA.M.B','5.ZA.U.B'], Vendor: 'Brainpop', Issue: false},
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Reading', SRating: 3, TRating: 3, Assign: 1, Grade: 10, Standards: ['4.LA.M.B','5.ZA.U.B'], Vendor: 'Youtube', Issue: false},
            {Title: 'Learn Title', Link: 'http://pbs.com/videos/science', DOK: 3, Category: 'Video', SRating: 3, TRating: 3, Assign: 3, Attachment: 'link.com', Grade: 9, Standards: ['5.ZA.U.B'], Vendor: 'Youtube', Issue: false}
        ]
    }
});