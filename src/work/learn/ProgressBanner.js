/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.ProgressBanner', {
    extend: 'Ext.Component',
    xtype: 'spark-work-learn-progressbanner',
    cls: 'spark-learn-progressbanner',

    config: {
        data: {
            completedLearns: 3,
            requiredLearns: 5,
        },

        tpl: [
            '<ul class="progressbanner-pips">',
                '<tpl for="this.pips(completedLearns, requiredLearns)">',
                    '<li class="progressbanner-pip {.}"></li>',
                '</tpl>',
            '</ul>',
            'You’ve completed <strong>{completedLearns}/{requiredLearns}</strong> of the required learns.',

            {
                pips: function(complete, required) {
                    var pips = [];

                    for (var i = 0; i < required; i++) {
                        var pip = (i < complete) ? 'is-complete' : 'is-incomplete';
                        pips.push(pip);
                    }

                    return pips;
                }
            }
        ]
    }
});