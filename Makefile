DOCKER=docker
#IMAGE=ruby:2.4-alpine
IMAGE=vidbina:develop
ENV=--env-file .env
SERVE=-P #--expose=4000 -p 127.0.0.1:8080:4000 #-P #-p 4000/tcp
RM=rm -rf

image:
	${DOCKER} build . -t ${IMAGE}

shell:
	${DOCKER} run --rm -it -p 4000:4000 -v ${PWD}:/src -w /src ${IMAGE} /bin/bash

server:
	${RM} _site
	${DOCKER} run --rm -it -p 4000:4000 -v ${PWD}:/src -w /src ${ENV} ${SERVE} ${IMAGE} rake site:server

server-dev:
	${RM} _site
	${DOCKER} run --rm -it -p 4000:4000 -v ${PWD}:/src -w /src ${IMAGE} rake site:serve

nginx:
	${DOCKER} run --rm -v ${PWD}/_site:/usr/share/nginx/html:ro --name vidbina.nginx -p 8080:80 -d nginx

mathjax:
	git clone https://github.com/mathjax/MathJax.git js/MathJax


.PHONY: \
	image
	nginx
	shell
	server
	server-dev
