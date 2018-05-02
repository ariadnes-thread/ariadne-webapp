#!/bin/bash

eval "$(ssh-agent -s)"
chmod 600 .travis/id_rsa
ssh-add .travis/id_rsa

ssh ${SSH_USER}@${SSH_HOST} <<EOF
	  cd ${DEPLOY_DIR}
	  git pull origin master && npm ci && npm run build
	EOF