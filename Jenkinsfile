pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '7'))
  }

  triggers {
    // cron('H H/24 * * *')
  }

  stages {
    stage('Staging') {
      agent { docker { image 'node:12-alpine'; args '-u root' } }

      environment {
        MP_URL = "https://documentation.platformos.com"
      }

      when {
        branch 'master'
      }

      steps {
        sh 'npm ci'
        sh 'sh ./scripts/test.sh'
      }

      post {
        success {
          script {
            testOutput = sh(returnStdout: true, script: 'cat test-summary.txt').trim()
          }
          slackSend (channel: "#notifications-docs", color: '#00FF00', message: "SUCCESS: ${testOutput}")
        }

        failure {
          script {
            testOutput = sh(returnStdout: true, script: 'cat test-summary.txt').trim()
          }
          slackSend (channel: "#notifications-docs", color: '#FF0000', message: "FAILED: \n${testOutput}\n<${env.BUILD_URL}|Build details>")
        }
      }
    }
  }
}
