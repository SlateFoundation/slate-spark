/* global Slate Spark */
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

    calculateDuration: function(sectionCode, activePhaseStartTime) {
        var me = this,
            timing = me.getTiming(),
            grade = timing.sectionCodeToGrade(sectionCode),
            duration = '--';

        if (activePhaseStartTime instanceof Date) {
            duration = Ext.util.Format.fuzzyDuration(
                timing.getDuration(grade, activePhaseStartTime, new Date()),
                true
            );
        }
        return duration;
    }
});
