/* global SparkClassroom */
Ext.define('SparkClassroom.widget.SparkpointField', {
    extend: 'Ext.field.Text',
    xtype: 'spark-sparkpointfield',
    requires: [
        'SparkClassroom.widget.SparkpointSuggestions'
    ],


    config: {
        selectedSparkpoint: null,
        query: null,
        suggestionsList: true,

        cls: 'spark-navbar-sparkpoint-selector',
        label: 'Sparkpoint',
        labelCls: 'visually-hidden',
        placeHolder: 'Select Sparkpoint',

        listeners: {
            focus: 'onFieldFocus',
            change: { fn: 'onFieldChange', buffer: 250 }
        }
    },


    applySuggestionsList: function(config, oldList) {
        if (config === true) {
            config = {};
        }

        return Ext.factory(config, SparkClassroom.widget.SparkpointSuggestions, oldList);
    },

    updateSuggestionsList: function(suggestionsList) {
        suggestionsList.on({
            scope: this,
            itemtap: 'onSuggestionsListItemTap'
        });
    },

    updateQuery: function(query) {
        var loadConfig = {};

        if (query) {
            loadConfig.url = '/spark/api/sparkpoints/autocomplete';
            loadConfig.params = {
                q: query
            };
        }

        this.getSuggestionsList().getStore().load(loadConfig);
    },

    updateSelectedSparkpoint: function(sparkpoint, oldSparkpoint) {
        var me = this;

        me.setValue(sparkpoint.getId());
        me.fireEvent('sparkpointselect', me, sparkpoint, oldSparkpoint);
    },

    onFieldFocus: function(sparkpointField) {
        var me = this,
            suggestionsList = me.getSuggestionsList();

        suggestionsList.setVisibility(false);

        if (!suggestionsList.getParent()) {
            (me.up('{getScrollable()}') || Ext.Viewport).add(suggestionsList);
        }

        suggestionsList.show();
        suggestionsList.alignTo(sparkpointField, 'tl-bl');

        me.setQuery(sparkpointField.getValue()||'');

        suggestionsList.setVisibility(true);
    },

    onFieldChange: function(sparkpointField, value) {
        this.setQuery(value);
    },

    onSuggestionsListItemTap: function(suggestionsList, index, target, sparkpoint) {
        this.setSelectedSparkpoint(sparkpoint);
        suggestionsList.hide();
    }
});