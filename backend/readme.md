# ADMIN

###   For any request to /v1/admin, the following headers are must, otherwise the request will
###    return a 400.

###        1. 'authorization-id'
###        2. 'authorization-pass'


## 1  Location

### GET ALL LOCATIONS:  GET 127.0.0.1:8081/api/v1/admin/locations

### GET LOCATION NEAREST TO LAT AND LONG:   127.0.0.1:8081/api/v1/admin/locations?latitude=1&longitude=1

## INSERT A LOCATION: PUT  127.0.0.1:8081/api/v1/admin/location/Hailakandi
### BODY: { "latitude":2, "longitude" :3 , "active" : true}
 


# SELLER
