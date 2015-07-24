#!/bin/bash

echo "Self-destructing"
echo "clone the repository with --recursive or run git submodule init && git submodule add"
git submodule init
git submodule update

echo "get-packages.sh" >> .gitingore
rm update-packages.sh
