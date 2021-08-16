require('dotenv').config();
const request = require('supertest');

const express = require('express');
const { GroupRouter } = require('../src/routers/GroupsRouter');
const bodyParser = require('body-parser')
const app = express();

const groupOne = { "group": {
    "group_name":"19 West Pen",
    "group_location":"07/9/20 Strs",
    "on_marketplace":true,
    "user_id": "14b3f346f7dc43889d657426d31588a9"
    }
    }

const returnGroupOne = 
{
    "group_id": 2,
    "group_name": "19 West Pen",
    "group_location": "07/9/20 Strs",
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
    "head_count": "0",
    "in_progress": "0",
    "on_file": "0",
    "marketplace_prediction_requests": 0,
    "ranch_location": null,
    "user_id": "14b3f346f7dc43889d657426d31588a9",
    "claimed_user_id": null
}

const updategroupOne = {
    "group":{
        "group_id": 2,
        "on_marketplace":false
    }
}


const returnUpdatedroupOne = 
    {
        "group_id": 2,
        "group_name": "19 West Pen",
        "group_location": "07/9/20 Strs",
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
        "on_marketplace": false,
        "marketplace_likes": null,
        "marketplace_prediction_requests": null,
        "group_status": null,
        "group_health_risk": null,
        "system_id": null,
        "marketplace_prediction_requests": 0,
        "ranch_location": null,
        "user_id": "14b3f346f7dc43889d657426d31588a9",
        "claimed_user_id": null
    }


const groupTwo = { "group": {
    "group_name":"20 West Pen",
    "group_location":"07/9/20 Strs",
    "user_id": "14b3f346f7dc43889d657426d31588a9"
    }
    }

beforeAll(async () => {
    const dbrows = await client.query(`DELETE FROM public.groups`);
    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    app.use('/groupapi', new GroupRouter().router);
});

test('Create 1st individual group', async () => {
    await request(app).post('/groupapi/group/creategroup').send(groupOne).expect(201);
});

test('Get individual group', async () => {
    let response = await request(app).get('/groupapi/group/singlegroup/2').send().expect(200);
    // let retobj =response.body[0];
    // delete retobj["group_create_date"];
    // expect(retobj).toEqual(returnGroupOne)
});
