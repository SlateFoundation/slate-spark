# spark-repository-manager

## Getting started with development
1. [Install latest 5.x or 6.x Sencha CMD](https://www.sencha.com/products/extjs/cmd-download/)
2. `git clone --recursive -b develop git@github.com:JarvusInnovations/spark-repository-manager.git`
   or `git clone --recursive -b develop https://github.com/JarvusInnovations/spark-repository-manager.git`
3. `cd spark-repository-manager/sencha-workspace/SparkRepositoryManager`
4. `sencha app build`

If you have a version of GIT older than 1.6, get a newer version of git.

Then run a web server from `spark-repository-manager/sencha-workspace` or higher in your file tree and navigate to the
`sencha-workspace/SparkRepositoryManager` folder in your browser. If you don't have a server you can run `sencha web start`
to run a basic local server at [http://localhost:1841](http://localhost:1841).

The first time you build the app, it will download the correct version of the framework from Sencha.

## Connecting to a server
You can connect SparkRepositoryManager to any remote data instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.