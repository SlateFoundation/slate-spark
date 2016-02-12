/**
 * Adds a `title` config that creates a docked title component
 */
Ext.define('SparkClassroom.mixin.DockedTitle', {
    config: {
        title: null
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
});