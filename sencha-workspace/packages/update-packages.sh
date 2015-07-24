#!/bin/bash

for package in ./* ; do
    if [ -d "$package/.git" ]; then
        rm -rf "$package"
    fi
done

git submodule init
git submodule update

echo "Self destruct sequence activated"
echo "Do not use the update-packages.sh script, use git submodule update"

echo "update-packages.sh" >> .gitingore

rm update-packages.sh
