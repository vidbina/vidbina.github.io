DOCKER=docker
#IMAGE=ruby:2.4-alpine
IMAGE=vidbina:develop
ENV=--env-file .env
SERVE=-P #--expose=4000 -p 127.0.0.1:8080:4000 #-P #-p 4000/tcp

image:
	${DOCKER} build . -t ${IMAGE}

shell:
	${DOCKER} run --rm -it -p 4000:4000 -v ${PWD}:/src -w /src ${IMAGE} /bin/sh

server:
	${DOCKER} run --rm -it -p 4000:4000 -v ${PWD}:/src -w /src ${ENV} ${SERVE} ${IMAGE} rake site:serve

server-dev:
	${DOCKER} run --rm -it -p 4000:4000 -v ${PWD}:/src -w /src ${IMAGE} rake site:review

nginx:
	${DOCKER} run --rm -v ${PWD}/_site:/usr/share/nginx/html:ro --name vidbina.nginx -p 8080:80 -d nginx

.PHONY: \
	image
	nginx
	shell
	server
	server-dev
