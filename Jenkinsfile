pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    parameters {
        booleanParam(name: 'SKIP_TESTS', defaultValue: true, description: 'Skip tests')
        string(
          name: 'PUBLISH_URL', defaultValue: 'https://nexus.valuya.be/nexus/repository',
          description: 'Deployment repository url'
        )
        string(
          name: 'PUBLISH_REPO', defaultValue: 'web-snapshots',
          description: 'Deployment repository'
        )
   }
    stages {
        stage ('Install') {
            steps {
                nodejs(nodeJSInstallationName: 'node 10', configId: 'npmrc-@charlyghislain') {
                    ansiColor('xterm') {
                    sh '''
                        rm -rfv dist*
                        npm install
                       '''
                    }
                }
            }
        }
        stage ('Build') {
            steps {
              withCredentials([usernameColonPassword(credentialsId: 'nexus-basic-auth', variable: 'NEXUS_BASIC_AUTH')]) {
              nodejs(nodeJSInstallationName: 'node 10', configId: 'npmrc-@charlyghislain') {  catchError {
                ansiColor('xterm') {
                  sh '''
                     export VERSION="$(./node_modules/.bin/json -f package.json version)"
                     export CONFIG="production"
                     echo "$VERSION" | grep "alpha|beta" && export CONFIG=''

                    ./node_modules/.bin/ng build -c "$CONFIG"
                  '''
                }
              }}}
            }
        }
        stage ('Publish') {
            steps {
                withCredentials([usernameColonPassword(credentialsId: 'nexus-basic-auth', variable: 'NEXUS_BASIC_AUTH')]) {
                  ansiColor('xterm') {
                     nodejs(nodeJSInstallationName: 'node 10', configId: 'npmrc-@charlyghislain') {
                         sh '''
                            export VERSION="$(./node_modules/.bin/json -f package.json version)"
                            export COMMIT="$(git rev-parse --short HEAD)"
                            echo "$VERSION" | grep "alpha|beta" && export VERSION="${VERSION}-${COMMIT}"

                            export ARCHIVE="authenticator-admin-front-${VERSION}.tgz"

                            # Compress
                            cd dist/auth-front/
                            tar  -cvzf ../${ARCHIVE} ./
                            cd ../../

                            # Upload archives
                            curl -v --user $NEXUS_BASIC_AUTH --upload-file dist/${ARCHIVE} \
                            ${PUBLISH_URL}/${PUBLISH_REPO}/com/charlyghislain/authenticator-admin-front/${ARCHIVE}

                            # Create .latest 'links' (branch heads) if required
                            if [ "${BRANCH_NAME}" = "master" ] ; then
                              export ARCHIVE_LINK="master.latest"
                              echo "$ARCHIVE" > ./${ARCHIVE_LINK}
                              curl -v --user $NEXUS_BASIC_AUTH --upload-file ./${ARCHIVE_LINK} \
                                ${PUBLISH_URL}/${PUBLISH_REPO}/com/charlyghislain/authenticator-admin-front/${ARCHIVE_LINK}

                            elif [ "${BRANCH_NAME}" = "dev" ] ; then
                              export ARCHIVE_LINK="dev.latest"
                              echo "$ARCHIVE" > ./${ARCHIVE_LINK}
                              curl -v --user $NEXUS_BASIC_AUTH --upload-file ./${ARCHIVE_LINK} \
                                ${PUBLISH_URL}/${PUBLISH_REPO}/com/charlyghislain/authenticator-admin-front/${ARCHIVE_LINK}
                            fi
                        '''
                     }
                  }
                }
            }
        }
    }
}
