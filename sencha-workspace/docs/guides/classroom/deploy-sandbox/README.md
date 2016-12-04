# Deploying Spark Classroom to the Sandbox Environment

The sandbox environment provides a place to deploy and test the `develop` branches of the
`spark-classroom-teacher`, `spark-classroom-student`, `spark-classroom`, and `spark-theme` repositories.

## Deploy from GitHub and Update Builds
1. Login as a developer at [sandbox-school/git/status](https://sandbox-school.matchbooklearning.com/git/status)
2. Press <kbd>Pull (FF)</kbd> on the `spark-classroom-teacher`, `spark-classroom-student`,
`spark-classroom`, and `spark-theme` layers to update the corresponding local git repositories from GitHub.
3. Press <kbd>Disk &rarr; VFS</kbd> on each of the same four layers to then load the contents of
the git repositories into Emergence according to each layer's configured mappings in
`Git::$repositories`
4. If any Sencha CMD packages besides `spark-classroom` and `spark-theme` have been updated, visit
[sandbox-school/sencha-cmd/update-packages?app=SparkClassroomTeacher](https://sandbox-school.matchbooklearning.com/sencha-cmd/update-packages?app=SparkClassroomTeacher)
and [sandbox-school/sencha-cmd/update-packages?app=SparkClassroomStudent](https://sandbox-school.matchbooklearning.com/sencha-cmd/update-packages?app=SparkClassroomStudent)
to update them from chaki.io
5. Build both apps one at a time by loading [sandbox-school/sencha-cmd/app-build?name=SparkClassroomTeacher](https://sandbox-school.matchbooklearning.com/sencha-cmd/app-build?name=SparkClassroomTeacher)
and then [sandbox-school/sencha-cmd/app-build?name=SparkClassroomStudent](https://sandbox-school.matchbooklearning.com/sencha-cmd/app-build?name=SparkClassroomStudent)