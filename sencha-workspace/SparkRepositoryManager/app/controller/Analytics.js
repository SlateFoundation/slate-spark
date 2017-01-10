Ext.define('SparkRepositoryManager.controller.Analytics', {
    extend: 'Ext.app.Controller',


    control: {
        'spark-main': {
            tabchange: 'onMainTabChange'
        },
        'spark-standardpicker': {
            alignstandards: 'onAlignStandards'
        }
    },

    init: function() {
        if (!window.ga) {
            if (location.hostname == 'sparkpoint.matchbooklearning.com') {
                (function (i, s, o, g, r, a, m) {
                    i['GoogleAnalyticsObject'] = r;
                    i[r] = i[r] || function () {
                            (i[r].q = i[r].q || []).push(arguments)
                        }, i[r].l = 1 * new Date();
                    a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                    a.async = 1;
                    a.src = g;
                    m.parentNode.insertBefore(a, m)
                })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
            } else {
                window.ga = function() {
                    console.info('ga(%o)', arguments);
                };
            }
        }

        if (window.SiteEnvironment && SiteEnvironment.user && SiteEnvironment.user.Username) {
            ga('create', 'UA-63172269-1', { 'userId': SiteEnvironment.user.Username });
        } else {
            ga('create', 'UA-63172269-1', 'auto');
        }

        ga('send', 'pageview');

        Ext.Error.handle = function (err) {
            ga('send', 'exception', {
                'exDescription': err.msg,
                'exFatal':       true,
                'appName':       err.sourceClass,
                'appVersion':    err.sourceMethod
            });
        };
    },

    onMainTabChange: function(mainView, tab, oldTab) {
        ga('set', {
            page: '/#' + tab.getItemId(),
            title: tab.getTitle()
        });

        ga('send', 'pageview');
    },

    onAlignStandards: function(record, standards) {
        ga('send', 'event', 'standards', 'align', 'standard picker', standards.length);
    }
});