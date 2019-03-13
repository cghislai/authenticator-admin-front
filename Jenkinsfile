pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    parameters {
        booleanParam(name: 'SKIP_TESTS', defaultValue: true, description: 'Skip tests')
        booleanParam(name: 'FORCE_DEPLOY', defaultValue: false, description: 'Force deploy on feature branches')
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

            when { allOf {
              anyOf {
                 environment name: 'BRANCH_NAME', value: 'master'
                 environment name: 'BRANCH_NAME', value: 'dev'
                 expression { return params.FORCE_DEPLOY == true }
              }
              expression { return currentBuild.result != 'FAILURE' }
             }}
            steps {
                withCredentials([string(credentialsId: 'github-cghislai-token', variable: 'SECRET')]) {
                  ansiColor('xterm') {
                     nodejs(nodeJSInstallationName: 'node 10', configId: 'npmrc-@charlyghislain') {
                         sh '''

                          VERSION="$(./node_modules/.bin/json -f package.json version)"
                          COMMIT="$(git rev-parse --short HEAD)"
                          FULLVERSION=$VERSION
                          PRERELEASE=false
                          echo "$VERSION" | grep 'alpha\\|beta' && export PRERELEASE=true
                          if [ "$PRERELEASE" = "true" ] ; then
                            FULLVERSION="${VERSION}-${COMMIT}"
                          fi

                          RELEASE_EXISTS=true
                          RELEASE_ASSETS_URL="$(curl -v -q \
                            -u cghislai:$SECRET \
                            https://api.github.com/repos/cghislai/authenticator-admin-front/releases/tags/v$VERSION \
                            | jq -r .upload_url || export RELEASE_EXISTS=FALSE)"
                          if [ "$RELEASE_ASSETS_URL" = "null"  ] ; then export  RELEASE_EXISTS=FALSE ; fi
                          if [ -z "$RELEASE_ASSETS_URL" ] ; then export  RELEASE_EXISTS=FALSE ; fi
                          if [ "$RELEASE_EXISTS" != "true" ] ; then

                            RELEASE_EXISTS=true

                            # Keep prerelease false so latest release point to it while still deployed
                            cat << EOF >./release.json
{\"tag_name\": \"v$VERSION\",
\"target_commitish\": \"$BRANCH_NAME\",
\"name\": \"$VERSION\",
\"body\": \"Release $VERSION\",
\"draft\": false,
\"prerelease\": false}
EOF
                            # create release if needed
                            RELEASE_ASSETS_URL=$(curl -v -H 'Content-Type: application/json' \
                              -u cghislai:$SECRET \
                              -d "$(cat ./release.json)" \
                              https://api.github.com/repos/cghislai/authenticator-admin-front/releases \
                              | jq -r .upload_url || export RELEASE_EXISTS=FALSE)
                            if [ "$RELEASE_ASSETS_URL" = "null"  ] ; then export  RELEASE_EXISTS=FALSE ; fi
                            if [ -z "$RELEASE_ASSETS_URL" ] ; then export  RELEASE_EXISTS=FALSE ; fi
                            if [ "$RELEASE_EXISTS" != "true" ] ; then exit 1 ; fi
                          fi


                          ARCHIVE="authenticator-admin-front-${FULLVERSION}.tgz"

                          ## FIXME: Workaround https://github.com/angular/angular-cli/issues/8515
                          sed -i 's#/ngsw-worker.js#./ngsw-worker.js#' dist/auth-front/main.*.js

                          # Compress
                          cd dist/auth-front/
                          tar  -cvzf ../${ARCHIVE} ./
                          cd ../../

                          UPLOAD_URL=$(echo "$RELEASE_ASSETS_URL" | sed "s/{?name,label}//")
                          LABEL="${ARCHIVE}%20$BRANCH_NAME%20release"
                          # Upload archive as github release asset
                          ARCHIVE_URL=$(curl -v -X POST \
                              -H 'Content-Type: application/x-gzip' \
                              -u cghislai:$SECRET \
                              --data-binary @dist/${ARCHIVE} \
                              "${UPLOAD_URL}?name=${ARCHIVE}&label=$LABEL" \
                              | jq -r .browser_download_url)
                          if [ "$ARCHIVE_URL" = "null"  ] ; then exit 1 ; fi
                          if [ -z "$ARCHIVE_URL" ] ; then exit 1 ; fi

                         '''
                     }
                  }
                }
            }
        }
    }
}
