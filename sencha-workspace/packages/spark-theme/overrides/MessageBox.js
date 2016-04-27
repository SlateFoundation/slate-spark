Ext.define('SparkTheme.MessageBox', {
    override: 'Ext.MessageBox',

    config: {
        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'cubic-bezier(0.1, 0.9, 0.3, 1.2)'
        },
    
        hideAnimation: {
            type: 'popOut',
            duration: 150,
            easing: 'cubic-bezier(0.5, 0.0, 0.7, 0.2)'
        }
    },
});