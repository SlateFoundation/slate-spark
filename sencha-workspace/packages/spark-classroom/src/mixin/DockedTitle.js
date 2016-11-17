/**
 * Adds a `title` config that creates a docked title component
 */
Ext.define('SparkClassroom.mixin.DockedTitle', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        after: {
            doRefresh: 'doRefreshTitleCount'
        }
    },

    config: {
        title: null,
        showCountInTitle: true
    },

    applyTitle: function(title, existingTitle) {
        if (Ext.isString(title)) {
            title = {
                title: title
            };
        }

        return Ext.factory(title, 'Ext.Title', existingTitle);
    },

    updateTitle: function(title, oldTitle) {
        if (title) {
            title.setDocked('top');
            this.add(title);
        }

        if (oldTitle) {
            this.remove(oldTitle);
        }
    },

    updateShowCountInTitle: function(showCountInTitle) {
        if (this.countEl) {
            this.countEl.setVisible(showCountInTitle);
        }
    },

    doRefreshTitleCount: function() {
        var me = this,
            store = me.getStore(),
            countStr = store && store.getCount().toString(),
            titleCmp = me.getTitle(),
            countEl = me.countEl;

        if (!store || !me.getShowCountInTitle()) {
            return;
        }

        if (countEl) {
            countEl.setHtml(countStr);
        } else {
            me.countEl = titleCmp.getInnerHtmlElement().appendChild({
                tag: 'span',
                cls: 'count',
                html: countStr
            });
        }
    }
});