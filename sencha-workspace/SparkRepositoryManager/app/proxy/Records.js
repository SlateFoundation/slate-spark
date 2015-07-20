/*jslint browser: true, undef: true *//*global Ext*/
/**
 * This class is meant to allow customization of Emergence.proxy.Records specific to
 * the SparkRepositoryManager application.
 *
 * It was created to reflect changes that had been made directly on Emergence.proxy.Records but may not
 * be compatible with other applications using Emergence.proxy.Records
 *
 * TODO: review the changes that were made to Emergence.proxy.Records.  If they improve the class without
 * the risk of breaking compatibility, they should be moved to the jarvus-emergence-apikit package.  If they may
 * break compatibility then they should be left in this class or possibly moved to the classes that use this proxy
 * and added as a config attribute (eg. filterParam)
 *
 * NOTE: the encodeFilters() function was removed in the changes made to Emergence.proxy.Records, but it shouldn't
 * be an issue for the application if using an override of Emergence.proxy.Records retores it
 *
 */
Ext.define('SparkRepositoryManager.proxy.Records', {
    extend: 'Emergence.proxy.Records',
    alias: 'proxy.spark-records',

    /*
     * This config parameter was removed in the changes made to Emergence.proxy.Records, making it default
     * to 'filter', which is the Ext.data.proxy.Server default.
     */
    filterParam: 'filter', //overrides Emergence.proxy.Records default of 'q'

    /*
     * this function was modified in the changes made to Emergence.proxy.Records, adding
     * filter logic
     */
    getParams: function(operation) {
        var me = this,
            include = me.getInclude(),
            relatedTable = me.getRelatedTable(),
            summary = me.getSummary(),
            idParam = me.idParam,
            id = (typeof operation.getId == 'function' ? operation.getId() : operation.id),
            params = me.callParent(arguments),
            filters = operation.getFilters ? operation.getFilters() : null;

        if (filters) {
            delete params.filter;

            params.q = filters.map(function(filter) {
                return filter.getProperty() + ':' + filter.getValue();
            }).join( ' ');
        }

        if (id && idParam != 'ID') {
            params[idParam] = id;
        }

        if (include) {
            params.include = Ext.isArray(include) ? include.join(',') : include;
        }

        if (relatedTable) {
            params.relatedTable = Ext.isArray(relatedTable) ? relatedTable.join(',') : relatedTable;
        }

        if (summary) {
            params.summary = 'true';
        }

        return params;
    }

});
