-- public.demo definition

-- Drop table

-- DROP TABLE public.demo;

CREATE TABLE public.demo (
	slno serial NOT NULL,
	strfield varchar(100) NULL,
	datefield date NULL,
	intfield int4 NULL,
	boolfield bool NULL,
	CONSTRAINT demo_pk PRIMARY KEY (slno)
);


-- public.multi_lingual_page_json_tbl definition

-- Drop table

-- DROP TABLE public.multi_lingual_page_json_tbl;

CREATE TABLE public.multi_lingual_page_json_tbl (
	app_name varchar(50) NOT NULL,
	page_name varchar(50) NOT NULL,
	language_id varchar(5) NOT NULL DEFAULT 'en'::character varying,
	page_desc text NULL,
	page_json json NOT NULL,
	CONSTRAINT multi_lingual_page_json_pk PRIMARY KEY (app_name, page_name, language_id)
);


-- public.select_query_metadata definition

-- Drop table

-- DROP TABLE public.select_query_metadata;

CREATE TABLE public.select_query_metadata (
	query_id varchar(50) NOT NULL,
	select_query text NOT NULL,
	comments_used_for text NULL,
	CONSTRAINT select_query_metadata_pk PRIMARY KEY (query_id)
);


drop function if exists generic_select;

CREATE OR REPLACE FUNCTION generic_select(query_id text,paramarray text[])
  RETURNS table (response json) 
  LANGUAGE plpgsql AS
$func$
declare
sqlQuery varchar;
begin
select select_query into sqlQuery from select_query_metadata sqm where sqm.query_id =$1; 
   RETURN QUERY EXECUTE $$
	  select json_agg(a) as response
		from ($$ || sqlQuery || ') a '
   USING  paramarray;
END
$func$;

INSERT INTO public.select_query_metadata
(query_id, select_query, comments_used_for)
VALUES('DEMO_DATA', 'select * from demo', NULL);
INSERT INTO public.select_query_metadata
(query_id, select_query, comments_used_for)
VALUES('PULL_JSON', 'select * from multi_lingual_page_json_tbl m where m.app_name =$1[1] and m.language_id =''ml''', NULL);



INSERT INTO public.multi_lingual_page_json_tbl
(app_name, page_name, language_id, page_desc, page_json)
VALUES('testapp', 'jesus_loves1', 'ml', NULL, '{"field1":"സ്നേഹം","field2":"സമാധാനം","field3":"ദയ"}'::json::json);
INSERT INTO public.multi_lingual_page_json_tbl
(app_name, page_name, language_id, page_desc, page_json)
VALUES('testapp', 'jesus_loves', 'ml', NULL, '{"field1":"വിള","field2":"വെള്ളം","field3":"വളം","field4":"എന്തു പറയുന്നു? സുഖമായിരിക്കുന്നോ?"}'::json::json);
INSERT INTO public.multi_lingual_page_json_tbl
(app_name, page_name, language_id, page_desc, page_json)
VALUES('testapp', 'jesus_loves', 'en', NULL, '{"field1":"Crop","field2":"Water","field3":"Fertilizer","field4":"What do you say? How are you?"}'::json::json);
INSERT INTO public.multi_lingual_page_json_tbl
(app_name, page_name, language_id, page_desc, page_json)
VALUES('testapp', 'jesus_loves1', 'en', NULL, '{"field1":"Love","field2":"Peace","field3":"kindness"}'::json::json);


