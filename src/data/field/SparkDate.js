Ext.define('SparkClassroom.data.field.SparkDate', {
    extend: 'Ext.data.field.Date',
    alias: 'data.field.sparkdate',

    dbDateRe: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,

    convert: function(v) {
        if (!v) {
            return null;
        }

        if (this.dbDateRe.test(v)) {
            v += ' UTC';
        }

        return new Date(v);
    }
});