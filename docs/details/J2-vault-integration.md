
***

Vault is a popular open-source tool developed by HashiCorp that provides a secure and centralized solution for managing secrets, such as API keys, passwords, and database credentials. It offers a secure storage system, access control, and encryption mechanisms to protect sensitive information.

This tutorial will provide step by step guide about how to use vault to store your sensitive data and how to integrate vault during the deployment of Liberty docker image in OpenShift.

For this tutorial, it is running on RHEL 8.  The application will use a data source to connect to a DB2 server.  The credential to connect to DB2 server will be stored in a vault server.  We will use the OpenLiberty Operator to deploy the docker image to OpenShift.

## Step 1: Set up Vault

- install helm command
  We use helm command to install vault on the OCP, make sure helm is installed on your local machine.  If not you can use the following command to install helm
```
curl -L https://mirror.openshift.com/pub/openshift-v4/clients/helm/latest/helm-linux-amd64 -o /usr/local/bin/helm
chmod 777 /usr/local/bin/helm
```
Invoke the following command to verify the helm installation.
```
helm version
```


- update hashicorp helm repository
```
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
```

- logon to your OCP environment.
```
oc login --token=sha256~....... --server=https://......:6443
```

Create a new project
```
oc new-project ta-test
```

- install vault server using dev mode.
```
helm install vault hashicorp/vault  --set "global.openshift=true" --set "server.dev.enabled=true"
```

- check the vault server deployment
```
oc get pods
```
```
NAME                            READY   STATUS    RESTARTS   AGE
vault-0                         1/1     Running   0          43s
vault-agent-injector-......     1/1     Running   0          43s
```

## Step 2: Create a Secret in Vault

Use the Vault CLI or API to create a secret that you want to integrate into your OpenShift deployment. In here we  create a secret for a database connection string.

- logon to the vault container
```
oc exec -it vault-0 -- /bin/sh
```
In this tutorial we will use  Key/Value version2 secrets engine in vault server and store arbitrary secrets in path `db2app/`. All secrets that have the path prefix `db2app/` will use that secrets engine to store, generate and encrypt secrets.

```
/ $ vault secrets enable -path=db2app kv-v2
Success! Enabled the kv-v2 secrets engine at: db2app/
```
The specific DB2 connection credentials will be stored in path `db2app/db2/credentials`
```
/ $ vault kv put db2app/db2/credentials username="db2inst1" password="db2inst1"
======= Secret Path =======
db2app/data/db2/credentials

======= Metadata =======
Key                Value
---                -----
created_time       2023-06-08T14:39:38.697238712Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
/ $ vault kv get db2app/db2/credentials
======= Secret Path =======
db2app/data/db2/credentials

======= Metadata =======
Key                Value
---                -----
created_time       2023-06-08T14:39:38.697238712Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1

====== Data ======
Key         Value
---         -----
password    db2inst1
username    db2inst1
/ $ 
```

## Step 3: Configure Vault Authentication

Set up authentication methods in Vault that your OpenShift cluster can use to authenticate and access secrets.

In this tutorial we use  Kubernetes authentication, which leverages OpenShift's service account tokens to perform the authentication.

During deployment, a token for a pod’s service account will automatically be mounted within a pod and it will sent to Vault for authentication. Vault is configured with a service account that has permissions to access the TokenReview API.  This service account can then be used to make authenticated calls to Kubernetes to verify tokens of the service accounts of pods that want to connect to Vault to get secrets.

```
/ $ vault auth enable kubernetes
Success! Enabled kubernetes auth method at: kubernetes/
/ $ vault write auth/kubernetes/config token_reviewer_jwt="$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)" kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443" kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt
Success! Data written to: auth/kubernetes/config
```

## Step 4: Configure Vault Policies

Define Vault policies that specify which secrets and operations are allowed for your OpenShift cluster.

For example, you might create a policy that allows read access to the database connection string secret, but restricts write access.
In this example, `db2-app-policy` is your policy name and `db2app/data/db2/credentials` is the path for your secrets stored in Vault.

```
vault policy write db2-app-policy - <<EOF
path "db2app/data/db2/credentials" {
  capabilities = ["read"]
}
EOF
```

## Step 5: Create authentication role for a Service Account in OpenShift

Create an authentication role which contains the name space and service account information which will be used in your deployment in OpenShift

In this example,
* `db2-app-role` is the role name which will be used later in the deployment time.
* `db2-app-policy` is the policy name you created in step 4,
* `ta-test` is the name of the project on OpenShift which you will deploy your application to.
* `db2app1war` is the service account name of your new deployment, if you use Liberty Operator to do the deployment, the operator will automatically create a ServiceAccount resource.  If .spec.serviceAccountName is not specified in an application-CR file, the operator creates a service account with the same name as the CR.
```
vault write auth/kubernetes/role/db2-app-role \
  bound_service_account_names=db2app1war \
  bound_service_account_namespaces=ta-test \
  policies=db2-app-policy \
  ttl=24h
```

## Step 6: Modify the migration artifacts generated by  Transformation Advisor server

1. Download the migration bundle from Transformation Advisor for your application,  and unzip it.

2. replace the place holder file with your real application binary file

3. build the image

4. push application image to a repository

For detail instructions you can check [here](https://www.ibm.com/docs/en/cta?topic=ma-how-deploy-your-app-red-hat-openshift-container-platform)

5. modify the  `base/application-cr.yaml` file  
   a. Change to the kustomize directory in `<MIGRATION_ARTIFACTS_HOME>`:

    ```
    cd <MIGRATION_ARTIFACTS_HOME>/deploy/kustomize
    ```

   b. Update the IMAGE_REFERENCE in the `base/application-cr.yaml` file to match the application image you pushed before.

   c. remove the `volumeMounts` and `volumes` section

   d. Add agent inject annotation in the metadata section
```
metadata:
  name: db2app1war
  annotations: 
    vault.hashicorp.com/agent-inject: "true"           
    vault.hashicorp.com/secret-volume-path: "/config/variables"     
    # the following vault agent config values are based on the previous setting on vault server
    vault.hashicorp.com/role: "db2-app-role"                
    vault.hashicorp.com/agent-inject-secret-db2_user: "db2app/data/db2/credentials"    
    vault.hashicorp.com/agent-inject-file-db2_user: "ghettoes1Node04_db2_user"                             
    vault.hashicorp.com/agent-inject-template-db2_user: |
      {{- with secret "db2app/data/db2/credentials" -}}
      {{ .Data.data.username }}
      {{- end -}}      
    vault.hashicorp.com/agent-inject-secret-db2_password: "db2app/data/db2/credentials"  
    vault.hashicorp.com/agent-inject-file-db2_password: "ghettoes1Node04_db2_password"                               
    vault.hashicorp.com/agent-inject-template-db2_password: |
      {{- with secret "db2app/data/db2/credentials" -}}
      {{ .Data.data.password }}
      {{- end -}}                  
```

In here,
* `db2-app-role` is the role name you defined in vault server in step 5.
* `secret-db2_user` indicates to inject a secret with name as `db2_user` which comes from vault server with path as `db2app/data/db2/credentials`.
* `file-db2_password` means it will write the content of that secret to a file with filename `ghettoes1Node04_db2_password` under the `secret-volume-path` directory in the container, the value of the `file-db2_password` should be the variable name of a sensitive data (which has no default value defined) existed in the server.xml file
* `template-db2_user` configures the template that vault agent should use for rendering a secret.

6. remove the secret creation step

   a. open the `kustomization.yaml` file in the `overlays/dev` directory

   b. delete the these 2 lines
   ```
   resources:
     - db2app1war-secret.yaml
   ```


## Step 7: Deploy the Application

Deploy your application to OpenShift using the modified deployment configuration file.
Vault agent will mount the secret under the `/config/variables` directory and liberty server will get the value of these secrets in runtime.

- Deploy the application using `apply -k` command to specify a directory containing kustomization.yaml:
    ```
    oc apply -k overlays/dev
    ```
- You can view the status of your deployment by running oc get deployments. If you don't see the status after a few minutes, query the pods and then fetch the Liberty pod logs:
    ```
    oc get pods 
    ```
    ```
    NAME                                      READY   STATUS        RESTARTS   AGE
    db2app1-757bd94fbd-p4jqs                  2/2     Running       0          7s
    ```
    ```
    oc logs <pod>
    ``` 

## Step 8: Verify

You can logon to the running liberty container, under the `/config/variables/` directory,  2 secrets which are define in vault server are created.
Liberty server will export these secrets as environment variables and your application will be able to use it at runtime.


```
sh-4.4$ cd /config/variables/
sh-4.4$ ls -l
total 8
-rw-r--r--. 1 1000700000 1000700000 8 Jun  8 20:50 ghettoes1Node04_db2_password
-rw-r--r--. 1 1000700000 1000700000 8 Jun  8 20:50 ghettoes1Node04_db2_user
h-4.4$ cat ghettoes1node04_db2_user
db2inst1
sh-4.4$ 
```

You can now access your application by navigating to the `Networking...Routes` UI in OpenShift and selecting the namespace where you deployed.

That's it! You have successfully integrated secrets from Vault during the deployment of an image in OpenShift.
***
