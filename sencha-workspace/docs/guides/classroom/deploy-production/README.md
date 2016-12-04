# Deploying Spark Classroom to the Production Environment

Once a [new version has been released](#!/guide/classroom_release), the `spark-classroom-student`
and `spark-classroom-teacher` apps are be deployed from their `releases/vX` branch to
[spark-skeleton](https://spark-skeleton.matchbooklearning.com), a common parent site for all
Matchbook school instances. It is on this common ancestor that all build processes like SASS
compilation and Sencha CMD compilation are excuted once for all child sites to share.

## Deploy to spark-skeleton from GitHub and Update Builds
1. Login as a developer at [spark-skeleton/git/status](https://spark-skeleton.matchbooklearning.com/git/status)
2. Press <kbd>Pull (FF)</kbd> on the `spark-classroom-teacher`, `spark-classroom-student`,
`spark-classroom`, and `spark-theme` layers to update the corresponding local git repositories from GitHub.
3. Press <kbd>Disk &rarr; VFS</kbd> on each of the same four layers to then load the contents of
the git repositories into Emergence according to each layer's configured mappings in
`Git::$repositories`
4. If any Sencha CMD packages besides `spark-classroom` and `spark-theme` have been updated, visit
[spark-skeleton/sencha-cmd/update-packages?app=SparkClassroomTeacher](https://spark-skeleton.matchbooklearning.com/sencha-cmd/update-packages?app=SparkClassroomTeacher)
and [spark-skeleton/sencha-cmd/update-packages?app=SparkClassroomStudent](https://spark-skeleton.matchbooklearning.com/sencha-cmd/update-packages?app=SparkClassroomStudent)
to update them from chaki.io
5. Build both apps one at a time by loading [spark-skeleton/sencha-cmd/app-build?name=SparkClassroomTeacher](https://spark-skeleton.matchbooklearning.com/sencha-cmd/app-build?name=SparkClassroomTeacher)
and then [spark-skeleton/sencha-cmd/app-build?name=SparkClassroomStudent](https://spark-skeleton.matchbooklearning.com/sencha-cmd/app-build?name=SparkClassroomStudent)

## Pull to School sites
1. Login as a developer at [merit-staging/app/EmergencePullTool](https://staging.spark.merit.matchbooklearning.com/app/EmergencePullTool/production/)
2. Press <kbd>Select all updated</kbd> and then <kbd>Pull remote versions</kbd>
3. Visit [merit-staging/site-admin/precache](https://staging.spark.merit.matchbooklearning.com/site-admin/precache), uncheck <code>sencha-workspace</code>, and click <kbd>Precache selected collections</kbd>
4. Login as a developer at [mta-staging/app/EmergencePullTool](https://staging.spark.mta.matchbooklearning.com/app/EmergencePullTool/production/)
5. Press <kbd>Select all updated</kbd> and then <kbd>Pull remote versions</kbd>
6. Visit [mta-staging/site-admin/precache](https://staging.spark.mta.matchbooklearning.com/site-admin/precache), uncheck <code>sencha-workspace</code>, and click <kbd>Precache selected collections</kbd>
7. Login as a developer at [merit-live/app/EmergencePullTool](https://spark.merit.matchbooklearning.com/app/EmergencePullTool/production/)
8. Press <kbd>Select all updated</kbd> and then <kbd>Pull remote versions</kbd>
9. Visit [merit-live/site-admin/precache](https://spark.merit.matchbooklearning.com/site-admin/precache), uncheck <code>sencha-workspace</code>, and click <kbd>Precache selected collections</kbd>
10. Login as a developer at [mta-live/app/EmergencePullTool](https://spark.mta.matchbooklearning.com/app/EmergencePullTool/production/)
11. Press <kbd>Select all updated</kbd> and then <kbd>Pull remote versions</kbd>
12. Visit [mta-live/site-admin/precache](https://spark.mta.matchbooklearning.com/site-admin/precache), uncheck <code>sencha-workspace</code>, and click <kbd>Precache selected collections</kbd>
