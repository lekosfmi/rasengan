.PHONY: install deploy

deploy:
	git push origin master
	git push heroku master
