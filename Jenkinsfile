pipeline {
    options {
        timeout(time: 12, unit: 'MINUTES')
    }
    agent any

    stages{
        stage("install") {
            steps {
                script{
                    sh "yarn config set registry https://registry.npm.taobao.org/"
                    sh "yarn install"
                }
            }
        }
    
        stage("build") {
            steps {
                script{
                    sh "yarn build"
                }
            }
        }
    
        stage("publish") {
            steps {
                script {
                    sh "rm -rf /home/smart-iot-frontend/*"
                    sh "cp -r dist /home/smart-iot-frontend"
                }
            }
        }
    }
}
