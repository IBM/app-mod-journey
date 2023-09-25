# Upload Results

- By default, the TA Data Collector will automatically upload the results to Transformation Advisor when the scan has been completed
- If there is no network path from where the scan is executing to the TA that the Data Collector came from then the upload will fail (not a hugh shock :) 
- If there is no connection you will need to manually upload the results to the [UI](https://ibm.github.io/app-mod-journey/details/uploadResultsManually) or use the [bulk upload API](https://ibm.github.io/app-mod-journey/details/bulkUploadResults)

## Avoid seeing an upload error   

 - If there is no connection between the scanned system and TA, the Data collector will throw an error when trying to upload. 
 - You can add a flag to indicate that no upload to Transformation Advisor server will take place once the collection completes and this will remove the error message.

`./bin/transformationadvisor -w <WEBSPHERE_HOME_DIR> -p <PROFILE_NAME> --no-upload`



## Upload zip files using the Data Collector

 - If at the time the scan completed there was no connectivity, but there is now, you can manually upload any generated zip files

`./bin/transformationadvisor --upload-only <ZIP_FILE>`

