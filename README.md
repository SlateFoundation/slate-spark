# spark-repository-manager

This emergence backend and ExtJS 5 app provide the datastore and user interface for a central server in the Spark ecosystem
that provides a shared content repository to a multitude of schools running Slate+Spark.

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

## Setting up a new Fusebox server

From an [Ubuntu 16.04 host machine running the emergence-kernel](https://github.com/EmergencePlatform/emergence-book/blob/master/server_setup/installation/ubuntu-1604.md):

1. Create a site extending `skeleton-v2.emr.ge`
2. Copy [php-config/Git.config.d/spark-fusebox.php](php-config/Git.config.d/spark-fusebox.php) into the site's file tree
3. Open **/git/status** in your browser and initialize the `spark-fusebox` layer
4. Click <kbd>Disk → VFS</kbd> to copy the layer's code into the site's file tree
5. Open **/sass/compile** in your browser to recompile the site's CSS files with the added SCSS sources
6. Open **/sencha-cmd/app-build?name=SparkRepositoryManager** to build the ExtJS UI application
7. Ensure that the `php7.0-pgsql` package is installed on the host machine, install with `apt-get install php7.0-pgsql` if needed and restart emergence's PHP service
8. Configure PostgreSQL connection details in `/emergence/sites/my-fusebox/site.json` by adding a top-level `"postgres"` key:

    ```json
    {
        "mysql": "...",
        "postgres": {
            "host": "postgres.local",
            "database": "spark-fusebox",
            "username": "spark-fusebox",
            "password": "abcd1234",
            "application_name": "spark-fusebox"
        }
    }
    ```