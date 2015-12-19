var fs = require('fs'),
    inputFile = process.argv[2],
    sql = fs.readFileSync(inputFile, 'utf8');

// Replace data type in table creation statements
sql = sql.replace(/section_id\s+text\s+/g, 'section_id integer ');

// Replace sections
// Generate this using the following query
// SELECT replace(string_agg('.replace(/''' || "Code" || '''/g,' || "ID" || ')', ''), '-', '\-') as js FROM "sandbox-school".course_sections;

console.log(
    sql
        .replace(/'ADV1\-1'/g, 1)
        .replace(/'ADVISORY1\-1'/g, 2)
        .replace(/'Math\-09'/g, 3)
        .replace(/'Geometry'/g, 4)
        .replace(/'MP\-0001'/g, 5)
);

