Ext.define('SparkTheme.LoadMask', {
    override: 'Ext.LoadMask',

    getTemplate: function() {
        return [
            {
                reference: 'innerElement',
                cls: 'load-mask-inner',
                children: [
                    {
                        reference: 'indicatorElement',
                        cls: 'load-spinner',
                        html: '<i class="fa fa-circle-o"></i>'
                    },
                    {
                        reference: 'messageElement'
                    }
                ]
            }
        ];
    }
});