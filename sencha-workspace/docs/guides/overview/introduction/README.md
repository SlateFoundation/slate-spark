# Introduction to Spark
Spark is an in-classroom realtime learning system build on top of Slate as an add-on package
and collection of supplementary services.



## Matchbook Model
Spark implements the learning model pioneered by Matchbook Learning at
[Merit Preparatory Charter School](http://merit.matchbooklearning.com/) in Newark, New Jersey.
Originally implemented via a magnetic GPS board and collections of Google Forms and resources
in Canvas in what was known as Spark 1.0, "Spark 2.0" reperesents the initial comprehensive
digitization of this project by Jarvus Innovations.

In each classroom, students work with the teachers' oversight and collaboration two advance through
the 4 phases of Spark's learning cycle for each [Sparkpoint](#!/guide/overview_sparkpoints).

- **Learn**: The student selects and studies from a provided bank of learning content.
- **Conference**: The student discusses what they've learn with peers, completes a worksheet, and consults with a teacher before advancing.
- **Apply**: The student selects and completes a project
- **Assess**: The students completes an online assessment



## Major Components

### Spark Backend
The [JarvusInnovations/spark-ops](https://github.com/JarvusInnovations/spark-ops) repository
[houses issues](https://github.com/JarvusInnovations/spark-ops/issues) for Spark's overall backend. Each Spark cluster
consists of at least 3 (virtual) machines:

- **spark-fe**: [**F**ront **End** HTTP server](#!/guide/backend_loadbalancer) for all user-facing traffic.
Powered by [nginx](http://nginx.org/), spark-fe applies SSL to all connections and proxies requests to the
various backend applications based on route. Custom Lua code run under nginx handles reading the session cookie
for each school domain and provides to the backend application via headers the status of the session and basic
user details.
- **spark-api**: Hosts the Postgres databases containing all Sparkpoint and school-based learning data. The
[spark-api](#!/guide/backend_api) and [spark-realtime](#!/guide/backend_realtime) Node.js applications run on
this machine and provide HTTP interfaces to the Spark data hosted in Postgres.
- **spark-slate**: An [emergence](http://emr.ge)-managed machine that hosts [Slate](https://github.com/SlateFoundation/slate)
instances for each school. It may also host a shared Fusebox instance and other auxiliary Emergence sites.

#### Slate Integrations
The [slate-spark](https://github.com/JarvusInnovations/slate-spark) package customizes Slate for Spark-powered schools
and provides the user interface to Spark tools.

### Spark Classroom
The SparkClassroomStudent and SparkClassroomTeacher applications are built on ExtJS 6's Modern toolkit and provide
single-page HTML5 interfaces that students and teachers use continuously in the classroom. They share code via
the spark-classroom and a theme via the spark-theme Sencha CMD packages. The two applications are separately compiled
with Sencha CMD on the master template Slate instance and loaded by students and teachers through a page hosted in Slate
and linked to from users' dashboards.

### Spark Fusebox
Fusebox is a standalone Emergence site featuring a MySQL data model, API, and ExtJS 5.1-based management interface. Fusebox
is used by teachers and central staff to build, tag, and maintain a shared repository of learning content including learns,
conference questions, conference resources, apply projects, and assessments. The spark-api application connects directly
to Fusebox's MySQL database to pull resources and combines them with resources from other online providers before serving
a unified collection of resources to classroom users.