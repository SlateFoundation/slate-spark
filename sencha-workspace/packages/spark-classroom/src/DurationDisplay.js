/* global Slate Spark */
/**
 * Load the dynamically generated Spark.Timing Singleton class and provide utility method for calculating
 * and displaying phase duration
 */
Ext.define('SparkClassroom.DurationDisplay', {
    singleton: true,

    requires: [
        'Slate.API',
        'Jarvus.util.format.FuzzyTime'
    ],

    config: {
        timing: null,
        isLoading: false,
        error: null
    },

    constructor: function () {
        this.loadScript();
    },

    init: function (cb) {
        var me = this;

        if (me.isLoaded() || me.getError() !== null) {
            Ext.callback(cb);
        } else if (me.getIsLoading() === true) {
            Ext.defer(me.init, 200, me, [cb]);
        } else {
            me.loadScript();
            Ext.defer(me.init, 200, me, [cb]);
        }

    },

    loadScript: function () {
        var me = this;

        me.setIsLoading(true);

        Ext.Loader.loadScript({
            url: Slate.API.buildUrl('/spark/api/client/timing'),
            onLoad: function() {
                me.setTiming(Spark.Timing);
                me.setIsLoading(false);
            },
            onError: function(err) {
                me.setError(err);
                Ext.log({
                    level: 'warn',
                    msg: 'Could not load timing script'
                });
            }
        });
    },

    isLoaded: function() {
        return this.getTiming() !== null;
    },

    /**
     * Calculate the phase duration using the dynamically generated Spark.Timing Singleton class
     * @param {String} sectionCode the sectionCode used to calculate grade.
     * @param {Date} phaseStartTime The start of the phase.
     * @param {Boolean} inDays true to use the inDays version of the timing function. Defaults to true.
     * @param {Boolean} skipFuzzy true to not format the result using Jarvus.util.format.FuzzyTime. Defaults to false.
     * @return {String}
     */
    calculateDuration: function(sectionCode, activePhaseStartTime, inDays, skipFuzzy) {
        var me = this,
            timing = me.getTiming(),
            grade = timing.sectionCodeToGrade(sectionCode),
            duration = '--';

        // use 'days' function by default
        inDays = (inDays !== false);  // eslint-disable-line no-extra-parens

        // use fuzzy duration formatting by default
        skipFuzzy = (skipFuzzy === true); // eslint-disable-line no-extra-parens

        if (activePhaseStartTime instanceof Date) {
            if (inDays) {
                duration = timing.getDurationInDays(grade, activePhaseStartTime, new Date());
            } else {
                duration = timing.getDuration(grade, activePhaseStartTime, new Date());
            }

            if (!skipFuzzy) {
                if (inDays) {
                    duration = Ext.util.Format.fuzzyDuration(duration * 86400000, true);
                } else {
                    duration = Ext.util.Format.fuzzyDuration(duration, true);
                }
            }
        }
        return duration;
    }
});
