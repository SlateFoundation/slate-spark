// Auto-loader
require('fs').readdirSync(__dirname + '/').forEach(function(file) {
    var ext = file.match(/\.js(on)?$/);

    if (ext && file !== 'index.js') {
        var name = file.replace(ext[0], '');
        exports[name] = require('./' + file);
    }
});
