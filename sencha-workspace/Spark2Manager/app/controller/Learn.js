Ext.define('Spark2Manager.controller.Learn', {
    requires: [
        'Spark2Manager.store.LearnLinks',
        'Spark2Manager.store.Vendors',
        'Spark2Manager.store.VendorDomains',
        'Spark2Manager.store.StandardCodes',
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
            },
            's2m-learn-panel tagfield': {
                change: function(editor, newStandards, oldStandards) {
                    return true;
                }
            }
        }
    },

    stores: [
        'Vendors',
        'VendorDomains',
        'LearnLinks',
        'StandardCodes'
    ],

    /**
     * Called when the view is created
     */
    init: function() {

    },

    onPanelActivate: function() {
        this.getVendorsStore().load();
        this.getVendorDomainsStore().load();
        this.getLearnLinksStore().load();
        this.getStandardCodesStore().load();
    },

    onEdit: function(editor, e) {
        var panel = this.getPanel(),
            plugin = panel.getPlugin('cellediting'),
            self = this;

        if(e.column.text === 'Standard') {
            console.log(e.value.join(', '));
            //e.record.set('code', e.value.join(', '));
        }

        switch(e.column.dataIndex) {
            case 'URL':
                console.log(e.value);

                var parsedURL = Spark2Manager.Util.parseURL(e.value),
                    // TODO: we can make a better pattern here for findRecord
                    hostname = parsedURL ? parsedURL.hostname.replace('www.', '') : null;

                // Automatically select the vendor from the dropdown
                if (hostname) {
                    var vendorDomain = this.getVendorDomainsStore().findRecord('Domain', hostname);
                    // TODO: How do we query by ContextClass = Spark2\LearnLink at the same time
                    if (vendorDomain) {
                        e.record.set('VendorID', vendorDomain.data.VendorID);
                    }

                    // Client-side title only
                    Ext.Ajax.request({
                        method: 'get',

                        url: '/spark2/proxy.php',

                        params: {
                            csurl: e.value
                        },

                        success: function(response) {
                            var html = document.createElement('div'),
                                titles,
                                title,
                                vendor = (vendorDomain && vendorDomain.data) ? self.getVendorsStore().findRecord('ID', vendorDomain.data.VendorID) : null;

                            html.innerHTML = response.responseText;
                            titles = html.querySelectorAll('title');

                            if (titles && titles.length >= 1) {
                                title = Spark2Manager.Util.truncateTitle(titles[0].textContent, vendor, hostname);
                                e.record.set('Title', title);
                                plugin.startEdit(e.record, 2);
                            }
                        }
                    });


                }
        }
    },

    onCreateLinkClick: function() {
        var newLink = this.getLearnLinksStore().insert(0, {}),
            p = this.getPanel(),
            plugin = p.getPlugin('cellediting');

        plugin.startEdit(newLink[0], 0);
    }
});
