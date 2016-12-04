# Developing Spark Classroom Locally

The Spark Classroom suite consists of two separate applications: `spark-classroom-teacher`
and `spark-classroom-student`. They share code through a common package called `spark-classroom`.

Both applications have a README in the root of their repository that covers cloning and running
them locally:

- [spark-classroom-teacher](https://github.com/JarvusInnovations/spark-classroom-teacher)
- [spark-classroom-student](https://github.com/JarvusInnovations/spark-classroom-student)

## Working with submodules
Git submodules are used to ensure that when you checkout any given commit of one of the apps,
you also use the same version of every submodule that the author of the commit intended it to work with.

Due to the nature of how submodules work, it's a bad idea to try and have both apps cloned to your computer
use the same copy of `spark-classroom`. If you make improvements to `spark-classroom` in one app and then
want to build on them in the other, you'll need to commit and push them from the first, and then pull them
back down to the other copy. If you want to pull changes between the two without pushing to github first,
if you're working offline for example, you can add one as a remote to the other via its local file path and
push/pull directly between them.

[SourceTree](https://www.sourcetreeapp.com/) and [SmartGit](http://www.syntevo.com/smartgit/) both make
staying on top of submodules a lot easier than it is through purely the command line.