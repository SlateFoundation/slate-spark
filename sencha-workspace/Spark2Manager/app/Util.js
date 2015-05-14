Ext.define('Spark2Manager.Util', {
    'singleton': true,

    'requires': [
        'Ext.Ajax',
        'Ext.Object',
        'Spark2Manager.model.Vendor',
        'Spark2Manager.model.VendorDomain'
    ],

    parseURL: function(url) {
        var returnVal = {};

        try {
            returnVal = new URL(url);
            returnVal.params = Ext.Object.fromQueryString(returnVal.search);
            delete returnVal.search;
        } catch (e) {
            return null;
        }

        return returnVal;
    },

    titleTruncators: {
        'learnzillion.com': function(title) {
            return title.replace('- for students', '').trim();
        }
    },

    truncateTitle: function(title, vendor, hostname) {
        var pattern = '',
            reRight,
            reLeft,
            customFn = this.titleTruncators[hostname];

        if (vendor && vendor.data) {
            pattern = vendor.data.Name.replace(/\s/, '').split('').join('\\s*');
        }

        if (hostname) {
            hostname = hostname.split('.').slice(0, -1).join('').split('');
            pattern += (pattern ? '|' : '') + hostname.join('\\s*');
        }

        reRight = new RegExp('\\s(.{0,2})' + pattern, 'i');
        reLeft = new RegExp(pattern + '.{0,2}\\s*', 'i');

        title = title.replace(reRight, '').replace(reLeft, '');

        // Trim remaining delimiters from left and right
        title = title.replace(/^\s?\W\s?|\s?\W\s?$/gm, '')

        return (typeof customFn === 'function') ? customFn(title) : title;
    },

    guessNameFromTitle: function guessNameFromTitle(title, hostname) {
        title = title || document.querySelectorAll('title')[0].textContent;
        hostname = hostname || location.hostname;

        var re = new RegExp(hostname.split('.').join('').split('').join('\\s*'), 'i'),
            // check with TLD in place (jarv.us)
            name = title.match(re);

        if (!name) {
            // check without TLD
            re = new RegExp(hostname.split('.').slice(0, -1).join('').split('').join('\\s*'), 'i');
            name = title.match(re);
        }

        // TODO: visit root/index page of domain and diff the titles for common elements?

        // If no matches are found, return the hostname (with TLD)
        return name ? name[0] : hostname;
    },

    getURLViaProxy: function (url, cb) {
        var options = {
            method: 'get',

            url: '/spark2/proxy.php',

            params: {
                csurl: url
            }
        };

        if (typeof cb === 'function') {
            options.success = cb;
        }

        Ext.Ajax.request(options);
    },

    autoPopulateMetadata: function(editor, linkClass) {
        // TODO: this should remove the vendor if the editor is cancelled
        var me = this,
            form = editor.getForm(),
            values = form.getFieldValues(),
            url = values.URL,
            title = values.Title,
            parsedURL = me.parseURL(url),
            hostname = parsedURL ? parsedURL.hostname.replace('www.', '') : null,
            vendorsStore = Ext.getStore('Vendors'),
            vendorDomainsStore = Ext.getStore('VendorDomains'),
            vendorDomain,
            createNewVendor = false;

        linkClass = linkClass || 'Spark2\\LearnLink';

         // Automatically select the vendor from the dropdown
         if (hostname) {
             vendorDomain = Ext.getStore('VendorDomains').findRecord('Domain', hostname);
             // TODO: How do we query by ContextClass = Spark2\LearnLink at the same time
             if (vendorDomain) {
                 form.setValues({VendorID: vendorDomain.get('VendorID')});
             } else {
                 createNewVendor = true;
             }
         } else {
           return;
         }

         me.getURLViaProxy(url, function(response) {
             var html = document.createElement('div'),
                 titles,
                 title,
                 vendor = vendorsStore.findRecord('ID', form.getFieldValues().VendorID),
                 newVendor,
                 newVendorDomain;

             html.innerHTML = response.responseText;
             titles = html.querySelectorAll('title');

             if (titles && titles.length >= 1) {
                 title = me.truncateTitle(titles[0].textContent, vendor, hostname);

                 form.setValues({
                     Title: title
                 });

                 if (createNewVendor) {
                     newVendor = new Spark2Manager.model.Vendor({
                         Name: me.guessNameFromTitle(title, hostname),
                         LogoURL: 'http://' + hostname + '/favicon.ico',
                         Description: 'Auto-generated by SparkPoint Manager'
                     });

                     newVendor.save({
                         success: function(vendor) {
                             var newVendorId = vendor.get('ID');

                             vendorsStore.add(vendor);

                             newVendorDomain = new Spark2Manager.model.VendorDomain({
                                 VendorID: newVendorId,
                                 Domain: hostname,
                                 ContextClass: linkClass
                             });

                             newVendorDomain.save({
                                 success: function(vendorDomain) {
                                     vendorDomainsStore.add(vendorDomain);

                                     form.setValues({
                                         VendorID: newVendorId
                                     });
                                 },

                                 failure: function() {
                                     // Rollback vendor creation
                                     vendorsStore.remove(newVendor);
                                     newVendor.erase();
                                 }
                             });
                         }
                     });
                 }
             }
         });
    }
});
