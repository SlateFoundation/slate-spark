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
            change: { fn: 'onFieldChange', buffer: 250 },
            action: 'onFieldAction'
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

        suggestionsList.getStore().on('load', 'onSuggestionsStoreLoad', this);
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

    onFieldFocus: function(me) {
        var suggestionsList = me.getSuggestionsList();

        suggestionsList.setVisibility(false);

        if (!suggestionsList.getParent()) {
            (me.up('{getScrollable()}') || Ext.Viewport).add(suggestionsList);
        }

        suggestionsList.show();
        suggestionsList.alignTo(me, 'tl-bl');

        me.setQuery(me.getValue()||'');

        suggestionsList.setVisibility(true);
    },

    onFieldChange: function(me, value) {
        me.setQuery(value);
    },

    onFieldAction: function(me) {
        var suggestionsList = me.getSuggestionsList();

        me.setSelectedSparkpoint(suggestionsList.getSelection());
        suggestionsList.hide();
    },

    onSuggestionsStoreLoad: function(suggestionsStore) {
        var me = this,
            query = me.getQuery(),
            selectedSparkpoint = me.getSelectedSparkpoint();

        me.getSuggestionsList().select(
            (query && suggestionsStore.query('code', query, false, false, true).first()) ||
            (selectedSparkpoint && suggestionsStore.getById(selectedSparkpoint.getId())) ||
            0
        );
    },

    onSuggestionsListItemTap: function(suggestionsList, index, target, sparkpoint) {
        this.setSelectedSparkpoint(sparkpoint);
        suggestionsList.hide();
    }
});