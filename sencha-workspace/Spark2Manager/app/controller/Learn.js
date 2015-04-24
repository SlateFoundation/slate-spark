Ext.define('Spark2Manager.controller.Learn', {
    requires: [
        'Spark2Manager.store.LearnLink',
        'Spark2Manager.store.Vendor',
        'Spark2Manager.Util'
    ],
    extend: 'Ext.app.Controller',

    config: {
        refs: [{
            ref: 'panel',
            selector: 's2m-learn-panel'
        }],

        control: {
            's2m-learn-panel': {
                activate: 'onPanelActivate',
                edit: 'onEdit'
            },
            's2m-learn-panel button[action=create-link]': {
                click: 'onCreateLinkClick'
            }
        }
    },

    stores: [
        'LearnLink',
        'Vendor',
        'VendorDomain'
    ],

    /**
     * Called when the view is created
     */
    init: function() {
        debugger;
    },

    onPanelActivate: function() {
        this.getLearnLinkStore().load();
        this.getVendorStore().load();
        this.getVendorDomainStore().load();
    },

    onEdit: function(editor, e) {
        switch(e.column.dataIndex) {
            case 'URL':
                var parsedURL = Spark2Manager.Util.parseURL(e.value),
                    // TODO: we can make a better pattern here for findRecord
                    hostname = parsedURL ? parsedURL.hostname.replace('www.', '') : null;

                // Automatically select the vendor from the dropdown
                if (hostname) {
                    var vendorDomain = this.getVendorDomainStore().findRecord('Domain', hostname);
                    // TODO: How do we query by ContextClass = Spark2\LearnLink at the same time
                    if (vendorDomain) {
                        e.record.set('VendorID', vendorDomain.data.VendorID);
                    }
                }
        }
    },

    onCreateLinkClick: function() {
        var newLink = this.getLearnLinkStore().insert(0, {}),
            p = this.getPanel(),
            plugin = p.getPlugin('cellediting');

        plugin.startEdit(newLink[0], 0);
    }
});
