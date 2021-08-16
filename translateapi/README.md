[![Generic badge](https://img.shields.io/badge/Version-1.0.0-green.svg)]()

#

![alt text](logos.png)

# BBE Group Service

## Overview

### Purpose:
Group common service to handle all group operations.

## Authors

- **Santhosh Thomas** - _Initial work_


## Copyright

THIS PROGRAM IS CONFIDENTIAL AND PROPRIETARY TO IBM CORP AND MAY NOT
BE REPRODUCED PUBLISHED OR DISCLOSED TO OTHERS WITHOUT ITS AUTHORIZATION.

Copyright &copy; 2021. IBM Corporation.
All Rights Reserved. IBM is a trademark or registered trademarks of
IBM Corporation or its affiliates in the U.S. and other countries. Other
names may be trademarks of their respective owners.

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc

# POST '/group/creategroup'
This endpoint is used to create a new group.

REQUEST:

{ "group": {
"group_name":"groupName",
"group_location":"group_location",
"on_marketplace":true
}
}

The above is a sample request. you can all the fields in the request as below. can avoid the null fields.   
on_marketplace is a required field. Group id is auto generated at the time of  creation.

{ "group": {
        "group_name": "groupName_group_id2",
        "group_create_date": "2021-02-24T18:30:00.000Z",
        "group_location": "location2",
        "auction_market_id": null,
        "auction_market_name": null,
        "auction_market_address": null,
        "auction_market_city": null,
        "auction_market_state": null,
        "auction_market_postalcode": null,
        "target_sale_date": null,
        "est_shipping_date": null,
        "target_sale_weight": null,
        "total_head_of_heifers_enrolling": null,
        "total_head_of_steers_enrolling": null,
        "approximate_marketing_date": null,
        "selling_type_status": null,
        "on_marketplace": true,
        "marketplace_likes": null,
        "marketplace_prediction_requests": null,
        "group_status": null,
        "group_health_risk": null,
        "system_id": null
    }
}

# POST '/group/animalgroup'
This endpoint is used to add animals to a group.

REQUEST BODY:
{ "animal": {
	"group_id" : 1,
	"bbe_id" : ["1e9d6c86-76b6-11eb-b467-0242ac120002","1f4a9c76-76b6-11eb-b467-0242ac120002","1fa9fec8-76b6-11eb-b467-0242ac120002"]
}
}

# GET '/group/singlegroup/:group_id'
This endpoint is used to retieve a single group information.

RESPONSE BODY:
[
    {
        "group_id": 3,
        "group_name": "groupName_group_id3",
        "group_create_date": "2021-02-23T18:30:00.000Z",
        "group_location": "location3",
        "auction_market_id": null,
        "auction_market_name": null,
        "auction_market_address": null,
        "auction_market_city": null,
        "auction_market_state": null,
        "auction_market_postalcode": null,
        "target_sale_date": null,
        "est_shipping_date": null,
        "target_sale_weight": null,
        "total_head_of_heifers_enrolling": null,
        "total_head_of_steers_enrolling": null,
        "approximate_marketing_date": null,
        "selling_type_status": null,
        "on_marketplace": true,
        "marketplace_likes": null,
        "marketplace_prediction_requests": null,
        "group_status": null,
        "group_health_risk": null,
        "system_id": null,
        "head_count": "0"
    }
]

# GET '/groups/:user_id'
This endpoint is used to retrieve all the groups under a user.
RESPONSE BODY: 
    
    This will be similar to the above response with multiple groups in it.


# GET '/group/animalgroup/:group_id'
This endpoint is used to retrieve all the the animals in a group.

RESPONSE BODY: 
[
    {
        "bbe_id": "1f4a9c76-76b6-11eb-b467-0242ac120002",
        "breed": "Angus",
        "eartag_id": null,
        "sex": "MALE",
        "sire_id": null,
        "dam_id": null,
        "genotype_status": "REQUESTED",
        "animal_status": "ALIVE",
        "group_id": 1,
        "group_name": "groupName_group_id1",
        "group_location": "location1",
        "sample_type": null,
        "sample_barcode": null
    }
]

This can have more number of animals

# PUT '/group/editgroup/:group_id'
This endpoint is used to update group information.

REQUEST BODY:
{
    "group":     {
        "group_id": 1,
        "group_name": "groupName_group_id111",
        "group_location": "location111"
    }
}

Note: The selection parameter is passed (e.g: group_id) is in the request body also, as we are using generic service for creation of sql queries. For other field names please refer the post request.

# DELETE '/group/:group_id'
This endpoint is used to delete a group.

RESPONSE:
"group record for group_id=1 deleted"