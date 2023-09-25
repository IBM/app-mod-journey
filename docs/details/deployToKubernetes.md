# Deploy a Simple application to Kubernetes

 - The full instructions for creating an image and then deploying to OpenShift can be found [here](https://www.ibm.com/docs/en/cta?topic=ma-how-deploy-your-app-red-hat-openshift-container-platform)
 - However, you may not be deploying to OpenShift using Operators
 - In that case Transformation Advisor still provides accelerators to assist with deployment to Kubernetes
 - Within the migration plan look at the following location **deploy > k8s** to find the accelerators
   - **service.yaml**: Create teh necessary services
   - **route.yaml**: Create the route to the deployment
   - **deployment.yaml**: Execute the deployment
