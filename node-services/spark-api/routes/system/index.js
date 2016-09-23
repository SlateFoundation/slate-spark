'use strict';

function *getHandler() {
    var ctx = this;
    ctx.type = 'html';
    ctx.body = `<form action="/spark/api/system/sync_fusebox_users" method="POST">
                    <button type="submit">Sync Fusebox Users</button>
                </form>`;
}

module.exports = {
  get: getHandler
};