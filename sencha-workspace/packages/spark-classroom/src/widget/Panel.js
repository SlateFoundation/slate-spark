/* global Ext */
/**
 * A minimal container for providing a stylized box with optional title
 */
Ext.define('SparkClassroom.widget.Panel', {
    extend: 'Ext.Container',
    xtype: 'spark-panel',

    config: {
        /**
         * An optional title for the panel
         */
        title: null,

        // @inheritdoc
        baseCls: 'spark-panel'
    },

    // @private
   applyTitle: function(title) {
        if (typeof title == 'string') {
            title = {title: title};
        }

        Ext.applyIf(title, {
            docked : 'top',
            baseCls: this.getBaseCls() + '-title'
        });

        return Ext.factory(title, Ext.Title, this._title);
    },

    // @private
    updateTitle: function(newTitle, oldTitle) {
        if (newTitle) {
            this.add(newTitle);
        }
        if (oldTitle) {
            this.remove(oldTitle);
        }
    },

    /**
     * Gets title of panel
     * @return {String} The current title
     */
    getTitle: function() {
        var title = this._title;

        if (title && title instanceof Ext.Title) {
            return title.getTitle();
        }

        return title;
    }
});