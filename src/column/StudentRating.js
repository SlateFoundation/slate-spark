Ext.define('SparkClassroom.column.StudentRating', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-studentrating',


    config: {
        enableEditing: false,

        dataIndex: 'rating',
        width: 112,
        text: 'Your Rating',
        cell: {
            encodeHtml: false
        },
        renderer: function(v, r) {
            var out = [],
                n = 10;

            v = Ext.isObject(v) ? v.user : v;

            if (this.getEnableEditing()) {
                out.push('<select class="field-control">');

                if (!v) {
                    out.push('<option></option>');
                }

                for (; n > 0; n--) {
                    out.push('<option'+(n == v ? ' selected' : '')+'>'+n+'</option>');
                }

                out.push('</select>');

                return out.join('');
            }

            return v;
        }
    }
});