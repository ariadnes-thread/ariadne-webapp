#!/bin/bash

echo "Deploying app to server."
pwd 
eval "$(ssh-agent -s)"
chmod 600 .travis/id_rsa
ssh-add .travis/id_rsa

ssh -tt ${SSH_USER}@${SSH_HOST} <<-EOF
	cd ${DEPLOY_DIR}
	git pull origin master && npm ci && npm run build
	exit
EOF