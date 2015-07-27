/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.view.work.conference.peer.Component', {
    extend: 'Ext.Component',
    xtype: 'spark-work-conference-peer-component',

    config: {
        html: [
            '<h5>Restate the Learn target in your own words</h5>',
            '<span>Active text field with green line belowe. </span> <br><br>',
            
            '<h5>Describe the steps used to show understanding of the skill</h5>',
            'This is how I would describe the skill.',
            
            '<h5>Cite 3 real world examples of the learning target</h5>',
            '<ol>',
                '<li>Real world example</li>',
                '<li>Real world example</li>',
                '<li>Real world example</li>',
            '</ol>',
            '<hr>',
            
            '<h4>Peer Conference:</h4> (optional)',
            '<span>Peer: Peer Name</span>',
            '<span> Feedback from Peer: Student\'s restatement</span>'
        ].join('')
    }
});