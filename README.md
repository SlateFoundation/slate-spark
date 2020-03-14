# slate-spark

Provides extensions for Slate and UI applications for Spark

## Quickstart

1. Install [Chef Habitat](https://www.habitat.sh/)
1. Install Docker (only required on Mac and Windows)
1. Launch studio:

    ```bash
    HAB_DOCKER_OPTS="--name slate-spark-studio -p 8080:80 -p 8081:7081 -p 8036:3306 -p 8054:5432" \
        hab studio enter -D
    ```

    The `HAB_DOCKER_OPTS` environment variable used here controls what options `hab` passed to Docker when creating a container for this studio environment. In the above example, we're naming the container `slate-spark-studio` and opening ports 8080 (emergence http) 8081 (static http) 8036 (mysql) and 8054 (postgres). If you're familiar with Docker's command line options, these can be tweaked or added to however you see fit.
1. Load a sample database (optional):

    ```bash
    mkdir /src/.data
    echo ".data/" >> /src/.git/info/exclude
    git clone -b core/people-terms-sections https://github.com/SlateFoundation/slate-fixtures.git /src/.data/slate-fixtures
    cat /src/.data/slate-fixtures/*.sql | load-sql -
    ```



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
You can connect to any remote slate-spark instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.

## Building with habitat

1. `HAB_ORIGIN=slate hab studio enter`
2. `build sencha-workspace/SparkClassroomStudent`
3. `build sencha-workspace/SparkClassroomTeacher`
4. `build sencha-workspace/SparkDashboardStudent`
5. `build sencha-workspace/SparkDashboardTeacher`
