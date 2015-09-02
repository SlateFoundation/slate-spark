/*jslint browser: true, undef: true*//*global Ext*/

/**
 * @abstract
 * An abstract class for singletons that facilitates communication with backend services
 * 
 * TODO:
 * - add events for all lifecycle events: beforerequest, request, beforexception, exception, unauthorized
 * - does the touch version use Ext.Ajax or parent.request?
 * - pass through request options like touch version does
 */
Ext.define('Jarvus.util.AbstractAPI', {
    extend: 'Ext.data.Connection',

    config: {
        /**
         * @cfg {String/null}
         * A host to prefix URLs with, or null to leave paths domain-relative
         */
        host: null,

        /**
         * @cfg {Boolean}
         * True to use HTTPS when prefixing host. Only used if {@link #cfg-host} is set
         */
        useSSL: false,

        /**
         * @cfg {String/null}
         * A path to prefix URLs with
         */
        pathPrefix: null,

        // @inheritdoc
        withCredentials: true,

        // @inheritdoc
        useDefaultXhrHeader: false,

        // @inheritdoc
        disableCaching: false
    },

    //@private
    buildUrl: function(path) {
        var me = this,
            host = me.getHost(),
            pathPrefix = me.getPathPrefix();

        if (pathPrefix) {
            path = pathPrefix + path;
        }

        if (host) {
            path = (me.getUseSSL() ? 'https://' : 'http://') + host + path;
        }

        return path;
    },

    //@private
    buildHeaders: function(headers) {
        return headers;
    },

    //@private
    buildParams: function(params) {
        return params || null;
    },

    /**
     * Override {@link Ext.data.Connection#method-request} to implement auto-decoding and retry handler
     * @inheritdoc
     */
    request: function(options) {
        var me = this;

        //the below 'hack' is in place for the '/sections/Geometry/students' call in SparkClassroomTeacher.store.Students
        options.withCredentials = true;
        
        return me.callParent([Ext.applyIf({
            url: me.buildUrl(options.url),
            params: me.buildParams(options.params),
            headers: me.buildHeaders(options.headers),
            timeout: options.timeout || 30000,
            success: function(response) {

                if (options.autoDecode !== false && response.getResponseHeader('Content-Type') == 'application/json') {
                    response.data = Ext.decode(response.responseText, true);
                }

                //Calling the callback function sending the decoded data
                Ext.callback(options.success, options.scope, [response]);

            },
            failure: function(response) {

                if (options.autoDecode !== false && response.getResponseHeader('Content-Type') == 'application/json') {
                    response.data = Ext.decode(response.responseText, true);
                }

                if (response.aborted === true) {
                    Ext.callback(options.abort, options.scope, [response]);
                } else if (response.status == 401 || response.statusText.indexOf('Unauthorized') !== -1) {

                    /*
                    We seem to always get the same session id, so we can't automatically try again once the user logs in
                    var oldSessionID = Ext.util.Cookies.get('s');
                     */

                    Ext.override(Ext.Msg, {
                        hide: function () {
                            var me = this,
                                hideManually = me.cfg ? me.cfg.hideManually : false;

                            if (!hideManually) {
                                me.callParent(arguments);
                            }
                        }
                    });

                    var msg = Ext.Msg.show({
                        hideManually: true,
                        title: 'Login Required',
                        msg: "You've either logged out or your has session expired. Please login and try again.",
                        buttonText: {
                            'yes': 'Login',
                            'no': 'Try Again',
                            'cancel': 'Cancel'
                        },
                        scope: msg,
                        fn: function (btn) {
                            if (btn === 'yes') {
                                // login
                                var loginWindow = window.open(me.buildUrl('/login'), 'emergence-login');
                                loginWindow.focus();
                                return;
                            } else if (btn === 'no') {
                                // try again
                                me.request(options);
                            }

                            msg.cfg.hideManually = false;
                            msg.hide();
                        }
                    });

                    /*
                    if (oldSessionID !== null) {
                        var cookieCheckInterval = window.setInterval(function() {
                            console.log(oldSessionID);
                            console.warn(Ext.util.Cookies.get('s'));
                            if (Ext.util.Cookies.get('s') != oldSessionID) {
                                alert('new login');
                                debugger;
                                window.clearInterval(cookieCheckInterval);
                            }
                        }, 100);
                    }
                    */
                } else if(response.status == 0) {
                    Ext.Msg.confirm('An error occurred', 'There was an error trying to reach the server. Do you want to try again?', function (btn) {
                        if (btn === 'yes') {
                            me.request(options);
                        }
                    });
                } else {
                    Ext.callback(options.failure, options.scope, [response]);
                }

            },
            scope: options.scope
        }, options)]);
    },

    // @deprecated
    setHostname: function(hostname) {
        //<debug>
        Ext.Logger.deprecate('hostname config is deprecated, use host instead');
        //</debug>

        this.setHost(hostname);
    },

    // @deprecated
    getHostname: function() {
        //<debug>
        Ext.Logger.deprecate('hostname config is deprecated, use host instead');
        //</debug>

        return this.getHost();
    }
});
