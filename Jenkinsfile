pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    buildDiscarder(logRotator(daysToKeepStr: '30', artifactDaysToKeepStr: '7'))
  }

  stages {
    stage('Staging') {
      agent { docker { image 'node:12-alpine'; args '-u root' } }

      environment {
        MP_URL = "https://pawel-docs.staging.oregon.platform-os.com/"
      }

      when {
        branch 'dev'
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
          slackSend (channel: "#pawel-test", color: '#00FF00', message: "SUCCESS: ${testOutput}")
        }

        failure {
          script {
            testOutput = sh(returnStdout: true, script: 'cat test-summary.txt').trim()
          }
          slackSend (channel: "#pawel-test", color: '#FF0000', message: "FAILED: \n${testOutput}\n<${env.BUILD_URL}|Build details>")
        }
      }
    }
  }
}
