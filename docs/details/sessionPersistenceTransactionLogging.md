# Session Persistence and Transaction Logging

 - Applications running on WebSphereND may already be configured to use Session Persistence and Transaction Logging
 - WebSphereND managed the in-memory case out of the box
 - In a modernized environment the best practice approach is to have in-memory storage installed on the cluster and available to each application as opposed to having dedicate in-memory storage for each application
 - The migration plan in Transformation Advisor will indicate if any aspect of your application's configuration has not been automatically configured
 
## Configuring application database Session Persistence
 - This will be automatically configured by default in the server.xml file
 - It will use the same database that the application used prior to being modernized
 - Further information and configuration assistance can be found [here](https://openliberty.io/docs/latest/create-session-table.html)

## Configuring application in-memory Session Persistence 
 - This will not be automatically configured by Transformation Advisor
 - Information on how best to configure this can be found [here](https://openliberty.io/docs/latest/distributed-session-caching.html)


## Configuring application database Transaction Logging
- This will be automatically configured by default in the server.xml file
- It will use the same database that the application used prior to being modernized
- Further information and configuration assistance can be found [here](https://openliberty.io/docs/latest/transaction-service.html)

## Configuring application in-memory Transaction Logging 
- This will not be automatically configured by Transformation Advisor
- Information on how best to configure this can be found [here](https://openliberty.io/docs/latest/transaction-service.html)