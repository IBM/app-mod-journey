# Scanning using custom parameters

- The goal of the default scan is to show you the easiest path to your migration target
- This means that where possible we keep the changes to a minimum, so we try to keep you on the same Java versions and EE specification levels
- In some cases you may want to run a scan that targets specific version of technologies or specifications
- In this case you can use the custom parameters to change the default scanning options

## Customize the scan options used for analysis

The customCmd.properties file under the /conf directory is used to config the scan options used to generate the report file during scanning of the application. 
User can edit this file to customize the scan options.

For example to include rules for migrating to the target version Java 11.

Edit the conf/customCmd.properties

add this line to the end of the file 

`scan_opt=--targetJava=java11`

Save the file 

Run the Transformation Advisor Data Collector

You can check that the Data Collector has scanned with the correct target by opening the analysis report and checking the target options. It should display --targetJava=java11
