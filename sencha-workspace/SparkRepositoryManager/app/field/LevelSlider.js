/**
 * An extionsion of Ext.slider.Multi that uses a range of -1 to 12 and labels the first two values as "P" and K",
 * and shows the value consistantly below the thumb slider rather than using tooltips
 *
 * This requires a css class for .thumb-label for formatting and positioning the label, eg:
 *      .thumb-label {
 *          margin-top: 18px;
 *      }
 */
 Ext.define('SparkRepositoryManager.field.LevelSlider', {
    extend: 'Ext.slider.Multi',
    xtype: 'srm-field-levelslider',

    useTips: false,
    values: [-1,12],
    increment: 1,
    minValue: -1,
    maxValue: 12,
    displayValues: ['P','K','1','2','3','4','5','6','7','8','9','10','11','12'],

    initComponent: function() {
        this.on('afterrender', this.onAfterRender);
        this.on('change', this.onChange);

        this.callParent();
    },

    onAfterRender: function() {
        var me = this,
            thumbs = me.thumbs,
            thumbsLength = thumbs.length,
            thumbElementId,
            i;

        for(i=0; i<thumbsLength; i++){
            thumbElementId= thumbs[i].el.id;

            Ext.DomHelper.append(thumbElementId, {
                tag: 'div',
                id: 'thumb-label-'+i,
                cls: 'thumb-label',
                html: me.getLabel(thumbs[i].value)
            });
        }
    },

    onChange: function() {
        var me = this,
            thumbs = me.thumbs,
            thumbsLength = thumbs.length,
            thumbElementId,
            i;

        for(i=0; i<thumbsLength; i++){
            thumbElementId= thumbs[i].el.id;

            Ext.DomHelper.overwrite(thumbElementId, {
                tag: 'div',
                id: 'thumb-label-'+i,
                cls: 'thumb-label',
                html: me.getLabel(thumbs[i].value)
            });
        }
    },

    getLabel: function(val) {
        var me = this,
            min = me.minValue,
            inc = me.increment,
            pos = ((val - min)/inc),
            labels = me.displayValues;

        if (labels[pos]) {
            return labels[pos];
        }
        return val;
    }
});
