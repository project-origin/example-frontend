


dev:
	docker build -t projectorigin/example-frontend:dev .
	helm install example-frontend ./chart --namespace=project-origin --set tag=dev