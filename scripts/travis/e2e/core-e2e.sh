#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

CONTEXT_ENV="core"

./scripts/git-util/check-branch-updated.sh -b $TRAVIS_BRANCH || exit 1;

AFFECTED_LIBS="$(./scripts/affected-libs.sh -gnu -b $TRAVIS_BRANCH)";
AFFECTED_E2E="$(./scripts/git-util/affected-folder.sh -b $TRAVIS_BRANCH -f "e2e/$CONTEXT_ENV")";

RUN_CHECK_PS=$(echo node ./scripts/check-env/check-ps-env.js --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1 )
RUN_CHECK_CS=$(echo node ./scripts/check-env/check-cs-env.js --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1 )
RUN_E2E=$(echo ./scripts/test-e2e-lib.sh -host http://localhost:4200 -proxy "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" -e "$E2E_EMAIL" -save --use-dist -b )


if [[ $AFFECTED_LIBS =~ "$CONTEXT_ENV$" || $TRAVIS_PULL_REQUEST == "false"  ]];
then
    $RUN_CHECK_PS
    $RUN_CHECK_CS
    $RUN_E2E --folder $CONTEXT_ENV
else if [[ $AFFECTED_E2E = "e2e/$CONTEXT_ENV" ]];
    then
        HEAD_SHA_BRANCH="$(git merge-base origin/$TRAVIS_BRANCH HEAD)"
        LIST_SPECS="$(git diff --name-only $HEAD_SHA_BRANCH HEAD | grep "^e2e/$CONTEXT_ENV" | paste -sd , -)"
        if [[ $LIST_SPECS != "" ]];
        then
            echo "Run $CONTEXT_ENV e2e based on the sha $HEAD_SHA_BRANCH with the specs: "$LIST_SPECS
            $RUN_CHECK_PS
            $RUN_CHECK_CS
            $RUN_E2E --specs "$LIST_SPECS"
        fi
    fi
fi;