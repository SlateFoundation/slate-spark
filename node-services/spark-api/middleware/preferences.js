'use strict';

const Values = require('../lib/util').Values;

const PREFERENCE_SCOPES = {
    user_id: `(user_id = \${user_id} OR user_id = 0 OR user_id < 0)`,
    sparkpoint_id: `(sparkpoint_id = \${sparkpoint_id} OR (substr(sparkpoint_id, 1, 1) != 'M'))`,
    section_id: `(section_id = \${section_id} OR section_id = 0 OR section_id < 0)`
};

const NANOSECONDS_IN_MS = 1e+6;

function scopeToWhere(scope = {}, vals) {
    var where = ['1=1'];

    for (let key in PREFERENCE_SCOPES) {
        let val = scope[key];

        if (val) {
            let sql = PREFERENCE_SCOPES[key];

            if (vals instanceof Values) {
                sql = sql.replace('${' + key + '}', vals.push(val));
            }
            where.push(sql);
        }
    }

    return where.join(' AND ');
}

function generateScopedPreferenceQuery (scope) {

    var {user_id, section_id, sparkpoint_id} = scope;

    return /*language=SQL*/ `

    WITH scoped_preferences AS (
        SELECT section_id,
               trim(sparkpoint_id) AS sparkpoint_id,
               user_id,
               preferences,
               sticky,
               last_updated,
               ((CASE WHEN sparkpoint_id = '0' THEN 0 WHEN substr(sparkpoint_id, 1, 1) = '-' THEN abs(sparkpoint_id::integer) ELSE 1.1 END) +
               (CASE WHEN section_id = 0 THEN 0 WHEN section_id < 0 THEN abs(section_id) ELSE 1 END) +
               (CASE WHEN user_id = 0 THEN 0 WHEN user_id < 0 THEN abs(user_id) ELSE 1 END)) AS specificity
          FROM preferences
          WHERE ${scopeToWhere(scope)}
       ORDER BY specificity DESC,
                sticky DESC
    ), json_preferences AS (
            SELECT json_agg(preferences) AS json FROM scoped_preferences
    ), effective_preferences AS (
            SELECT json_object_reverse_array_merge(COALESCE(json, '[]'::JSON)::JSON) AS json FROM json_preferences
    )
    
    SELECT json FROM effective_preferences;
    `;
}

module.exports = function preferenceMiddlewareInit(options) {
    return function* (next) {
        var ctx = this,
            scope = ctx.state.scope = {
                user_id: ctx.userId || 0,
                section_id: ctx.query.section_id || 0,
                sparkpoint_id: ctx.query.sparkpoint_id || '0'
            };

        var start = process.hrtime();
        ctx.state.preferences = (yield ctx.pgp.one(generateScopedPreferenceQuery(scope), scope)).json;
        ctx.set('X-Preferences-Took-How-Long', process.hrtime(start)[1] / NANOSECONDS_IN_MS);

        ctx.setPreferences = function* setPreferences(preferences = {}, scope = ctx.state.scope, sticky = false) {
            yield ctx.pgp.one(/*language=SQL*/ `
                INSERT INTO preferences VALUES
                (\${section_id}, \${sparkpoint_id}, \${user_id}, \${preferences}::JSONB, \${sticky})
                  ON CONFLICT (section_id, sparkpoint_id, user_id, sticky)
                DO UPDATE SET last_updated = now(),
                              preferences = preferences.preferences || EXCLUDED.preferences
                    RETURNING *;
            `, {
                section_id: scope.section_id,
                sparkpoint_id: scope.sparkpoint_id,
                user_id: scope.user_id,
                preferences: preferences,
                sticky: sticky
            });

            try {
                let preferences = (yield ctx.pgp.one(generateScopedPreferenceQuery(scope), scope)).json;
                ctx.state.preferences = preferences;
            } catch (e) {
                console.error('Set preferences failed to reload effective preferences for scope: ', scope, e);
            }
        };

        yield next;
    };
};
