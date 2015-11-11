'use strict';

var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream'),
    inStream = fs.createReadStream('/Users/jmealo/Desktop/spark-api.log'),
    url = require('url'),
    MarkdownTable = require('markdown-table'),
    numeral = require('numeral'),
    aggregates = {},

    rl = readline.createInterface({
        input: inStream,
        terminal: false
    }),

    arrayHeaders = ['Avg', 'Median', 'Max', 'Min'],
    arrayStats = ['average', 'median', 'max', 'min'],

    report = {};

Array.prototype.sum = Array.prototype.sum || function() {
        return this.reduce(function(sum, a) {
            return sum + Number(a)
        }, 0);
    };

Array.prototype.average = Array.prototype.average || function() {
        return this.sum() / (this.length || 1);
    };

Array.prototype.median = Array.prototype.median || function() {
        this.sort(function (a,b) {
            return a - b;
        });

        let half = Math.floor(this.length / 2);

        if (this.length % 2) {
            return this[half];
        } else {
            return (this[half-1] + this[half]) / 2.0;
        }
    };

Array.prototype.max = Array.prototype.max || function() {
        return Math.max.apply(null, this);
    };

Array.prototype.min = Array.prototype.min || function() {
        return Math.min.apply(null, this);
    };

Array.prototype.percentile = Array.prototype.percentile || function(percentile) {
        var len = this.length;

        if (len === 0) {
            return 0;
        }

        if (percentile <= 0) {
            return this[0];
        }

        if (percentile >= 1) {
            return this[len - 1];
        }

        var index = len * percentile,
            lower = Math.floor(index),
            upper = lower + 1,
            weight = index % 1;

        if (upper >= len) {
            return this[lower];
        }

        return this[lower] * (1 - weight) + this[upper] * weight;
    };

rl.on('line', function(line) {
    if (/GET|PATCH|POST|DELETE|PUT/.test(line.substr(0,6))) {
        let tokens = line.split(' ');
        let method = tokens[0];
        let path = url.parse(tokens[1]).pathname;

        if (path.indexOf('/work/learns/launch/') === 0) {
            path = '/work/learns/launch';
        }

        aggregates[path] || (aggregates[path] = {});
        aggregates[path][method] || (aggregates[path][method] = []);
        aggregates[path][method].push(tokens[tokens.length-2]);
    }
});

inStream.on('end', function() {
    for (var path in aggregates) {
        console.log('# ' + path);

        let methods = aggregates[path];
        let table = [];
        let headers = ['Method'];

        headers.push('Hits');
        arrayHeaders.forEach(fn => headers.push(fn.substr(0,1).toUpperCase() + fn.substr(1)));
        headers.push('90%');
        headers.push('95%');
        headers.push('99%');

        table.push(headers);

        for (var method in methods) {
            var values = [method];
            let stats = methods[method];

            values.push(numeral(stats.length).format('0,0'));
            arrayStats.forEach(fn => values.push(numeral(stats[fn]()).format(fn === 'sum' ? '0,0' : '0,0.0')));
            values.push(numeral(stats.percentile(.90)).format('0,0.0'));
            values.push(numeral(stats.percentile(.95)).format('0,0.0'));
            values.push(numeral(stats.percentile(.99)).format('0,0.0'));

            table.push(values);
        }

        console.log(MarkdownTable(table));
    }
});