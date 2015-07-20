# spark-repository-manager

## Getting started with development
1. Install latest 5.x Sencha CMD
2. Clone this repository
3. `cd spark-repository-manager/sencha-workspace/packages`
4. `./get-packages.sh`
5. `cd ../SparkRepositoryManager`
6. `sencha app build`

Then run a web server from `spark-repository-manager/sencha-workspace` or higher in your file tree and navigate to the
`sencha-workspace/SparkRepositoryManager` folder in your browser. If you don't have a server you can run `sencha web start`
to run a basic local server.

The first time you build the app, it will download the correct version of the framework from Sencha.

## Connecting to a server
You can connect SparkRepositoryManager to any remote data instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.

