Ext.define('Spark2Manager.overrides.AbstractAPI', {
    override: 'Jarvus.util.AbstractAPI',

    requires: [
        'Ext.Ajax',
        'Ext.Array'
    ],

    /**
     * Override {@link Jarvus.util.AbstractAPI#method-request} to implement auto-decoding and retry handler
     * @inheritdoc
     */
    request: function(options) {
        var me = this;
        
        return Ext.Ajax.request(Ext.applyIf({
            url: me.buildUrl(options.url),
            withCredentials: true,
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

                if (options.failure && options.failureStatusCodes && Ext.Array.contains(options.failureStatusCodes, response.status)) {
                    Ext.callback(options.failure, options.scope, [response]);
                } else if (options.exception) {
                    Ext.callback(options.exception, options.scope, [response]);
                } else if (response.aborted === true) {
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
                                var loginWindow = window.open('/login', 'emergence-login');
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
                } else {
                    Ext.Msg.confirm('An error occurred', 'There was an error trying to reach the server. Do you want to try again?', function (btn) {
                        if (btn === 'yes') {
                            me.request(options);
                        }
                    });
                }

            },
            scope: options.scope
        }, options));
    }
});
