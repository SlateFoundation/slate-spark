Ext.define('SparkClassroom.widget.Panel', {
    extend: 'Ext.Container',
    xtype: 'spark-panel',

    config: {
        baseCls: 'spark-panel',
        title: null
    },

    /**
     * @private
     */
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

    /**
     * @private
     */
    updateTitle: function(newTitle, oldTitle) {
        if (newTitle) {
            this.add(newTitle);
        }
        if (oldTitle) {
            this.remove(oldTitle);
        }
    },

    /**
     * @private
     */
    getTitle: function() {
        var title = this._title;

        if (title && title instanceof Ext.Title) {
            return title.getTitle();
        }

        return title;
    }
});