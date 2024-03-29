var cluster = require('cluster'),
    path = require('path'),
    config = require(path.resolve(__dirname, 'config.json')),
    workers;

cluster.setupMaster({
    exec: path.resolve(__dirname, 'worker.js'),
    silent: false
});

function spawnWorker(config) {
    var env = {SPARK_REALTIME: JSON.stringify(config)},
        worker = cluster.fork(env);

    worker.on('exit', function (code) {
        workers = workers.slice(workers.indexOf(worker), 1);

        console.log(`[${config.schema}] Worker listening on: ${config.port} exited with code: ${code} respawning...`);

        if (code == 1) {
            workers.push(spawnWorker(config));
        }
    });

    return worker;
}

workers = config.workers.map(function(worker) {
    console.log(`[${worker.schema}] Spawning worker on ${worker.port}`);
    worker.slack = config.slack;
    worker.middleware = config.middleware;
    return spawnWorker(worker);
});
