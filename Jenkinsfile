pipeline {
    options {
        timeout(time: 12, unit: 'MINUTES')
    }
    agent any

    parameters {
            booleanParam(name: 'FAST_MODE', defaultValue: false, description: '此操作将会跳过单元测试以及代码质量检查。')
    }

    stages {
        stage('prepare') {
            steps {
                script {
                    echo "开始构建"
                    if(!env.BRANCH_NAME == 'master' && !env.BRANCH_NAME == 'dev'){
                        error("当前分支名称为: ${env.BRANCH_NAME}")
                    }

                    if (env.BRANCH_NAME == 'master' ) {
                        env.env = "release"
                    }
                    if (env.BRANCH_NAME == 'dev') {
                        env.env = "dev"
                    }

                    sh "echo 当前分支 : ${env.BRANCH_NAME}"
                    sh "echo 当前环境 : ${env.env}"
                    sh "echo 当前提交 : ${env.commit}"
                    sh "echo WORKSPACE : ${env.WORKSPACE}"
                    sh "echo GIT_BRANCH : ${env.GIT_BRANCH}"
                    sh "echo BUILD_NUMBER : ${env.BUILD_NUMBER}"
                    sh "echo JOB_NAME : ${env.JOB_NAME}"
                }
            }
        }

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
                    if(env.env == "release"){
                        sh "rm -rf /home/smart-iot-frontend/*"
                        sh "cp -r dist /home/smart-iot-frontend"
                    }
                    if(env.env == "dev"){
                        sh "rm -rf /home/smart-iot-frontend-dev/*"
                        sh "cp -r dist /home/smart-iot-frontend-dev"
                    }
                }
            }
        }
    }
}