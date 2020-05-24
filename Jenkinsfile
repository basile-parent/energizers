pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Log env') {
            steps {
                sh 'env'
            }
        }
        stage('Build websocket node application') {
            environment {
                PORT=3330
                JENKINS_JOB_NAME="energizers"
                FOLDER_NAME="websocket"
                CONTAINER_TAG="node-energizer-websocket"
                CONTAINER_NAME="websocket-energizer"
            }
            steps {
                sh 'chmod +x ./build-node.sh'
                sh "./build-node.sh $JENKINS_JOB_NAME $FOLDER_NAME $WORKSPACE $CONTAINER_TAG"

                sh "docker_stop $CONTAINER_NAME"
                sh "docker run -d -p $PORT:3000 --link postgres -v /tmp:/tmp --name $CONTAINER_NAME $CONTAINER_TAG"
            }
        }
    }
}