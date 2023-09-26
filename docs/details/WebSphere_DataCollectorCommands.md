# Using the Transformation Advisor Data Collector

 - The Transformation Advisor Data Collector (or DC for short) is used to collect information about all the Java applications in your estate
 - You can download the DC from the Transformation Advisor UI
 - It generates analysis for going to all three migration targets: WebSphere Liberty, Open Liberty, tWAS Base in Containers
 - It will generate a zip file for each WebSphere profile (or runtime equivalent) found and also one zip file for each shared library found
   - When scanning WebLogic, JBoss or Tomcat shared libraries will not be detected
 - These will be automatically uploaded to Transformation Advisor if an upload path is found
 - If not then you will need to upload them via the [UI](https://ibm.github.io/app-mod-journey/details/uploadResultsManually) or in [bulk](https://ibm.github.io/app-mod-journey/details/bulkUploadResults)

## WebSphere Application Server

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

## Weblogic 

### WebLogic outside location

./bin/transformationadvisor --web-logic-apps-location WebLogic_APPS_location

./bin/transformationadvisor -g WebLogic_Apps_location

### WebLogic config

./bin/transformationadvisor --web-logic-config-file Path_of_the_config.xml_file

./bin/transformationadvisor -l Path_of_the_config.xml_file

## JBoss

### JBoss outside location

./bin/transformationadvisor --jboss-apps-location JBoss_Apps_location

./bin/transformationadvisor -b JBoss_APPS_location

### JBoss config

./bin/transformationadvisor --jboss-config-dir Directory_of_JBoss_Configuration 

./bin/transformationadvisor -j Directory_of_JBoss_Configuration

## Tomcat

### Tomcat outside location

./bin/transformationadvisor --tomcat-apps-location Tomcat_Apps_location

./bin/transformationadvisor -c Tomcat_Apps_location

### Tomcat config

./bin/transformationadvisor --tomcat-home-dir Path_of_the_Tomcat_Home_directory

./bin/transformationadvisor -t Path_of_the_Tomcat_Home_directory


