/* global Slate */
/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/

/**
 * TODO: move to own package and use `connection` config and abstract+singleton pattern like proxies do
 */
Ext.define('SparkClassroom.Socket', {
    singleton: true,
    mixins: ['Ext.mixin.Observable'],
    requires: [
        'Slate.API'
    ],


    config: {
        ioSocket: null,
        schema: null,

        hostSchemas: {
            'sandbox-school.matchbooklearning.com': 'sandbox-school',
            'staging.spark.mta.matchbooklearning.com': 'mta-staging',
            'staging.spark.merit.matchbooklearning.com': 'merit-staging',
            'spark.mta.matchbooklearning.com': 'mta-live',
            'spark.merit.matchbooklearning.com': 'merit-live',
        },

        supressAlert: false,
        debug: false,
        disableLoad: false,
        collapsedData: false,
        outputData: false,
        connectionDebug: false
    },



    /**
     * @event data
     * Fires when any database data is received
     * @param {SparkClassroom.Socket} socket The singleton Socket wrapper
     * @param {Object} data The received data
     */

    /**
     * @event connect
     * Fires upon connecting to the server
     * @param {SparkClassroom.Socket} socket The singleton Socket wrapper
     */

    /**
     * @event error
     * Fires upon an socket.io error
     * @param {SparkClassroom.Socket} socket The singleton Socket wrapper
     * @param {String} error The error message
     */

    /**
     * @event debug
     * Fires upon an debug message being recieved from the server
     * @param {SparkClassroom.Socket} socket The singleton Socket wrapper
     * @param {String/Object} data The received data
     */

    /**
     * @event disconnect
     * Fires upon a disconnection
     * @param {SparkClassroom.Socket} socket The singleton Socket wrapper
     */

    /**
     * @event reconnect
     * Fires upon a successful reconnection
     * @param {SparkClassroom.Socket} socket The singleton Socket wrapper
     */


    constructor: function(config) {
        var me = this;

        me.mixins.observable.constructor.call(me, config);

        Ext.Function.interceptBefore(window, 'onbeforeunload', function() {
            var ioSocket = me.getIoSocket();

            if (ioSocket) {
                ioSocket.disconnect();
            }
        });

        me.loadSocketIo();
    },

    loadSocketIo: function(src) {
        var me = this;

        Ext.Loader.loadScript({
            url: Slate.API.buildUrl(src || '/socket.io/socket.io.js'),
            onLoad: function() {
                me.setIoSocket(new window.io(Slate.API.buildUrl('/')));
            }
        });
    },

    updateHostSchemas: function(hostSchemas) {
        this.setSchema(hostSchemas[Slate.API.getHost()] || null);
    },

    updateIoSocket: function(ioSocket, oldIoSocket) {
        var me = this,
            schema = me.getSchema();


        if (oldIoSocket) {
            oldIoSocket.disconnect();
        }


        if (ioSocket) {
            ioSocket.on('db', function (data) {
                if (data.schema != schema) {
                    return;
                }

                if (me.getOutputData()) {
                    console[me.getCollapsedData() ? 'groupCollapsed' : 'group'](data.schema + '.' + data.table + '.' + data.pk);
                    console.table([data.item], Object.keys(data.item));
                    console.groupEnd();
                }

                me.fireEvent('data', me, data);
            });

            ioSocket.on('debug', function (data) {
                if (me.getDebug()) {
                    console.info('[DEBUG]', data);
                }

                me.fireEvent('debug', me, data);
            });

            ioSocket.on('load', function (data) {
                if (!data.src) {
                    console.warn('Invalid load event received from the server');
                    console.warn(data);
                    return;
                }

                console.info('[DEBUG] Loading JavaScript from: ' + data.src + ' due to a load request send from the server.');

                if (data.unload) {
                    if (me.getDebug()) {
                        console.info('[DEBUG] Unloding socket.io due to a load request sent from the server, this is likely a real-time code swap.');
                    }

                    me.setIoSocket(null);
                }

                me.loadSocketIo();
            });

            ioSocket.on('alert', function (msg) {
                if (!me.getSuppressAlert()) {
                    window.alert(msg);
                }
            });

            // Connection handling related
            ioSocket.on('connect', function() {
                me.getConnectionDebug() && console.info('[SOCKET.IO] connected');
                me.fireEvent('connect', me);
            });

            ioSocket.on('error', function(error) {
                me.getConnectionDebug() && console.error('[SOCKET.IO] ' + error);
                me.fireEvent('error', me, error);
            });

            ioSocket.on('disconnect', function() {
                me.getConnectionDebug() && console.warn('[SOCKET.IO] disconnected');
                me.fireEvent('disconnect', me);
            });

            ioSocket.on('reconnect', function() {
                me.getConnectionDebug() && console.info('[SOCKET.IO] reconnected');
                me.fireEvent('reconnect', me);
            });

            ioSocket.on('reconnect_attempt', function(num) {
                me.getConnectionDebug() && console.info('[SOCKET.IO] attempting to reconnect, attempt #' + num);
            });

            ioSocket.on('reconnect_error', function(error) {
                me.getConnectionDebug() && console.error('[SOCKET.IO] failed to reconnect: ' + error);
            });

            ioSocket.on('reconnect_failed', function (error) {
                me.getConnectionDebug() && console.error('[SOCKET.IO] max retries exceeded, giving up on reconnecting...');
            });
        }
    },

    emit: function(event, data) {
        this.getIoSocket().emit(event, data);
    }
});