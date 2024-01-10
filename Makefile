# Reference commands for publishing.

# Subdirectory including trailing /
TARGET_SUBDIR=dev/
# project name within https://<your-account>.github.io/GITHUB_PROJECT_NAME
GITHUB_PROJECT_NAME=iccm-eu-schedule/$(TARGET_SUBDIR)
# Also update the spreadsheet ID in src/app/data/spreadsheetIDs.ts

all:
	npm run build -- --configuration production --output-path docs/$(TARGET_SUBDIR) --base-href /$(GITHUB_PROJECT_NAME)
	cp docs/index.html docs/404.html
	# Omit Test Data
	-rm -f docs/assets/sheet-export.json
	# install bof display pages
	cp -r bof/ docs/
	@echo
	@echo "Configure github project to publish from docs folder:"
	@echo "https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch"
	@echo "make project available at https://<user_name>.github.io/$(GITHUB_PROJECT_NAME)"

npm-install:
	npm install

update-packages:
	npm audit fix

update-angular:
	npm run ng update

serve:
	npm run serve
