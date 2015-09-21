/*jslint browser: true, undef: true, laxcomma:true *//*global Ext*/
Ext.define('SparkClassroom.NavSubpanel', {
    extend: 'Ext.Container',
    xtype: 'spark-navsubpanel',

    config: {
        cls: 'spark-navsubpanel',
        width: 400,
        left: 0 // must be set here to force container to add as floating, see https://www.sencha.com/forum/showthread.php?300896
    },

    getAlignmentInfo: function(component, alignment) {
        var scrollable = this.getParent().getScrollable(),
            scrollPosition = scrollable.getPosition(),
            alignmentInfo = this.callParent(arguments);

        // shift alignToBox.top by containter padding and scroll position
        alignmentInfo.stats.alignToBox.top -= scrollable.getElement().getY() - scrollPosition.y;
        return alignmentInfo;
    }
});