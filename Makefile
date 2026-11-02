IMAGE=ruby:3.3
GITHUB_PAGES=232
DOCKER_FLAGS?=-it

# Builds as GitHub Pages does and serves on http://localhost:4000.
# Rebuilds only on restart.
preview:
	docker run --rm ${DOCKER_FLAGS} -p 4000:4000 -v ${PWD}:/src:ro -w /src \
		-e PAGES_REPO_NWO=vidbina/vidbina.github.io ${IMAGE} sh -c '\
		gem install github-pages -v ${GITHUB_PAGES} --no-document --silent && \
		github-pages build --destination /tmp/_site && \
		ruby -run -ehttpd /tmp/_site -b0.0.0.0 -p4000'

mathjax:
	git submodule update --init js/MathJax

.PHONY: \
	preview \
	mathjax
