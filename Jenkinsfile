pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/devashishmudigonda/Portfolio-Manager.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }
        
        stage('Stop Previous Application') {
            steps {
                script {
                    bat 'pm2 delete all || exit 0'
                }
            }
        }
        
        stage('Deploy with PM2') {
            steps {
                bat 'pm2 start ecosystem.config.js'
                bat 'pm2 save'
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sleep(time: 5, unit: 'SECONDS')
                    bat 'curl -f http://localhost:3001/api/portfolio'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
            bat 'pm2 status'
        }
        failure {
            echo 'Deployment failed!'
            bat 'pm2 logs --lines 20'
        }
    }
}