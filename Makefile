# Reference commands for publishing.

GITHUB_PROJECT_NAME="iccm-eu-2020"

all:
	ng build --prod --output-path docs --base-href /$(GITHUB_PROJECT_NAME)
	cp docs/index.html docs/404.html
	# configure github project to publish from docs folder:
	# https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch
	# make project available at https://<user_name>.github.io/<project_name>/

