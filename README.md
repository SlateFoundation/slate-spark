# slate-spark

Provides extensions for Slate and UI applications for Spark

## In this repository
- `sencha-workspace/spark-classroom`: Sencha CMD package containing shared client-side code
- Client-side UI applications:
  - `sencha-workspace/SparkClassroomTeacher`: Realtime UI for teachers to use during class
  - `sencha-workspace/SparkClassroomStudent`: Realtime UI for students to use during class

## Technologies used
- Sencha CMD 6.x
- [Sencha Ext JS 6 Modern](http://docs.sencha.com/extjs/6.0/)

## Getting started with client-side UI application development
1. [Install latest 6.x Sencha CMD](https://www.sencha.com/products/extjs/cmd-download/)
2. `git clone --recursive -b develop git@github.com:JarvusInnovations/spark-classroom.git`
3. `cd ./spark-classroom`
4. `./build-all-apps.sh`

If you have a version of GIT older than 1.6, get a newer version of git.

Then run a web server from `sencha-workspace` or higher in your file tree and navigate to the subdirectory for the app you want to run in your browser. If you don't have a server you can run `sencha web start`
to run a basic local server at [http://localhost:1841](http://localhost:1841).

### Connecting to a server
You can connect to any remote slate-cbl instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.

## Building with habitat

1. `HAB_ORIGIN=slate hab studio enter`
2. `build sencha-workspace/SparkClassroomStudent`
3. `build sencha-workspace/SparkClassroomTeacher`
4. `build sencha-workspace/SparkDashboardStudent`
5. `build sencha-workspace/SparkDashboardTeacher`
