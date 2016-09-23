'use strict';

function *postHandler() {
    var ctx = this,
        slateCfg = ctx.app.context.config.slate,
        missingUsersBySchema = {},
        productionInstances = slateCfg
            .instances
            .filter(instance => instance.production)
            .map(instance => instance.mysql.schema),
        instances = (ctx.query.instances || '')
            .split(',')
            .filter(instance => productionInstances.includes(instance));

    instances = (instances.length > 0) ? instances : productionInstances;
    instances.forEach(schema => missingUsersBySchema[schema] = `Database handle unavailable for: ${schema}`);

    for (var schema in missingUsersBySchema) {
        let pgp = ctx.app.context.pgp[schema];

        if (pgp) {
            missingUsersBySchema[schema] = yield ctx.pgp.any(/*language=SQL*/ `
                WITH production_users AS (
                    SELECT p.*,
                           cp."Data" AS "Email"
                      FROM people p
                      JOIN contact_points cp ON p."PrimaryEmailID" = cp."ID"
                ), fusebox_people AS (
                    SELECT DISTINCT ("Username"),
                           'Emergence\\People\\User' AS "Class",
                           "Created",
                           "CreatorID",
                           "FirstName",
                           "LastName",
                           "Password",
                           'Staff' AS "AccountLevel",
                           "Email"
                      FROM production_users
                ), existing_users AS (
                    SELECT * FROM "fusebox-live".fdw_people
                ), missing_users AS (
                    SELECT *
                      FROM fusebox_people
                     WHERE lower("Username") NOT IN (SELECT lower("Username") FROM existing_users)
                ), new_users AS (
                  INSERT INTO "fusebox-live".fdw_people ("Username", "Class", "Created", "CreatorID", "FirstName", "LastName", "Password", "AccountLevel", "Email")
                    SELECT * FROM missing_users 
                    ON CONFLICT DO NOTHING
                ) 
                
                SELECT * FROM missing_users;
            `);
        }
    }

    ctx.body = missingUsersBySchema;
}

module.exports = {
    post: postHandler
};
