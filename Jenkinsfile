pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '7'))
  }

  triggers {
    cron('H H/24 * * *')
  }

  stages {
    stage('Staging') {
      agent { docker { image 'node:12-alpine'; args '-u root' } }

      environment {
        MP_URL = "https://documentation-staging.staging.oregon.platform-os.com"
      }

      when {
        branch 'master'
      }

      steps {
        sh 'bash -l ./scripts/test.sh'
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
          slackSend (channel: "#notifications-docs", color: '#FF0000', message: "FAILED: ${testOutput}\n<${env.BUILD_URL}|Build details>")
        }
      }
    }
  }
}
