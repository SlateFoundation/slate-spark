local router = require "router"
local cjson = require "cjson"

local r = router.new()

r:match({
    GET = {
        ["/cache/:cache_name"] = function(params)
            local cache = ngx.shared[params.cache_name]

            if cache == nil then
                ngx.status = 404
                ngx.print(cjson.encode({error=params.cache_name .. " cache not found"}))
                ngx.exit(404)
            end

            ngx.print(cjson.encode(cache:get_keys(0)))
        end,
        ["/cache/:cache_name/:cache_key"] = function(params)
            local cache = ngx.shared[params.cache_name]

            if cache == nil then
                ngx.status = 404
                ngx.print(cjson.encode({error=params.cache_name .. " cache not found"}))
                ngx.exit(404)
            end

            local item = cache:get(params.cache_key)

            if item == nil then
                ngx.status = 404
                ngx.print(cjson.encode({error=params.cache_key .. " not found in " .. params.cache_name}))
                ngx.exit(404)
            end

            ngx.print(cache:get(params.cache_key))
            ngx.exit(200)
        end
    },
    PUT = {
        ["/cache/:cache_name/:cache_key"] = function(params)
            local cache = ngx.shared[params.cache_name]

            if cache == nil then
                ngx.status = 404
                ngx.print(cjson.encode({error=params.cache_name .. " cache not found"}))
                ngx.exit(404)
            end

            ngx.req.read_body()
            local body = ngx.req.get_body_data()

            if body == nil then
                ngx.status = 400
                ngx.print(cjson.encode({error="You must not have an empty request body, to null a value, use DELETE"}))
                ngx.exit(400)
            else
                local succ, err, forcible = cache:set(params.cache_key, body)

                if succ then
                    ngx.status = 201
                    ngx.print(body)
                    ngx.exit(201)
                else
                    ngx.status = 500
                    ngx.print(cjson.encode({error=err}))
                    ngx.exit(500)
                end
            end
        end
    },
    DELETE = {
        ["/cache/:cache_name"] = function(params)
            local cache = ngx.shared[params.cache_name]

            if cache == nil then
                ngx.status = 404
                ngx.print(cjson.encode({error=params.cache_name .. " cache not found"}))
                ngx.exit(404)
            end

            cache:flush_all()

            ngx.say(cjson.encode({error=false, success=true}))
            ngx.exit(200)
        end,
        ["/cache/:cache_name/:cache_key"] = function(params)
            local cache = ngx.shared[params.cache_name]

            if cache == nil then
                ngx.status = 400
                ngx.print(cjson.encode({error=params.cache_name .. " cache not found"}))
                ngx.exit(404)
            end

            cache:delete(params.cache_key)

            ngx.print(cjson.encode({error=false, success=true}))
            ngx.exit(200)
        end
    }
})

local ok, errmsg = r:execute(
    ngx.var.request_method,
    ngx.var.request_uri,
    ngx.req.get_uri_args()
)

if not ok then
    ngx.status = 404
    ngx.print(cjson.encode({error="404 Not Found", success=true}))
    ngx.log(ngx.ERROR, errmsg)
end
