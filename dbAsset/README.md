[![Generic badge](https://img.shields.io/badge/Version-1.0.0-green.svg)]()

#

# Automated API Service

## Overview

### Purpose:
API common service to handle API related functionality

## Steps to follow
### DB creation
docker-compose up -d
docker exec -it pgsql psql -U postgres -c "CREATE USER ztsadmin WITH PASSWORD 'admin4test';"
docker exec -it pgsql psql -U postgres -c "CREATE DATABASE autodb OWNER ztsadmin;"
docker exec -it pgsql psql -U postgres -c "\connect zts ztsadmin;"
docker exec -it pgsql psql -U postgres -c "ALTER USER ztsadmin WITH SUPERUSER;"


### RUN THE BELOW SQLS.

CREATE TABLE public.demo (
    strfield varchar(100),
    datefield date,
    intfield int4,
    boolfield boolean
);

CREATE TABLE public.select_query_metadata (
	query_id varchar(50) NOT NULL,
	select_query text NOT NULL,
	comments_used_for text NULL,
	CONSTRAINT select_query_metadata_pk PRIMARY KEY (query_id)
);

-- This table hold the select queries fired through the generic select api.
INSERT INTO public.select_query_metadata
(query_id, select_query, comments_used_for)
VALUES('DEMO_DATA', 'select * from demo', NULL);

CREATE OR REPLACE FUNCTION public.generic_select(query_id text, paramarray text[])
 RETURNS TABLE(response json)
 LANGUAGE plpgsql
AS $function$
declare
sqlQuery varchar;
begin
select select_query into sqlQuery from select_query_metadata sqm where sqm.query_id =$1; 
   RETURN QUERY EXECUTE $$
	  select json_agg(a) as response
		from ($$ || sqlQuery || ') a '
   USING  paramarray;
END
$function$
;

### Bring the Service up
npm install
npm run dev

### POST: http://localhost:8080/api-service/insert

#### INSERT A SINGLE ROW (ALL FIELDS)
```
Request Body:
{"objJsonData":{"strfield":"GOD BLESS YOU","datefield":"2021-08-04","intfield":1,"boolfield":true},
"endPoint": "insertOperation1"}
```
#### INSERT A SINGLE ROW (SELECTED FIELDS)

```
Request Body:
{"objJsonData":{"strfield":"GOD BLESS YOU"},
"endPoint": "insertOperation1"}
```
### POST: http://localhost:8080/api-service/bulkinsert

#### BULK INSERT
```
REQUEST BODY

{"objJsonData":[{"strfield":"GIVE THANKS","datefield":null,"intfield":1,"boolfield":true}, 
 {"strfield":"GOD BLESS YOU","datefield":"2021-08-04","intfield":2,"boolfield":true},
 {"strfield":"PEACE BE WITH YOU","datefield":"2021-08-04","intfield":3,"boolfield":true},
 {"strfield":"YOU ARE GREAT","datefield":"2021-08-04","intfield":4,"boolfield":true}
 ],
"endPoint": "insertOperation1"}
```

### PUT: http://localhost:8080/api-service/update

#### UPDATE A SINGLE ROW 
```
{"objJsonData":{"intfield":4,"boolfield":true},
"arrKeyFields" : ["boolfield"],
"endPoint": "updateOperation1"}

```
#### UPDATE WITH CUSTOM WHERE CONDITION. (NEED TO ADD THE CLAUSE IN THE CODE)

```
{"objJsonData":{"intfield":4,"boolfield":true},
"arrKeyFields" : [],
"endPoint": "updateOperation1"}

```
### PUT: http://localhost:8080/api-service/bulkupdate

#### BULK UPDATE
```
{"objJsonData": {"updateSetObjectValue": {
                "boolfield": false},	
                "whereInObject" : {"intfield" :[1,2,3]}
    },
"arrKeyFields" : [],
"endPoint": "updateOperation1"}

"updateSetObjectValue" will hold the fields to be updated (key value pair).
"whereInObject" will hold the array value of the fields used in the "in clause" of the where condition.
"boolfield" is a db field. For other field names please refer the post request.

```
### POST http://localhost:8080/api-service/genericselect

#### GENERIC SELECT

```
REQUEST BODY:
{
    "paramObject" : {
        "queryId":"DEMO_DATA",
        "paramArray":[],
        "strCallerFunction" :"DEMO DATA"
    }
}
```
    
# dbAsset
