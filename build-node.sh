#!/usr/bin/env bash

set -x
set -e

JENKINS_HOME="/var/jenkins_home"
JENKINS_JOB_NAME=$1
APPLICATION_NAME=$2
WORKSPACE=$3
NODE_IMAGE_NAME=$4

EXPORT_APP_NAME=$JENKINS_JOB_NAME-$APPLICATION_NAME
EXPORT_FOLDER=$JENKINS_HOME/export_node_sources/apps/$EXPORT_APP_NAME

# Create and clear destination folder
mkdir -p $EXPORT_FOLDER
rm -rf $EXPORT_FOLDER/*

# Copy sources
cp -r $WORKSPACE/back/$APPLICATION_NAME/* $EXPORT_FOLDER
# Delete build
rm -rf $EXPORT_FOLDER/node_modules/

# Copy Dockerfile
cp $WORKSPACE/Dockerfile-node $EXPORT_FOLDER/Dockerfile

# Build application
cd $EXPORT_FOLDER
docker build -t $NODE_IMAGE_NAME --build-arg APP_NAME=$APPLICATION_NAME .

set +x