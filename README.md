# spark-classroom-student

This [Ext JS 6 Modern](http://docs.sencha.com/extjs/6.0/) app provides a user interface for students in a Spark classroom.

It shares many components with the **spark-classroom-teacher** app via the **spark-classroom** package.

## Getting started with development
1. [Install latest 6.x Sencha CMD](https://www.sencha.com/products/extjs/cmd-download/)
2. `git clone --recursive -b develop git@github.com:JarvusInnovations/spark-classroom-student.git`
3. `cd spark-classroom-student/sencha-workspace/SparkClassroomStudent`
4. `sencha app build`

If you have a version of GIT older than 1.6, get a newer version of git.

Then run a web server from `spark-classroom-student/sencha-workspace` or higher in your file tree and navigate to the
`sencha-workspace/SparkClassroomStudent` folder in your browser. If you don't have a server you can run `sencha web start`
to run a basic local server at [http://localhost:1841](http://localhost:1841).

The first time you build the app, it will download the correct version of the framework from Sencha.

## Connecting to a server
You can connect SparkClassroomStudent to any remote data instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page. To use HTTPS when connecting to `apiHost`, set `apiSSL=1` as well.
