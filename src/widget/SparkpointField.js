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
            action: 'onFieldAction',
            keyup: 'onFieldKeyUp'
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

        me.setValue(sparkpoint ? sparkpoint.getId() : null);

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

    onFieldKeyUp: function(me, ev) {
        var key = ev.getKey(),
            isDown = key == ev.DOWN,
            list, store, index, max;

        if (!isDown && key != ev.UP) {
            return;
        }

        list = this.getSuggestionsList();
        store = list.getStore();
        max = store.getCount() - 1;

        if (!max) {
            return;
        }

        index = store.indexOf(list.getSelection());

        if (index == -1) {
            index = isDown ? 0 : max;
        } else if (isDown) {
            index = index == max ? 0 : index + 1;
        } else {
            index = index == 0 ? max : index - 1;
        }

        list.select(index);
        list.scrollToRecord(list.getSelection());
    },

    onSuggestionsStoreLoad: function(suggestionsStore) {
        var me = this,
            query = me.getQuery(),
            selectedSparkpoint = me.getSelectedSparkpoint();

        me.getSuggestionsList().select(
            (query && suggestionsStore.query('code', query, false, false, true).first()) ||
            (selectedSparkpoint && suggestionsStore.getById(selectedSparkpoint.getId())) ||
            suggestionsStore.getCount() ? 0 : null
        );
    },

    onSuggestionsListItemTap: function(suggestionsList, index, target, sparkpoint) {
        this.setSelectedSparkpoint(sparkpoint);
        suggestionsList.hide();
    }
});