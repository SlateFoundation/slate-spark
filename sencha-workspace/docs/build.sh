#!/bin/bash

jsduck \
    --processes=0 \
    ../packages/spark-classroom/src \
    ../packages/spark-theme/src \
    ../SparkClassroomTeacher/app \
    ../SparkClassroomStudent/app \
    --output ../build/docs \
    --guides guides.json