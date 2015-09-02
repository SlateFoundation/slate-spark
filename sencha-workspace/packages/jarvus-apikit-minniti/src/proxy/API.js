/*jslint browser: true, undef: true *//*global Ext*/
/**
 * TODO:
 * - Just extend Server and deprecated the other stuff Ajax does? callParent for buildrequest?
 */
Ext.define('Jarvus.proxy.API', {
    extend: 'Ext.data.proxy.Server',
    alias: 'proxy.api',
    requires: [
        'Jarvus.util.API'
    ],

    config: {
        /**
         * @cfg The {Ext.data.Connection} instance that will process requests
         * @required
         */
        connection: 'Jarvus.util.API',

        /**
         * @cfg Whether simple remote filters should be written to params
         */
        writeFilterParams: true,

        headers: null,
        
        noCache: false,
        
        directionParam: false,
        filterParam: false,
        groupDirectionParam: false,
        groupParam: false,
        idParam: false,
        limitParam: false,
        pageParam: false,
        sortParam: false,
        startParam: false
    },

    /**
     * Automatically inject "connection" class into requires
     */
    onClassExtended: function(cls, data, hooks) {
        var connection = data.connection || data.config && data.config.connection,
            onBeforeClassCreated;

        if (typeof connection === 'string') {
            onBeforeClassCreated = hooks.onBeforeCreated;

            hooks.onBeforeCreated = function() {
                var me = this,
                    args = arguments;

                Ext.require(connection, function() {
                    onBeforeClassCreated.apply(me, args);
                });
            };
        }
    }, 

    /**
     * Convert "connection" class into constructor reference
     */
    applyConnection: function(connection) {
        if (typeof connection == 'string') {
            Ext.syncRequire(connection);
            connection = Ext.ClassManager.get(connection);
        }

        return connection;
    },

    getMethod: function(request) {
        switch (request.getAction()) {
            case 'create':
                return 'POST';
            case 'read':
                return 'GET';
            case 'update':
                return 'PATCH';
            case 'destroy':
                return 'DELETE';
        }
    },

    getParams: function(operation) {
        var me = this,
            params = me.callParent(arguments);

        if (me.getWriteFilterParams()) {
            Ext.apply(params, me.getFilterParams(operation));
        }

        return params;
    },

    getFilterParams: function(operation) {
        var action = operation.getAction(),
            isRead = action == 'read',

            filters = isRead && operation.getFilters(),
            filtersLength = (filters && filters.length) || 0,
            filterIndex = 0,
            filter,

            params = {};

        // write filters
        for (; filterIndex < filtersLength; filterIndex++) {
            filter = filters[filterIndex];

            if (filter.getOperator()) {
                Ext.Error.raise('Filter operators are not currently supported on the sparkpoints proxy');
            }

            params[filter.getProperty()] = filter.getValue();
        }

        return params;
    },

    buildRequest: function(operation) {
        var me = this,
            request = me.callParent(arguments),
            params = request.getParams(),
            idParam = me.getIdParam();

        if (!idParam && idParam in params) {
            delete params[idParam];
        }

        request.setMethod(me.getMethod(request));
        request.setHeaders(me.getHeaders(request));
        request.setTimeout(me.getTimeout(request));

        return request;
    },

    doRequest: function(operation) {
        var me = this,
            writer = me.getWriter(),
            request = me.buildRequest(operation);;

        if (writer && operation.allowWrite()) {
            request = writer.write(request);
        }

        request.setCallback(function(options, success, response) {
            if (request === me.lastRequest) {
                me.lastRequest = null;
            }

            me.processResponse(success, operation, request, response);
        });

        return me.sendRequest(request);
    },

    sendRequest: function(request) {
        var me = this;

        request.setRawRequest(me.getConnection().request(Ext.applyIf({
            autoDecode: false,
            failureStatusCodes: [404] // TODO: verify this results in the proper failure method being called in the proxy
        }, request.getCurrentConfig())));

        me.lastRequest = request;

        return request;
    },

    abortLastRequest: function(silent) {
        var lastRequest = this.lastRequest;

        if(lastRequest) {
            lastRequest.options.silenceException = !!silent;
            Ext.Ajax.abort(lastRequest);
        }
    },

    destroy: function() {
        this.lastRequest = null;
        
        this.callParent();
    }
});
