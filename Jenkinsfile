pipeline {
  agent { label 'built-in' }

  tools {
    nodejs 'node_v16'
  }

  stages {
    stage('SCM') {
      steps {
        checkout scm
      }
    }

    stage('build') {
      steps {
        sh 'npm install -g pnpm@8.3.1'
        sh 'pnpm install'
        sh 'pnpm run build'
        archiveArtifacts artifacts: 'apps/admin/dist/**', fingerprint: true
      }
    }

    stage('deploy') {
      agent { label 'ds2' }
      steps {
        copyArtifacts filter: 'apps/admin/dist/**', fingerprintArtifacts: true, projectName: env.JOB_NAME, selector: specific ('${BUILD_NUMBER}')
        sh 'rm -rf /var/www/vosint4'
        sh 'mkdir -p /var/www/vosint4'
        sh 'scp -r apps/admin/dist/. /var/www/vosint4'
      }
    }
  }
}
