clean:
	rm -r _site

_site:
	jekyll build

update: _site
	rsync -avz --del _site/ david@supr.nu:/www/vidbina/

reload: clean update
