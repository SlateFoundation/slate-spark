# spark-api

```
.
├── README.md
├── cache
├── config
│   ├── caching.json
│   ├── database.json
│   ├── error.html
│   ├── logging.json
│   ├── nats.json
│   ├── opened.json
│   ├── opened.json.save
│   └── slate.json
├── config.yaml
├── doc
│   └── graphviz
│       ├── middleware.dot
│       ├── middleware.png
│       └── middleware.svg
├── lib
│   ├── LookupTable.js
│   ├── README.md
│   ├── asn-standard.js
│   ├── cacheagent.js
│   ├── database.js
│   ├── error.js
│   ├── fusebox.js
│   ├── logging.js
│   ├── lookup.js
│   ├── newsela.js
│   ├── opened.js
│   ├── password.js
│   ├── pgp-wrapper.js
│   ├── slack.js
│   ├── timing.js
│   └── util.js
├── logs
│   ├── errors.json
│   ├── requests.json
│   └── requests.log
├── middleware
│   ├── acl.js
│   ├── database.js
│   ├── debugging.js
│   ├── logging.js
│   ├── newrelic.js
│   ├── opened.js
│   ├── preferences.js
│   ├── process.js
│   ├── request.js
│   ├── response_time.js
│   └── session.js
├── package-lock.json
├── package.json
├── poc
│   ├── learn_preferences.sql
│   └── record-rebalancing.js
├── routes
│   ├── assign
│   │   ├── applies.js
│   │   ├── conference_resources.js
│   │   ├── guiding_questions.js
│   │   ├── learn_discussions.js
│   │   ├── learn_discussions.sql
│   │   └── learns.js
│   ├── assignments
│   │   ├── entity.js
│   │   ├── index.js
│   │   ├── schema.sql
│   │   └── usage_report.sql
│   ├── client
│   │   ├── debugger.js
│   │   ├── debugger.txt
│   │   └── timing.js
│   ├── develop.js
│   ├── healthcheck.js
│   ├── help.js
│   ├── lookup.js
│   ├── opened
│   │   ├── batch.js
│   │   └── sync.js
│   ├── preferences
│   │   ├── schema.sql
│   │   ├── stopgap-schema.sql
│   │   └── stopgap.js
│   ├── sections.js
│   ├── sparkpoints
│   │   ├── autocomplete.js
│   │   ├── index.js
│   │   ├── section
│   │   │   └── goals.js
│   │   ├── suggest.js
│   │   └── suggested.js
│   ├── system
│   │   ├── index.js
│   │   └── sync_fusebox_users.js
│   ├── test
│   │   ├── error.js
│   │   └── index.js
│   ├── timers.js
│   ├── todos.js
│   └── work
│       ├── activity.js
│       ├── applies
│       │   ├── index.js
│       │   └── submissions.js
│       ├── assess.js
│       ├── blocked.js
│       ├── conference-groups.js
│       ├── conferences
│       │   ├── index.js
│       │   ├── questions.js
│       │   └── worksheet.js
│       ├── feedback.js
│       ├── learns.js
│       ├── lessons
│       │   └── index.js
│       └── resources.js
├── sql
│   └── migrate-apply-id.sql
├── tools
│   └── generate-student-sparkpoint-triggers.js
└── worker.js
```
