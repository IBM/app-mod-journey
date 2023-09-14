### Upload TA data collector scan to Transformation Advisor   

The data collector will return a .zip file containing your data and will be uploaded to TA if there is connectivity between the scanned system and TA.

If there is no connection you will need to manually upload to your Recommendations page. 
You can do this by going back to the Recommendations page and clicking "Upload data".

If there is no connection between the scanned system and TA, the Data collector will throw an error when trying to upload. 
You can add a flag to indicate that no upload to Transformation Advisor server will take place once the collection completes and this will remove the error message.

./bin/transformationadvisor -w <WEBSPHERE_HOME_DIR> -p <PROFILE_NAME> --no-upload

###You can also upload the zip via the command line by running the command

/bin/transformationadvisor --upload-only <ZIP_FILE> 

