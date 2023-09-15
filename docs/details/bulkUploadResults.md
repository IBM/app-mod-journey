
##  Bulk data upload in Transformation Advisor

In this document you will learn how to prepare data for bulk upload and use the Transformation Advisor APIs to execute the upload.    

The execution of the Data Collector will result in a number of zip files being produced
 - One for each profile scanned
 - One for each shared library location discovered

Transformation Advisor will try to upload the results of the collection automatically by default.    
However, there are a number of common scenarios where this will not happen
 - There is no valid network path between where the collection takes place and where Transformation Advisor resides
 - You are gathering together the results of multiple different collections from multiple different servers

Files can be uploaded via the UI one at a time, so if you have even a handful of files the bulk upload feature will be faster

### Preparing for bulk upload
To execute a bulk upload you must zip all your data files into a single zip

1. Place all the zip files you want to upload into the same location
2. Zip that location (make sure you only have zip files in here and not extra unnecessary data)

You are now ready to execute the bulk upload

### Executing bulk upload
You will use the APIs interface to upload your bulk data zip.
Instructions on how to use the APIs can be found [here](https://www.ibm.com/docs/en/cta?topic=started-using-transformation-advisor-apis)

The bulk upload happens in two stages
 - Upload of the file to the server
 - Processing of the file
 - You will get a status URL that can be used to check the progress once file has been uploaded to the server
 - You need to check the status when it comes back to make sure the processing has started and there is not an issue with the zip, or the transfer
 - It may take some time to be fully processed, especially if there is a lot of data.

1. Open the APIs in your browser and authenticate if necessary. 
2. Go to the bulkImport API and click 'Try it out'
   1. /advisor/v2/collectionArchives/bulkImport
3. Enter the name of the zip file you created in the previous step
   1. NOTE: This will be the name of the workspace that gets created, you can set it to anything you want
4. Set the value for 'noHierarchy' to be true
   1. NOTE: In future releases we will fix this so that you won't need to set it :) 
5. Add the zip file you created in the previous step using the 'Choose file' option
6. Click 'Execute'
7. The API should give a response that indicates the bulk upload is being processed and provide a URL
   1. This is an asynchronous process, you will get a response with the status URL once the file has been uploaded.
8. Copy the status URL into your browser to see the progress of the upload. It will not refresh automatically, so you need to refresh to see the progress update.
9. Once the status reaches 'Bulk upload complete' you are done.
10. Open Transformation Advisor and navigate to the newly created workspace that will have all of your data





