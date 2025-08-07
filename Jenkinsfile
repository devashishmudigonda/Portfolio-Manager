pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git url: 'https://github.com/devashishmudigonda/Portfolio-Manager.git', branch: 'main'
            }
        }

        stage('Setup NodeJS') {
            steps {
                script {
                    def nodeHome = tool name: 'NodeJS_24', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodeHome}\\bin;${env.PATH}"
                }
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'npm install -g pm2'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Start Application with PM2') {
            when {
                beforeInput true
                expression { currentBuild.currentResult == 'SUCCESS' }
            }
            steps {
                bat 'pm2 delete backend || exit 0'
                bat 'pm2 start ecosystem.config.js'
            }
        }
    }

    post {
        always {
            bat 'pm2 save --force'
            echo '🧹 PM2 state saved.'
        }
        success {
            echo '✅ Build successful and servers running via PM2!'
        }
        failure {
            echo '❌ Build failed.'
        }
    }
}