/**
 * This class is the controller for the Learn Grid and contains column renderers
 */
Ext.define('MatchbookStudent.view.tracker.assess.LearnGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tracker-assess-learngridcontroller',

    playlistColumnRenderer: function(val,meta,rec) {
        var title = rec.get('Title'),
            url = rec.get('Url'),
            display;

        display = '<p>' + title + '</p>';
        display += '<p><a target="_blank" href="' + url + '">' + Ext.String.ellipsis(url, 20) + '</a></p>';

        return display;
    }

});
