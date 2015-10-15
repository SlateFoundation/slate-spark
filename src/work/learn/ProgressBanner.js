/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.work.learn.ProgressBanner', {
    extend: 'Ext.Component',
    xtype: 'spark-work-learn-progressbanner',

    config: {
        cls: 'spark-learn-progressbanner',
        tpl: [
            '<ul class="progressbanner-pips">',
                '<tpl for="this.pips(completedLearns, requiredLearns)">',
                    '<li class="progressbanner-pip {.}"></li>',
                '</tpl>',
            '</ul>',
            '{[ this.getNameAndAuxVerb(values.name)]} completed <strong>{completedLearns}/{requiredLearns}</strong> of the required Learns.',

            {
                pips: function(complete, required) {
                    var pips = [],
                        i = 0;

                    for (; i < required; i++) {
                        pips.push(i < complete ? 'is-complete' : 'is-incomplete');
                    }

                    return pips;
                }
            },
            {
                getNameAndAuxVerb: function(name) {
                    name = name || 'You';
                    return name == 'You' ? 'You’ve' : name + ' has';
                }
            }
        ]
    }
});