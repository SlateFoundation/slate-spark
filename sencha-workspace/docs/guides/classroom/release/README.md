# Releasing a New Version

New versions of the teacher and student apps must be merged into the `releases/v1` branch
and tagged with a [semantic version number](http://semver.org/) before being deployed to
production. The shared `spark-classroom` and `spark-theme` packages don't currently have
their own release or versioning process as each versioned release of `spark-classroom-teacher`
or `spark-classroom-student` comes with an exact commit it's intended to use for each shared package.



## Determining the Next Version Number
First, check a projects open and close pull requests to see what version was used for the last release,
and if a pull request is already open for the next one. To determine the next version, decide which
category this update falls into:

### Patch release
A minor release that adds no new feature and makes no backwards-incompatible transformations to
data structure or APIs. Only incremental improvements to performance, stability, or accuracy should be
made with narrow testing needed for verification. Expanding how many users are exposed to an existing
feature may also be done in a patch release.

*Increment the last number*

### Minor release
The featureset has changed, persistent data structures have been migrated to a new format, or
backwards-compatibility has been lost in an API. Most users will want to be upgraded to this
new release from the last minor release without needing to review or take any action.

*Increment the middle number, reset the last number to 0*

### Major release
Like a minor release, but with added weight to communicate a major milestone which users should
review and cross at their own pace.

*Increment the first number, reset other numbers to 0. Fork off a new `releases/vX` branch to
merge this release into*



## Release a New Version
1. Open pull request using `releases/v1` as the base branch and `develop` as the compare branch
2. Title the pull request in the format `Release: spark-classroom-teacher v0.9.2`
3. In the description for the pull request, build a bulletted list of changes that end-users
would be able to read and understand. Extend and refine this list if more commits are added to the pull
request before it gets closed. Reference specific issue #s where possible.
4. [Deployed and test the `develop` branch in the sandbox enviornment](#!/guide/classroom_deploy_sandbox)
5. Merge and close the release pull request
6. Create a release on GitHub against the `releases/v1` branch, copying the release notes drafted in the
pull request inot the body of the release description.
7. Fast-forward the `master` branch to the same commit as the `releases/v1` branch

It is best to open the pull request for the next version as early as possible so that the release notes
are easy to accumulate. Ideally a release pull request gets started as soon as the first commit gets
pushed after the last release, so it can serve as a central place to track and discuss the upcoming release.