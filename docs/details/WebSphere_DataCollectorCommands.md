### Scan a WebSphere Application Server Profile


./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME

./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME -p PROFILE_NAME

### Scan a WebSphere Application Server and all profiles


./bin/transformationadvisor -w WEBSPHERE_HOME_DIR

### Scan a WebSphere Application Server Profile and don't upload to Transformation Advisor


./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --no-upload

### Scan a WebSphere Application Server Profile and Transformation Advisor will skip the specified applications


./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --skip-applications  app1 app2 app3

### Scan a WebSphere Application Server Profile and Transformation Advisor will skip the specified applications that are listed in a file


./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --skip-applications-file /tmp/applicationsToSkip.txt

### Scan a WebSphere Application Server Profile and Transformation Advisor will only scan the specified applications


./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --applications  app1 app2 app3

### Scan a WebSphere Application Server Profile and Transformation Advisor will only scan the specified applications that are listed in a file


./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --applications-file /tmp/applicationsToScan.txt


### Scan a WebSphere Application Server Profile and allow scan to continue for applications with non existent shared Library

./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --ignore-missing-shared-library

### Scan a WebSphere Application Server Profile and allow scan to continue for applications that do not have binary files

./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --ignore-missing-binary

### Scan a WebSphere Application Server Profile and Transformation Advisor will create a collection name specified

./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --collection-name name1

### Scan a WebSphere Application Server Profile and specify the Transformation Advisor java

./bin/transformationadvisor -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --java-home jre

### Scan a WebSphere Applications outside of WebSphere Home directory

./bin/transformationadvisor -o OUTSIDE_LOCATION

