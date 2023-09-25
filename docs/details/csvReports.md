# Understanding Transformation Advisor exported reports

- TA has a number of reports that you can export to get different views on your modernization data
- Many of the reports are provided in csv format to allow you to manipulate them in spreadhseets

## How to download Transformation Advisor Export Reports

 - From the **Recommedations** page, click the export icon in the top right of the summary table
 - Check the box 'Summary of workspace' and 'Application details'
 - Click the Export Button

Transformation Advisor will download the reports with a name <Workspace name>_<migration target>_report.zip

Unzip the report (if using a windows system, then use 7 zip to extract the reports)

## How to read the reports

 - The **summary** Section will contain: 
     - applications: a pdf / csv summary of all the applications
     - commonCode: a pdf / csv summary of all the commonCode
     - guidance: a csv view of the workspace guidance
 - The **issues** section will contain:   
     - calculations: readme on how the unique and common code issue cost is calculated and a csv spreadsheet of the issues and costs for unique and common code.
     - consolidated: list of all issues and their associated applications 
 - The **application** Section will contain:
     - Analysis, evaluation, inventory reports for all applications and a pdf detailing complexity, technology issues, external dependencies and additional information
 - The **common code** section will contain:
     - a list of all common code jars and a pdf detailing complexity, technology issues, external dependencies, additional information and which applications are used by the common code.


