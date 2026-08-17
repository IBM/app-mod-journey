
##  Manual data upload in Application Modernization Accelerator

In this document you will learn how to manually upload data via the Application Modernization Accelerator UI   

The execution of the Data Collector will result in a number of zip files being produced
 - One for each profile scanned
 - One for each shared library location discovered

Application Modernization Accelerator will try to upload the results of the collection automatically by default.    
However, there are a number of common scenarios where this will not happen
 - There is no valid network path between where the collection takes place and where Application Modernization Accelerator resides
 - You are gathering together the results of multiple different collections from multiple different servers

If you have even a handful of files the bulk upload feature will be faster, and details of that can be found [here](https://ibm.github.io/app-mod-journey/details/bulkUploadResults)

### Executing a manually upload
You will use the Application Modernization Accelerator UI to upload files one at a time

Note: While a file upload is in progress, no other file upload can be executed

1. Open Application Modernization Accelerator and navigate to the workspace you want to upload data into
2. Your upload path depends on if the workspace already has data:
   1. If there is no data in this workspace then you will be presented with the option to Download (the Data Collector) or Upload (a file). Choose 'Upload'
   2. If the workspace already has data you need to navigate to the recommendations screen
   3. Then click 'Options' and select 'Upload data'
3. Drop or add a single zip file and click 'Upload'
4. When the upload is complete the page will automatically redirect to the recommendations page, and the new recommendations will be generated
5. That's it!

NOTE: After each upload the full recommendations for the workspace need to be regenerated. This is why it is faster to use the bulk upload if you have multiple files.




