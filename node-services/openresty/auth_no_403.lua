-- Do not authenticate CORS pre-flight
if ngx.req.get_method() == 'OPTIONS' then
    return
end

local Mysql = require "resty.mysql"
local Cookie = require "resty.cookie"
local cjson = require "cjson"
local has_auth = false
local cached_session
local session_json
local is_legacy_db = false
local random = require "resty.random"
local db_hostname
local db_schema
local session_id
local user_cache = ngx.shared.users

local cookie, err = Cookie:new()

if not cookie then
    ngx.say("Failed to instantiate Cookie: ", err)
    ngx.log(ngx.ERR, err)
    ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
    return
end

local fields, err = cookie:get_all()

if fields then
    if fields["fusebox-staging-s"] ~= nil then
        db_hostname = "10.128.109.167"
        db_schema = "fusebox-staging"
        session_id = fields["fusebox-staging-s"]
        is_legacy_db = true
    elseif fields["fusebox-live-s"] ~= nil then
        db_hostname = "10.128.6.96"
        db_schema = "fusebox-live"
        session_id = fields["fusebox-live-s"]
        is_legacy_db = true
     elseif fields["mta-staging-s"] ~= nil then
        db_hostname = "10.128.109.167"
        db_schema = "mta-staging"
        session_id = fields["mta-staging-s"]
    elseif fields["merit-staging-s"] ~= nil then
        db_hostname = "10.128.109.167"
        db_schema = "merit-staging"
        session_id = fields["merit-staging-s"]
    elseif fields["mta-live-s"] ~= nil then
        db_hostname = "10.128.6.96"
        db_schema = "mta-live"
        session_id = fields["mta-live-s"]
    elseif fields["merit-live-s"] ~= nil then
        db_hostname = "10.128.6.96"
        db_schema = "merit-live"
        session_id = fields["merit-live-s"]
    elseif fields["sandbox-school-s"] ~= nil then
        db_hostname = "10.128.109.167"
        db_schema = "sandbox-school"
        session_id = fields["sandbox-school-s"]
    elseif fields["s_fusebox"] ~= nil then
        db_hostname = "192.168.246.9"
        db_schema = "fusebox"
        session_id = fields["s_fusebox"]
    end
end

if session_id ~= nil then
    local cache_key = db_schema .. "_" .. session_id

    cached_session, flags = user_cache:get(cache_key)

    if cached_session ~= nil then
        ngx.log(ngx.DEBUG, "NGINX shared dictionary hit for: ", session_id, "(", cached_session, ")")
        session_json = cached_session
        has_auth = true
    else
        ngx.log(ngx.DEBUG, "NGINX shared dictionary cache miss for: ", cache_key)

        local mysql, err = Mysql:new()

        if not mysql then
            ngx.say("Failed to instantiate MySQL: ", err)
            ngx.log(ngx.ERR, err)
            ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
            return
        end

        -- Try to lookup session in MySQL
        mysql:set_timeout(1000)

        local ok, err, errno, sqlstate = mysql:connect {
            host = db_hostname,
            port = 3306,
            database = db_schema,
            user = "pg",
            password = "cLLWjuVfX35XJDuGshLBg0u7",
            max_packet_size = 1024 * 1024
        }

        if not ok then
            ngx.say("API requires authentication; but authentication server is down. Please try again later. (", err, ")")
            ngx.log(ngx.ERR, "Error connecting to MySQL: ", err, ": ", errno, ": ", sqlstate)
            ngx.exit(ngx.HTTP_INTERNAL_SERVER_ERROR)
            return
        end

        local times, err = mysql:get_reused_times()

        if times then
            ngx.log(ngx.DEBUG, "MySQL connection has been re-used ", times, " times")
        else
            ngx.log(ngx.WARN, "Unable to get the number of times the MysQL connection has been re-used: ", err)
        end


        local sql

        if is_legacy_db then
            sql = [[
            SELECT
                   p.firstName,
                   p.lastName,
                   p.ID AS userId,
                   Email AS email,
                   AccountLevel AS accountLevel,
                   (SELECT GROUP_CONCAT(g.Handle) FROM group_members gm JOIN groups g ON g.ID = gm.GroupID WHERE gm.PersonId = p.ID) AS groupHandles,
                   Username AS username
              FROM `]] .. db_schema .. [[`.sessions s
              JOIN people p ON s.PersonId = p.ID
             WHERE s.Handle = ]] .. ngx.quote_sql_str(session_id) .. ' LIMIT 1;'
        else
            sql = [[
            SELECT
                   p.firstName,
                   p.lastName,
                   p.ID AS userId,
                   (SELECT Data FROM contact_points cp WHERE cp.ID = p.PrimaryEmailID) AS email,
                   accountLevel AS accountLevel,
                   (SELECT GROUP_CONCAT(g.Handle) FROM group_members gm JOIN groups g ON g.ID = gm.GroupID WHERE gm.PersonId = p.ID) AS groupHandles,
                   Username AS username
              FROM `]] .. db_schema .. [[`.sessions s
              JOIN people p ON s.PersonId = p.ID
             WHERE s.Handle = ]] .. ngx.quote_sql_str(session_id) .. ' LIMIT 1;'
        end

        local db_session, err, errno, sqlstate = mysql:query(sql)

        if not db_session then
            ngx.log(ngx.DEBUG, "Error querying MySQL for session data: ", err, ": ", errno, ": ", sqlstate, " (", sql , ")")
        else
            has_auth = true
            -- There's no fast split implementation available for openresty (that I could find), there is a patch
            -- available but it has not been tested: https://github.com/openresty/lua-nginx-module/issues/217
            -- db_session[1] is "userdata" which means it's still a native C structure, it would need a lua metatable
            -- in order to access properties on that object; which is likely more expense then it is worth to spli the
            -- csv in groupHandles (because MySQL doesn't support arrays)
            if db_session[1] then
                session_json = cjson.encode(db_session[1])
            end
        end

        local ok, err = mysql:set_keepalive(100000, 10)

        if not ok then
            ngx.log(ngx.WARN, "Failed setting MySQL keepalive: ",  err)
        end

        if has_auth and session_json and db_session then
            local succ, err, forcible = user_cache:set(cache_key, session_json)

            if not succ then
                ngx.log(ngx.WARN, "Failed to save session in NGINX shared dictionary: ", err)
            end
        end
    end
end

if has_auth and session_json then
    -- session = cjson.decode(session_json)
    -- ngx.req.set_header("X-Nginx-Account-Level", session.accountLevel);
    ngx.req.set_header("X-Nginx-Session", session_json)
    ngx.req.set_header("X-Nginx-Mysql-Schema", db_schema)
    ngx.req.set_header("X-Nginx-Mysql-Host", db_hostname)
    ngx.req.set_header("X-Nginx-Request-Id", random.token(16));

    if ngx.var.uri == "/rtail" and cjson.decode(session_json).accountLevel ~= "Developers" then
       ngx.exit(ngx.HTTP_FORBIDDEN)
    end

    return
end
    -- ngx.status = 403
    -- ngx.say(cjson.encode({ message = "Authentication required.", error = err }))
    -- ngx.log(ngx.DEBUG, "Unable to authorize API request: ", err)
    -- ngx.exit(ngx.HTTP_FORBIDDEN)
    -- return
--end
