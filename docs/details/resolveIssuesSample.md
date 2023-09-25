# Resolve issues for a Moderate application

 - There are numerous issues that can need to be address for a Moderate application
 - For each issue detailed help is provided in the Analysis reports
 - These reports are available for download at the bottom of the application details page
 
## Sample Modernization of a Moderate application

- There is a sample modernization implementation provided for an application that includes Entity Java Beans (EJB), transaction propagation and more

[https://github.com/cthigh/sample.DefaultApplication](https://github.com/cthigh/sample.DefaultApplication)

## Resolve issues with automated code fixes

 - Many of the code changes required for modernization have automated code fixes that can be used to update your entire code base for the application
 - The details of these can be found in the analysis report
 - They use OpenReWrite and either maven or gradle to update your code
 - Further information can be found [here](https://www.ibm.com/docs/en/wamt?topic=binaries-detailed-migration-analysis-report)

## Resolve issues with multiple solutions
 - Some issues that need to be resolved when modernizing have multiple possible solutions
 - These are usually presented from the least invasive to the most invasive
 - In all case we try to provide options that involve as little changes as possible - for example reusing an existing third party jar
 - We recommend that you review all the solutions and consider your entire application estate before modernizing - you really want to be able to reuse the same solution across all your applications



