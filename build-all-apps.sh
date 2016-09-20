#!/bin/bash
cd sencha-workspace

cd SparkClassroomTeacher
sencha app build

cd ../SparkClassroomStudent
sencha app build
