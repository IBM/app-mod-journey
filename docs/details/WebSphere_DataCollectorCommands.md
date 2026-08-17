# How to collect data

The data collector in Application Modernization Accelerator gathers configuration and application information from supported middleware environments to generate detailed modernization assessments.

Take one of the following approaches to collect data for Application Modernization Accelerator.

- [Using the Discovery Tool](#using-the-discovery-tool)
- [Using the built-in WSADMIN command for WebSphere Application Server](#using-the-built-in-wsadmin-command)

## Using the Discovery Tool

 - The Discovery Tool is used to collect information about all the Java applications in your estate
 - You can download the Discovery Tool from the Application Modernization Accelerator UI
 - It generates analysis for going to all three migration targets: WebSphere Liberty, Open Liberty, tWAS Base in Containers
 - It will generate a zip file for each WebSphere profile (or runtime equivalent) found and also one zip file for each shared library found
   - When scanning WebLogic, JBoss or Tomcat shared libraries will not be detected
 - These will be automatically uploaded to Application Modernization Accelerator if an upload path is found
 - If not then you will need to upload them via the [UI](https://ibm.github.io/app-mod-journey/details/uploadResultsManually) or in [bulk](https://ibm.github.io/app-mod-journey/details/bulkUploadResults)

## WebSphere Application Server

### Scan a WebSphere Application Server Profile

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME`

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME -p PROFILE_NAME`

### Scan a WebSphere Application Server and all profiles

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR`

### Scan a WebSphere Application Server Profile and don't upload to Application Modernization Accelerator

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --no-upload`

### Scan a WebSphere Application Server Profile and skip the specified applications

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --skip-applications app1 app2 app3`

### Scan a WebSphere Application Server Profile and skip the specified applications that are listed in a file

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --skip-applications-file /tmp/applicationsToSkip.txt`

### Scan a WebSphere Application Server Profile and only scan the specified applications

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --applications app1 app2 app3`

### Scan a WebSphere Application Server Profile and only scan the specified applications that are listed in a file

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --applications-file /tmp/applicationsToScan.txt`

### Scan a WebSphere Application Server Profile and allow scan to continue for applications with non existent shared Library

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --ignore-missing-shared-library`

### Scan a WebSphere Application Server Profile and allow scan to continue for applications that do not have binary files

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --ignore-missing-binary`

### Scan a WebSphere Application Server Profile and create a collection name specified

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --collection-name name1`

### Scan a WebSphere Application Server Profile and specify the java home

`./bin/ama-discovery -w WEBSPHERE_HOME_DIR -p PROFILE_NAME --java-home jre`

### Scan WebSphere Applications outside of WebSphere Home directory

`./bin/ama-discovery -o OUTSIDE_LOCATION`

## WebLogic

### WebLogic config

`./bin/ama-discovery --web-logic-config-file Path_of_the_config.xml_file`

## JBoss

### JBoss config

`./bin/ama-discovery --jboss-config-dir Directory_of_JBoss_Configuration`

## Tomcat

### Tomcat config

`./bin/ama-discovery --tomcat-home-dir TOMCAT_HOME_DIR --tomcat-config-dir TOMCAT_CONFIG_DIR`

## Using the built-in WSADMIN command

The wsadmin command has a built-in option for scanning your installed applications and generating a set of compressed files that can be uploaded directly into Application Modernization Accelerator.

The availability of this command depends on the version and fix pack that you are running:

 - WebSphere Application Server 8: Version 8.5.5.23 or later
 - WebSphere Application Server 9: Version 9.0.5.14 or later

For more information and instructions, see [Generating migration reports with the wsadmin migration commands](https://www.ibm.com/docs/en/was/9.0.5?topic=tools-generating-migration-reports-wsadmin-migration-commands).
