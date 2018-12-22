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

      environment {
        MP_URL = "https://documentation-staging.staging.oregon.platform-os.com"
      }

      when {
        branch 'master'
      }

      steps {
        sh 'bash -l ./scripts/install.sh'
        sh 'bash -l ./scripts/test.sh'
      }

      post {
        success {
          script {
            testOutput = sh(returnStdout: true, script: 'cat test-summary.txt').trim()
          }
          slackSend (channel: "#pawel-test", color: '#00FF00', message: "SUCCESS: There are no broken links on staging.\n${testOutput}")
        }

        failure {
          script {
            testOutput = sh(returnStdout: true, script: 'cat test-summary.txt').trim()
          }
          slackSend (channel: "#pawel-test", color: '#FF0000', message: "FAILED: Found broken links on staging (<${env.BUILD_URL}|Open details>)\n${testOutput}")
        }
      }
    }
  }
}
