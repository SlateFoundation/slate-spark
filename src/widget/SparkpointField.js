Ext.define('SparkClassroom.widget.SparkpointField', {
    extend: 'Ext.field.Text',
    xtype: 'spark-sparkpointfield',


    config: {
        cls: 'spark-navbar-sparkpoint-selector',
        label: 'Sparkpoint',
        labelCls: 'visually-hidden',
        placeHolder: 'Select Sparkpoint'
    }
});