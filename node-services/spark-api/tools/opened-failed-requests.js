/*
 Usage: Cut and paste the contents of #matchbook-infrastructure into opened-failed-requests.txt before running
*/

var fs = require('fs'),
    reqs = fs.readFileSync('./opened-failed-requests.txt', 'utf-8').split('\n'),
    keep = [],
    shouldKeep = false;

reqs.forEach(function(line) {
    if (shouldKeep) {
        if (line === '}```') {
            shouldKeep = false;
            keep.push('}');
            keep.push('```');
        } else if (line === '```{') {
            keep.push('```javascript');
            keep.push('{');
        } else {
            keep.push(line);
        }
    }

    if (line.indexOf('*Details:*​') !== -1) {
        shouldKeep = true;
    }
});

console.log(keep.join('\n'));
