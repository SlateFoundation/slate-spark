'use strict';

function *syncUsers(instances, pgp) {
    var ctx = this,
        query = /*language=SQL*/ `
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
    `;

    return pgp.any(query);
}

function *postHandler() {
    var ctx = this,
        slateCfg = ctx.app.context.config.slate,
        productionInstances = slateCfg
            .instances
            .filter(instance => instance.production)
            .map(instance => instance.mysql.schema),
        pgp = ctx.pgp;

    ctx.body = yield syncUsers(productionInstances, pgp);
}

module.exports = {
    post: postHandler
};
