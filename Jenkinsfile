pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  parameters {
    string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build from')
    string(name: 'STUDENT_NAME', defaultValue: 'your name', description: 'Provide your name here, no name, no marks')
    choice(name: 'ENVIRONMENT', choices: ['dev', 'qa', 'prod'], description: 'Select environment')
    booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run Jest tests after build')
  }

  environment {
    APP_VERSION = "1.0.${BUILD_NUMBER}"
    MAINTAINER = 'Student'
  }

  options {
    skipDefaultCheckout(true)
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        echo "Checking out branch: ${params.BRANCH_NAME}"
        checkout scm
        sh "git fetch --all --prune && git checkout ${params.BRANCH_NAME} && git pull --ff-only || true"
      }
    }

    stage('Install Dependencies') {
      steps {
        echo "Installing required packages as ${STUDENT_NAME}..."
        sh 'npm ci || npm install'
      }
    }

    stage('Build') {
      steps {
        echo "Building version ${APP_VERSION} for ${params.ENVIRONMENT} environment"
        sh '''
          set -e
          echo "Simulating build process..."
          mkdir -p build
          cp -f *.js build/ 2>/dev/null || true
          [ -d src ] && cp -R src build/src || true
          cp -f package.json build/ 2>/dev/null || true
          echo "Build completed successfully!"
          echo "App version: ${APP_VERSION}" > build/version.txt
        '''
      }
    }

    stage('Test') {
      when { expression { return params.RUN_TESTS } }
      steps {
        echo 'Running Jest tests...'
        sh 'npm test --silent'
      }
    }

    stage('Package') {
      steps {
        echo "Creating zip archive for version ${APP_VERSION}"
        sh 'rm -f build_*.zip && zip -qr build_${APP_VERSION}.zip build'
      }
    }

    stage('Deploy (Simulation)') {
      steps {
        echo "Simulating deployment of version ${APP_VERSION} to ${params.ENVIRONMENT}"
      }
    }
  }

  post {
    always {
      echo 'Cleaning up workspace...'
      deleteDir()
    }
    success {
      echo "Pipeline succeeded! Version ${APP_VERSION} built and tested."
    }
    failure {
      echo 'Pipeline failed! Check console output for details.'
    }
  }
}
