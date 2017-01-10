Ext.define('SparkRepositoryManager.widget.PostfixField', {
    extend: 'Ext.form.field.Number',
    xtype: 'srm-postfixfield',


    setValue: function (v) {
        this.callParent(arguments);

        var val = this.getValue();

        if (!Ext.isEmpty(val)) {

            // TODO: put this in DurationField
            if (this.postfix === 'minutes' && this.hourField) {
                if (val === 60) {
                    this.hourField.setValue(this.hourField.getValue() + 1);
                    val = 0;
                    this.setValue(val);
                } else if (val === -1) {
                    if (this.hourField.getValue() > 0) {
                        this.hourField.setValue(this.hourField.getValue() - 1);
                        val = 59;
                    } else {
                        val = 0;
                    }
                    this.setValue(val);
                }
            } else if (val === -1) {
                this.setValue(0);
                val = 0;
            }

            this.setRawValue(val + ' ' + this.postfix);
        }
    },

    removeFormat: function (v) {
        if (Ext.isEmpty(v)) {
            return '';
        } else {
            return v.toString().replace(' ' + this.postfix, '');
        }
    },

    parseValue: function (v) {
        return this.callParent([this.removeFormat(v)]);
    },

    getErrors: function (v) {
        return this.callParent([this.removeFormat(v)]);
    },

    getSubmitData: function () {
        var returnObject = {};

        returnObject[this.name] = this.removeFormat(this.callParent(arguments)[this.name]);

        return returnObject;
    }
});