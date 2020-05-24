#!/usr/bin/env bash

set -x
set -e

JENKINS_HOME="/var/jenkins_home"
JENKINS_JOB_NAME=$1
APPLICATION_NAME=$2
WORKSPACE=$3

EXPORT_APP_NAME=$JENKINS_JOB_NAME/$APPLICATION_NAME
EXPORT_FOLDER=$JENKINS_HOME/export_react_builds/$EXPORT_APP_NAME

# Create and clear destination folder
mkdir -p $EXPORT_FOLDER
rm -rf $EXPORT_FOLDER/*

# Copy sources
cp -r $WORKSPACE/front/$APPLICATION_NAME/* $EXPORT_FOLDER

# Copy configuration
cp -r /opt/configuration/energizers/$APPLICATION_NAME-constants.js $EXPORT_FOLDER/js/constants.js

set +x