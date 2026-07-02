--
-- PostgreSQL database dump
--

\restrict 4bb5DzdSG0eqMcx0lhs1hXde4E9BmalbXOr9cQUW7Vbtwd1GKykualGytA4wSpL

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text,
	negate boolean
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
    create or replace function graphql_public.graphql(
        "operationName" text default null,
        query text default null,
        variables jsonb default null,
        extensions jsonb default null
    )
        returns jsonb
        language sql
    as $$
        select graphql.resolve(
            query := query,
            variables := coalesce(variables, '{}'),
            "operationName" := "operationName",
            extensions := extensions
        );
    $$;

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: supabase_admin
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


ALTER FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) OWNER TO supabase_admin;

--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
/*
Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
*/
declare
    op_symbol text = (
        case
            when op = 'eq' then '='
            when op = 'neq' then '!='
            when op = 'lt' then '<'
            when op = 'lte' then '<='
            when op = 'gt' then '>'
            when op = 'gte' then '>='
            when op = 'in' then '= any'
            else 'UNKNOWN OP'
        end
    );
    res boolean;
begin
    execute format(
        'select %L::'|| type_::text || ' ' || op_symbol
        || ' ( %L::'
        || (
            case
                when op = 'in' then type_::text || '[]'
                else type_::text end
        )
        || ')', val_1, val_2) into res;
    return res;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


ALTER FUNCTION realtime.wal2json_escape_identifier(name text) OWNER TO supabase_admin;

--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


ALTER FUNCTION storage.allow_any_operation(expected_operations text[]) OWNER TO supabase_storage_admin;

--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


ALTER FUNCTION storage.allow_only_operation(expected_operation text) OWNER TO supabase_storage_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    custom_claims_allowlist text[] DEFAULT '{}'::text[] NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: account_audit_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_audit_events (
    id uuid NOT NULL,
    actor_account_id uuid NOT NULL,
    target_account_id uuid NOT NULL,
    action character varying(80) NOT NULL,
    reason character varying(500),
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_audit_events OWNER TO postgres;

--
-- Name: account_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_roles (
    account_id uuid NOT NULL,
    role_id uuid NOT NULL,
    assigned_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account_roles OWNER TO postgres;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id uuid NOT NULL,
    phone_number character varying(20),
    password_hash character varying(255),
    full_name character varying(255),
    status character varying(64) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    username character varying(50),
    email character varying(254),
    terms_accepted_at timestamp with time zone,
    terms_version character varying(40),
    auth_provider character varying(32) DEFAULT 'LOCAL'::character varying NOT NULL,
    CONSTRAINT ck_accounts_auth_identifier CHECK (((phone_number IS NOT NULL) OR (email IS NOT NULL))),
    CONSTRAINT ck_accounts_auth_provider CHECK (((auth_provider)::text = ANY ((ARRAY['LOCAL'::character varying, 'GOOGLE'::character varying, 'FACEBOOK'::character varying])::text[])))
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: admin_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_profiles (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.admin_profiles OWNER TO postgres;

--
-- Name: booking_additional_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_additional_items (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    name character varying(200) NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(14,2) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    booking_version_id uuid NOT NULL
);


ALTER TABLE public.booking_additional_items OWNER TO postgres;

--
-- Name: booking_itinerary_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_itinerary_items (
    id uuid NOT NULL,
    activity_id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    start_datetime timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    booking_version_id uuid NOT NULL
);


ALTER TABLE public.booking_itinerary_items OWNER TO postgres;

--
-- Name: booking_roster_students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_roster_students (
    id uuid NOT NULL,
    booking_id uuid NOT NULL,
    student_id uuid NOT NULL,
    class_id uuid NOT NULL,
    import_batch_id uuid NOT NULL,
    row_number integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    notes_encrypted character varying(255)
);


ALTER TABLE public.booking_roster_students OWNER TO postgres;

--
-- Name: booking_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_status_history (
    id uuid NOT NULL,
    actor_account_id uuid NOT NULL,
    from_status character varying(40),
    occurred_at timestamp(6) with time zone NOT NULL,
    reason character varying(2000),
    to_status character varying(40) NOT NULL,
    booking_id uuid NOT NULL,
    CONSTRAINT booking_status_history_from_status_check CHECK (((from_status)::text = ANY ((ARRAY['DRAFT'::character varying, 'PENDING'::character varying, 'IN_CONSULTATION'::character varying, 'PROPOSAL_SENT'::character varying, 'ACCEPTED'::character varying, 'CONTRACT_UPLOADED'::character varying, 'CONTRACT_APPROVED'::character varying, 'CONFIRMED'::character varying, 'CANCELLED'::character varying, 'COMPLETED'::character varying])::text[]))),
    CONSTRAINT booking_status_history_to_status_check CHECK (((to_status)::text = ANY ((ARRAY['DRAFT'::character varying, 'PENDING'::character varying, 'IN_CONSULTATION'::character varying, 'PROPOSAL_SENT'::character varying, 'ACCEPTED'::character varying, 'CONTRACT_UPLOADED'::character varying, 'CONTRACT_APPROVED'::character varying, 'CONFIRMED'::character varying, 'CANCELLED'::character varying, 'COMPLETED'::character varying])::text[])))
);


ALTER TABLE public.booking_status_history OWNER TO postgres;

--
-- Name: booking_versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_versions (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    deposit_amount numeric(14,2) NOT NULL,
    number_of_students integer NOT NULL,
    number_of_tour_guides integer,
    number_of_trackers integer,
    payment_due_date date NOT NULL,
    payment_terms character varying(2000),
    position_title character varying(100),
    price_per_student numeric(14,2) NOT NULL,
    proposal_valid_until date NOT NULL,
    representative_full_name character varying(200),
    representative_gender character varying(20),
    status character varying(40) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    version_no integer NOT NULL,
    booking_id uuid NOT NULL,
    CONSTRAINT booking_versions_status_check CHECK (((status)::text = ANY ((ARRAY['SENT'::character varying, 'ACCEPTED'::character varying, 'VOID'::character varying])::text[])))
);


ALTER TABLE public.booking_versions OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid NOT NULL,
    tour_request_id uuid NOT NULL,
    confirmed_by_profile_id uuid,
    status character varying(32) DEFAULT 'DRAFT'::character varying NOT NULL,
    confirmed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    academic_year character varying(20) DEFAULT '2026-2027'::character varying NOT NULL,
    desired_tour_date date NOT NULL,
    expected_student_count integer NOT NULL,
    sales_staff_profile_id uuid,
    school_representative_profile_id uuid NOT NULL,
    special_requirements character varying(2000),
    target_grade character varying(40),
    tour_package_id uuid,
    version bigint NOT NULL,
    school_id uuid NOT NULL,
    CONSTRAINT ck_bookings_status CHECK (((status)::text = ANY (ARRAY[('DRAFT'::character varying)::text, ('PROPOSAL'::character varying)::text, ('CHANGES_REQUESTED'::character varying)::text, ('CONFIRMED'::character varying)::text, ('CANCELLED'::character varying)::text])))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: contract_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contract_templates (
    id uuid NOT NULL,
    content text NOT NULL,
    name character varying(200) NOT NULL
);


ALTER TABLE public.contract_templates OWNER TO postgres;

--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id uuid NOT NULL,
    booking_id uuid NOT NULL,
    uploaded_by_sales_profile_id uuid NOT NULL,
    contract_no character varying(40) NOT NULL,
    contract_type character varying(40) DEFAULT 'SERVICE_AGREEMENT'::character varying NOT NULL,
    status character varying(40) DEFAULT 'DRAFT'::character varying NOT NULL,
    signed_file_id uuid,
    signed_file_name character varying(255),
    signed_file_url character varying(1000),
    signed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    content text,
    rejection_reason character varying(2000),
    reviewed_at timestamp(6) with time zone,
    reviewed_by_tour_manager_profile_id uuid,
    signed_document_id uuid,
    submitted_at timestamp(6) with time zone,
    booking_version_id uuid NOT NULL,
    contract_template_id uuid,
    CONSTRAINT ck_contracts_status CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'IN_REVIEW'::character varying, 'PENDING_SIGNATURE'::character varying, 'SIGNED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT ck_contracts_type CHECK (((contract_type)::text = ANY ((ARRAY['SERVICE_AGREEMENT'::character varying, 'ADDENDUM'::character varying])::text[])))
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: data_anonymization_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_anonymization_requests (
    id uuid NOT NULL,
    requester_account_id uuid NOT NULL,
    target_account_id uuid NOT NULL,
    status character varying(40) NOT NULL,
    reason character varying(500),
    resolved_by uuid,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT ck_data_anonymization_requests_status CHECK (((status)::text = ANY ((ARRAY['REQUESTED'::character varying, 'APPROVED'::character varying, 'COMPLETED'::character varying, 'REJECTED'::character varying])::text[])))
);


ALTER TABLE public.data_anonymization_requests OWNER TO postgres;

--
-- Name: data_retention_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_retention_policies (
    id uuid NOT NULL,
    code character varying(80) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    description character varying(500),
    expiration_action character varying(40) NOT NULL,
    name character varying(150) NOT NULL,
    retention_days integer NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    updated_by uuid,
    CONSTRAINT data_retention_policies_expiration_action_check CHECK (((expiration_action)::text = ANY ((ARRAY['ARCHIVE'::character varying, 'ANONYMIZE'::character varying, 'HARD_DELETE'::character varying])::text[])))
);


ALTER TABLE public.data_retention_policies OWNER TO postgres;

--
-- Name: device_replacement_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_replacement_logs (
    id uuid NOT NULL,
    actor_account_id uuid,
    new_assignment_id uuid NOT NULL,
    old_assignment_id uuid NOT NULL,
    reason character varying(255) NOT NULL,
    replaced_at timestamp(6) with time zone NOT NULL
);


ALTER TABLE public.device_replacement_logs OWNER TO postgres;

--
-- Name: document_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_metadata (
    id uuid NOT NULL,
    bucket_name character varying(255) NOT NULL,
    checksum_sha256 character varying(64),
    created_at timestamp(6) with time zone NOT NULL,
    etag character varying(255),
    mime_type character varying(100) NOT NULL,
    object_key character varying(1024) NOT NULL,
    original_filename character varying(255),
    size_bytes bigint NOT NULL,
    storage_provider character varying(50) NOT NULL,
    version_id character varying(255),
    visibility character varying(20) NOT NULL
);


ALTER TABLE public.document_metadata OWNER TO postgres;

--
-- Name: gps_devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gps_devices (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone,
    credential_ref character varying(160) NOT NULL,
    credential_status character varying(20) NOT NULL,
    device_code character varying(80) NOT NULL,
    last_authenticated_at timestamp(6) with time zone,
    last_seen_at timestamp(6) with time zone,
    tracker_state character varying(20) NOT NULL,
    updated_at timestamp(6) with time zone,
    CONSTRAINT gps_devices_credential_status_check CHECK (((credential_status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'ROTATED'::character varying, 'REVOKED'::character varying, 'EXPIRED'::character varying])::text[]))),
    CONSTRAINT gps_devices_tracker_state_check CHECK (((tracker_state)::text = ANY ((ARRAY['ACTIVE'::character varying, 'STALE'::character varying, 'OFFLINE'::character varying, 'LOW_BATTERY'::character varying, 'REPLACED'::character varying, 'UNASSIGNED'::character varying, 'LAST_KNOWN'::character varying])::text[])))
);


ALTER TABLE public.gps_devices OWNER TO postgres;

--
-- Name: livestream_interactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livestream_interactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    user_id uuid NOT NULL,
    type character varying(32) NOT NULL,
    payload text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sender_name character varying(255),
    sender_role character varying(50),
    CONSTRAINT ck_li_type CHECK (((type)::text = ANY ((ARRAY['CHAT'::character varying, 'REACTION'::character varying])::text[])))
);


ALTER TABLE public.livestream_interactions OWNER TO postgres;

--
-- Name: livestream_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.livestream_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tour_id uuid NOT NULL,
    guide_id uuid NOT NULL,
    livekit_room_id character varying(255) NOT NULL,
    egress_id character varying(255),
    status character varying(32) DEFAULT 'PENDING'::character varying NOT NULL,
    s3_url character varying(255),
    viewer_count integer DEFAULT 0 NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    title character varying(255),
    description text,
    thumbnail_url text,
    CONSTRAINT ck_ls_status CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'LIVE'::character varying, 'ENDED'::character varying, 'ERROR'::character varying])::text[])))
);


ALTER TABLE public.livestream_sessions OWNER TO postgres;

--
-- Name: parent_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parent_profiles (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.parent_profiles OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    code character varying(120) NOT NULL,
    name character varying(150) NOT NULL,
    description character varying(500),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: refresh_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_sessions (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    refresh_token_hash character varying(255) NOT NULL,
    device_id character varying(255),
    ip_address character varying(64),
    user_agent character varying(512),
    revoked_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    rotated_from_session_id uuid
);


ALTER TABLE public.refresh_sessions OWNER TO postgres;

--
-- Name: registration_revision_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registration_revision_sessions (
    id uuid NOT NULL,
    consumed_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone NOT NULL,
    otp_code_hash character varying(255),
    otp_expires_at timestamp(6) with time zone,
    phone character varying(20) NOT NULL,
    revision_token_hash character varying(255),
    token_expires_at timestamp(6) with time zone,
    request_id uuid NOT NULL
);


ALTER TABLE public.registration_revision_sessions OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    granted_at timestamp with time zone NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(150) NOT NULL,
    description character varying(500),
    is_system_role boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roster_audit_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roster_audit_events (
    id uuid NOT NULL,
    batch_id uuid NOT NULL,
    booking_id uuid NOT NULL,
    school_id uuid NOT NULL,
    actor_account_id uuid,
    status character varying(32) NOT NULL,
    total_rows integer NOT NULL,
    success_rows integer NOT NULL,
    failed_rows integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roster_audit_events OWNER TO postgres;

--
-- Name: roster_import_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roster_import_batches (
    id uuid NOT NULL,
    booking_id uuid NOT NULL,
    school_id uuid NOT NULL,
    uploaded_by_account_id uuid,
    file_name character varying(255) NOT NULL,
    file_hash character varying(128) NOT NULL,
    status character varying(32) NOT NULL,
    total_rows integer DEFAULT 0 NOT NULL,
    success_rows integer DEFAULT 0 NOT NULL,
    failed_rows integer DEFAULT 0 NOT NULL,
    created_classes integer DEFAULT 0 NOT NULL,
    failure_code character varying(80),
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


ALTER TABLE public.roster_import_batches OWNER TO postgres;

--
-- Name: route_cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.route_cache (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    origin_latitude numeric(9,6) NOT NULL,
    origin_longitude numeric(9,6) NOT NULL,
    destination_latitude numeric(9,6) NOT NULL,
    destination_longitude numeric(9,6) NOT NULL,
    distance_meters integer,
    duration_seconds integer,
    provider character varying(40) NOT NULL,
    cached_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.route_cache OWNER TO postgres;

--
-- Name: sales_staff_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_staff_profiles (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.sales_staff_profiles OWNER TO postgres;

--
-- Name: school_classes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_classes (
    id uuid NOT NULL,
    school_id uuid NOT NULL,
    academic_year character varying(20) NOT NULL,
    class_name character varying(80) NOT NULL,
    normalized_class_name character varying(80) NOT NULL,
    student_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.school_classes OWNER TO postgres;

--
-- Name: school_dedupe_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_dedupe_keys (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    key_type character varying(50) NOT NULL,
    key_value character varying(255) NOT NULL,
    school_id uuid NOT NULL
);


ALTER TABLE public.school_dedupe_keys OWNER TO postgres;

--
-- Name: school_merge_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_merge_records (
    id uuid NOT NULL,
    merged_at timestamp(6) with time zone NOT NULL,
    reason character varying(1000) NOT NULL,
    merged_by_account_id uuid NOT NULL,
    source_school_id uuid NOT NULL,
    target_school_id uuid NOT NULL
);


ALTER TABLE public.school_merge_records OWNER TO postgres;

--
-- Name: school_representative_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_representative_profiles (
    id uuid NOT NULL,
    contact_email character varying(254),
    contact_phone character varying(20),
    created_at timestamp(6) with time zone NOT NULL,
    department character varying(150),
    full_name character varying(150) NOT NULL,
    position_title character varying(150) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    account_id uuid NOT NULL,
    school_id uuid NOT NULL,
    participation_reason character varying(1000)
);


ALTER TABLE public.school_representative_profiles OWNER TO postgres;

--
-- Name: school_representative_registration_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_representative_registration_requests (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    duplicate_review_required boolean NOT NULL,
    final_rejection_reason character varying(1000),
    last_resubmitted_at timestamp(6) with time zone,
    last_revision_email_sent_at timestamp(6) with time zone,
    last_revision_requested_at timestamp(6) with time zone,
    reviewed_at timestamp(6) with time zone,
    reviewed_by_account_id uuid,
    revision_count integer NOT NULL,
    revision_reason character varying(1000),
    status character varying(50) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    version bigint NOT NULL,
    account_id uuid NOT NULL,
    candidate_school_id uuid,
    profile_id uuid NOT NULL,
    proof_document_id uuid NOT NULL,
    school_id uuid NOT NULL,
    CONSTRAINT school_representative_registration_requests_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING_PHONE_VERIFICATION'::character varying, 'PENDING_ADMIN_APPROVAL'::character varying, 'REVISION_REQUIRED'::character varying, 'APPROVED'::character varying, 'FINAL_REJECTED'::character varying, 'CANCELLED'::character varying, 'EXPIRED'::character varying])::text[])))
);


ALTER TABLE public.school_representative_registration_requests OWNER TO postgres;

--
-- Name: schools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schools (
    id uuid NOT NULL,
    address_line character varying(500) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    email character varying(255),
    name character varying(255) NOT NULL,
    phone character varying(30) NOT NULL,
    status character varying(50) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    website_url character varying(500),
    CONSTRAINT schools_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING_VERIFICATION'::character varying, 'ACTIVE'::character varying, 'SUSPENDED'::character varying, 'INACTIVE'::character varying, 'MERGED_DUPLICATE'::character varying])::text[])))
);


ALTER TABLE public.schools OWNER TO postgres;

--
-- Name: student_class_memberships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_class_memberships (
    id uuid NOT NULL,
    school_id uuid NOT NULL,
    student_id uuid NOT NULL,
    class_id uuid NOT NULL,
    academic_year character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.student_class_memberships OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id uuid NOT NULL,
    school_id uuid NOT NULL,
    student_code character varying(64),
    full_name character varying(160) NOT NULL,
    date_of_birth date,
    gender character varying(20),
    parent_name character varying(160),
    parent_phone_encrypted character varying(255),
    parent_phone_masked character varying(32),
    identity_hash character varying(128) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: system_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_policies (
    id uuid NOT NULL,
    category character varying(80) NOT NULL,
    code character varying(80) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    description character varying(500),
    name character varying(150) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    updated_by uuid,
    value_text character varying(500) NOT NULL
);


ALTER TABLE public.system_policies OWNER TO postgres;

--
-- Name: teacher_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_profiles (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.teacher_profiles OWNER TO postgres;

--
-- Name: telemetry_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telemetry_events (
    id uuid NOT NULL,
    accuracy_meters numeric(38,2),
    assignment_id uuid,
    battery_level integer,
    event_id uuid,
    ingestion_source character varying(10) NOT NULL,
    latitude numeric(9,6) NOT NULL,
    longitude numeric(9,6) NOT NULL,
    nonce_hash character varying(96) NOT NULL,
    received_at timestamp(6) with time zone NOT NULL,
    recorded_at timestamp(6) with time zone NOT NULL,
    sequence_no bigint,
    signal_quality integer,
    signature_hash character varying(96) NOT NULL,
    source_type character varying(20) NOT NULL,
    device_id uuid NOT NULL,
    CONSTRAINT telemetry_events_ingestion_source_check CHECK (((ingestion_source)::text = ANY ((ARRAY['REST'::character varying, 'MQTT'::character varying])::text[]))),
    CONSTRAINT telemetry_events_source_type_check CHECK (((source_type)::text = ANY ((ARRAY['GPS'::character varying, 'LBS'::character varying])::text[])))
);


ALTER TABLE public.telemetry_events OWNER TO postgres;

--
-- Name: tour_guide_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_guide_profiles (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.tour_guide_profiles OWNER TO postgres;

--
-- Name: tour_manager_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_manager_profiles (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.tour_manager_profiles OWNER TO postgres;

--
-- Name: tour_operator_staff_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_operator_staff_profiles (
    id uuid NOT NULL,
    account_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.tour_operator_staff_profiles OWNER TO postgres;

--
-- Name: tour_request_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_request_items (
    id uuid NOT NULL,
    tour_request_id uuid NOT NULL,
    destination_id uuid NOT NULL,
    activity_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.tour_request_items OWNER TO postgres;

--
-- Name: tour_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_requests (
    id uuid NOT NULL,
    requested_by_profile_id uuid NOT NULL,
    created_by_sales_profile_id uuid,
    reviewed_by_sales_profile_id uuid,
    package_id uuid,
    request_type character varying(40) DEFAULT 'SCHOOL_INITIATED'::character varying NOT NULL,
    expected_student_count integer NOT NULL,
    desired_date date NOT NULL,
    status character varying(40) DEFAULT 'PENDING'::character varying NOT NULL,
    notes character varying(2000),
    rejection_reason character varying(500),
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT ck_tour_requests_request_type CHECK (((request_type)::text = ANY ((ARRAY['SCHOOL_INITIATED'::character varying, 'SALES_DRAFT'::character varying])::text[]))),
    CONSTRAINT ck_tour_requests_status CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'ACCEPTED'::character varying, 'REJECTED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT tour_requests_expected_student_count_check CHECK ((expected_student_count > 0))
);


ALTER TABLE public.tour_requests OWNER TO postgres;

--
-- Name: tracker_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracker_assignments (
    id uuid NOT NULL,
    active boolean NOT NULL,
    assigned_at timestamp(6) with time zone,
    created_at timestamp(6) with time zone,
    operation_plan_id uuid,
    replaced boolean NOT NULL,
    replaced_at timestamp(6) with time zone,
    school_confirmed_authorization boolean NOT NULL,
    selected_tracker_reason character varying(255),
    target_id uuid NOT NULL,
    target_type character varying(30) NOT NULL,
    updated_at timestamp(6) with time zone,
    device_id uuid NOT NULL,
    CONSTRAINT tracker_assignments_target_type_check CHECK (((target_type)::text = ANY ((ARRAY['VEHICLE'::character varying, 'SELECTED_STUDENT'::character varying, 'GROUP'::character varying])::text[])))
);


ALTER TABLE public.tracker_assignments OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid NOT NULL,
    amount numeric(14,2) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    type character varying(40) NOT NULL,
    contract_id uuid NOT NULL,
    CONSTRAINT transactions_type_check CHECK (((type)::text = ANY ((ARRAY['DEPOSIT'::character varying, 'BALANCE'::character varying, 'REFUND'::character varying])::text[])))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: trb_audit_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trb_audit_events (
    id uuid NOT NULL,
    actor_account_id uuid NOT NULL,
    target_entity_type character varying(40) NOT NULL,
    target_entity_id uuid NOT NULL,
    action character varying(80) NOT NULL,
    reason character varying(2000),
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.trb_audit_events OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
5de5567b-c1ab-491c-acf3-341836bdd688	\N	f171f34b-94fa-41d9-bf5c-a1bf1b250455	s256	cef32PXUDbvUoyHMhL3Ze20iajom0If80wbdK9Jv45A	facebook			2026-06-21 13:38:01.216699+00	2026-06-21 13:38:01.216699+00	oauth	\N	\N	http://127.0.0.1:5173/auth/callback	\N	\N	t
258579bc-0f40-4db2-acee-3e9c9dea2689	cb697691-a2b9-453b-b22b-df1bdb064e06	525e4a0a-a795-4390-b191-aea2fbb122f8	s256	7YoaRvtvKxN0F0kVTR-FvwAai-jOP481IGGVlDDA-cw	email			2026-06-21 13:39:52.491935+00	2026-06-21 13:40:54.84556+00	email/signup	2026-06-21 13:40:54.845509+00	\N	\N	\N	\N	f
0db82283-cab9-4116-9c12-49ca16027da2	\N	\N	\N	\N	facebook			2026-06-21 13:55:49.061233+00	2026-06-21 13:55:49.061233+00	oauth	\N	\N	http://127.0.0.1:5173/auth/callback	\N	\N	t
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
cb697691-a2b9-453b-b22b-df1bdb064e06	cb697691-a2b9-453b-b22b-df1bdb064e06	{"sub": "cb697691-a2b9-453b-b22b-df1bdb064e06", "role": "TEACHER", "email": "unichim1@gmail.com", "fullName": "Dao Hoang", "phoneNumber": "0123456789", "email_verified": true, "phone_verified": false}	email	2026-06-21 13:39:52.486711+00	2026-06-21 13:39:52.486764+00	2026-06-21 13:39:52.486764+00	0f91c539-de49-4856-a054-ced072a6f69a
cfc079a5-dd14-4c54-8956-e800f4a3793f	cfc079a5-dd14-4c54-8956-e800f4a3793f	{"sub": "cfc079a5-dd14-4c54-8956-e800f4a3793f", "role": "PARENT", "email": "hoangdthe181921@gmail.com", "fullName": "Đào Trung Hoàng", "phoneNumber": "0373299648", "termsVersion": "2026-06-22-v1", "termsAccepted": true, "email_verified": false, "phone_verified": false, "termsAcceptedAt": "2026-06-22T11:13:30.340Z"}	email	2026-06-22 11:13:31.458637+00	2026-06-22 11:13:31.458689+00	2026-06-22 11:13:31.458689+00	26c36fcd-b228-4c12-8301-11005a225d59
106246199960333955261	9037dd23-2449-4f2a-9670-32203cfb9833	{"iss": "https://accounts.google.com", "sub": "106246199960333955261", "name": "Hoàng Đào", "email": "daohoang2911@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKhzwWyLN60d0p9vzSIeA-_7ma8QgB_cf_-vWgRh3kxIZzRC9kv=s96-c", "full_name": "Hoàng Đào", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKhzwWyLN60d0p9vzSIeA-_7ma8QgB_cf_-vWgRh3kxIZzRC9kv=s96-c", "provider_id": "106246199960333955261", "email_verified": true, "phone_verified": false}	google	2026-06-21 12:37:03.90475+00	2026-06-21 12:37:03.904815+00	2026-06-22 15:30:18.659372+00	3644e0f6-6c56-43a8-b1e5-cf63fe95373c
108416813367711914548	ef53da35-5503-403b-972a-ac1b97e356fa	{"iss": "https://accounts.google.com", "sub": "108416813367711914548", "name": "H. Duy (Đốm)", "email": "hoangduy20407@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJnFZsAzlTErP3Ia_4JHHhBKBWaA_Ksef6MBl4JWNwMgFWZtubK=s96-c", "full_name": "H. Duy (Đốm)", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJnFZsAzlTErP3Ia_4JHHhBKBWaA_Ksef6MBl4JWNwMgFWZtubK=s96-c", "provider_id": "108416813367711914548", "email_verified": true, "phone_verified": false}	google	2026-06-23 07:56:01.500843+00	2026-06-23 07:56:01.500891+00	2026-06-23 08:14:31.841339+00	10e67248-6158-4df5-86b4-a654caa5dbf7
100896495392665299075	2f97aac0-be51-4d4d-9767-b21d771918fe	{"iss": "https://accounts.google.com", "sub": "100896495392665299075", "name": "Hoang Van Duy (K18 HL)", "email": "duyhvhe180050@fpt.edu.vn", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJfAEr4d3i9mhsspGDpR8TqvqjWKt_Up1twd6KtbvVK5GvKEg=s96-c", "full_name": "Hoang Van Duy (K18 HL)", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJfAEr4d3i9mhsspGDpR8TqvqjWKt_Up1twd6KtbvVK5GvKEg=s96-c", "provider_id": "100896495392665299075", "custom_claims": {"hd": "fpt.edu.vn"}, "email_verified": true, "phone_verified": false}	google	2026-06-23 07:59:04.18576+00	2026-06-23 07:59:04.185802+00	2026-06-23 08:47:46.502324+00	bb0bdbed-c05e-47b8-a104-d938af269424
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
7da82a3d-26f2-468c-b1bf-4f66b3da4462	2026-06-22 15:30:18.716403+00	2026-06-22 15:30:18.716403+00	oauth	f8595e6f-76c2-464b-903f-8f2151d2249e
a9397796-84c6-4b49-b60e-2bcf9f13808f	2026-06-23 07:56:01.542117+00	2026-06-23 07:56:01.542117+00	oauth	8851515c-6422-415f-95d2-281856b9c5b2
9ae001d9-cd9d-47df-b000-7c16a01e12ea	2026-06-23 07:59:04.199793+00	2026-06-23 07:59:04.199793+00	oauth	bb266d2c-413a-4dc5-bb1f-96b392c78e65
5c0fd4d5-eed3-4610-b6bd-8069d3f02c72	2026-06-23 08:14:31.855393+00	2026-06-23 08:14:31.855393+00	oauth	a1ca73b7-12bb-4b52-afe5-f17bb860465a
6783d830-070f-499e-97ed-97e0a948a1a1	2026-06-23 08:26:48.152324+00	2026-06-23 08:26:48.152324+00	oauth	e1363742-c0e0-4757-8610-e2bb3044dddc
1244fecd-15ef-4e03-b875-de9f8f1a808f	2026-06-23 08:27:28.404586+00	2026-06-23 08:27:28.404586+00	oauth	1691e900-0ab5-4f1e-8881-f82b0843ba0a
37e178b2-1711-4f31-952c-163dfc923aca	2026-06-23 08:29:24.085232+00	2026-06-23 08:29:24.085232+00	oauth	8a221f53-2769-4724-81d6-708d4b3ffb75
10fcebd4-8a51-4dbe-8134-a6f0bffc7714	2026-06-23 08:33:16.53787+00	2026-06-23 08:33:16.53787+00	oauth	d4a20978-3d6e-4481-9ec6-619896f03994
74ada9ea-371b-43fa-ab2d-76f85102699b	2026-06-23 08:34:05.256755+00	2026-06-23 08:34:05.256755+00	oauth	b86fcd23-3750-4acd-9fff-8eaca2a3844e
af598f15-f2cc-470d-bbcd-789f98ff7481	2026-06-23 08:47:46.518864+00	2026-06-23 08:47:46.518864+00	oauth	f6a39635-7e14-49a7-bbe8-e594a58edf66
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
353edae0-06d1-4a90-87b8-fb373891b7e0	cfc079a5-dd14-4c54-8956-e800f4a3793f	confirmation_token	a3533a4018cd1222ed1e78e2da0cd43225b320fbdd441ec381e7939a	hoangdthe181921@gmail.com	2026-06-22 11:13:33.380871	2026-06-22 11:13:33.380871
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	5	e77garima2co	9037dd23-2449-4f2a-9670-32203cfb9833	t	2026-06-22 15:30:18.69229+00	2026-06-22 16:28:36.589788+00	\N	7da82a3d-26f2-468c-b1bf-4f66b3da4462
00000000-0000-0000-0000-000000000000	6	bb5ikb5nrvo3	9037dd23-2449-4f2a-9670-32203cfb9833	f	2026-06-22 16:28:36.602335+00	2026-06-22 16:28:36.602335+00	e77garima2co	7da82a3d-26f2-468c-b1bf-4f66b3da4462
00000000-0000-0000-0000-000000000000	7	27h2b52rjqxn	ef53da35-5503-403b-972a-ac1b97e356fa	f	2026-06-23 07:56:01.533022+00	2026-06-23 07:56:01.533022+00	\N	a9397796-84c6-4b49-b60e-2bcf9f13808f
00000000-0000-0000-0000-000000000000	8	hx6aoouzbz4t	2f97aac0-be51-4d4d-9767-b21d771918fe	f	2026-06-23 07:59:04.195363+00	2026-06-23 07:59:04.195363+00	\N	9ae001d9-cd9d-47df-b000-7c16a01e12ea
00000000-0000-0000-0000-000000000000	9	low2vytb3dnp	ef53da35-5503-403b-972a-ac1b97e356fa	f	2026-06-23 08:14:31.852679+00	2026-06-23 08:14:31.852679+00	\N	5c0fd4d5-eed3-4610-b6bd-8069d3f02c72
00000000-0000-0000-0000-000000000000	10	px3qlradmimj	2f97aac0-be51-4d4d-9767-b21d771918fe	f	2026-06-23 08:26:48.144203+00	2026-06-23 08:26:48.144203+00	\N	6783d830-070f-499e-97ed-97e0a948a1a1
00000000-0000-0000-0000-000000000000	11	vg6dcjrdv4a5	2f97aac0-be51-4d4d-9767-b21d771918fe	f	2026-06-23 08:27:28.402425+00	2026-06-23 08:27:28.402425+00	\N	1244fecd-15ef-4e03-b875-de9f8f1a808f
00000000-0000-0000-0000-000000000000	12	s4rh2f6qm57z	2f97aac0-be51-4d4d-9767-b21d771918fe	f	2026-06-23 08:29:24.081269+00	2026-06-23 08:29:24.081269+00	\N	37e178b2-1711-4f31-952c-163dfc923aca
00000000-0000-0000-0000-000000000000	13	we6j7mdazi6t	2f97aac0-be51-4d4d-9767-b21d771918fe	f	2026-06-23 08:33:16.535675+00	2026-06-23 08:33:16.535675+00	\N	10fcebd4-8a51-4dbe-8134-a6f0bffc7714
00000000-0000-0000-0000-000000000000	14	5wrthrsypbts	2f97aac0-be51-4d4d-9767-b21d771918fe	f	2026-06-23 08:34:05.247691+00	2026-06-23 08:34:05.247691+00	\N	74ada9ea-371b-43fa-ab2d-76f85102699b
00000000-0000-0000-0000-000000000000	15	mjpf3mx36rej	2f97aac0-be51-4d4d-9767-b21d771918fe	f	2026-06-23 08:47:46.514773+00	2026-06-23 08:47:46.514773+00	\N	af598f15-f2cc-470d-bbcd-789f98ff7481
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
7da82a3d-26f2-468c-b1bf-4f66b3da4462	9037dd23-2449-4f2a-9670-32203cfb9833	2026-06-22 15:30:18.675348+00	2026-06-22 16:28:36.623829+00	\N	aal1	\N	2026-06-22 16:28:36.623698	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	113.190.81.90	\N	\N	\N	\N	\N
a9397796-84c6-4b49-b60e-2bcf9f13808f	ef53da35-5503-403b-972a-ac1b97e356fa	2026-06-23 07:56:01.518468+00	2026-06-23 07:56:01.518468+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
9ae001d9-cd9d-47df-b000-7c16a01e12ea	2f97aac0-be51-4d4d-9767-b21d771918fe	2026-06-23 07:59:04.193979+00	2026-06-23 07:59:04.193979+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
5c0fd4d5-eed3-4610-b6bd-8069d3f02c72	ef53da35-5503-403b-972a-ac1b97e356fa	2026-06-23 08:14:31.850584+00	2026-06-23 08:14:31.850584+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
6783d830-070f-499e-97ed-97e0a948a1a1	2f97aac0-be51-4d4d-9767-b21d771918fe	2026-06-23 08:26:48.141656+00	2026-06-23 08:26:48.141656+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
1244fecd-15ef-4e03-b875-de9f8f1a808f	2f97aac0-be51-4d4d-9767-b21d771918fe	2026-06-23 08:27:28.400641+00	2026-06-23 08:27:28.400641+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
37e178b2-1711-4f31-952c-163dfc923aca	2f97aac0-be51-4d4d-9767-b21d771918fe	2026-06-23 08:29:24.079739+00	2026-06-23 08:29:24.079739+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
10fcebd4-8a51-4dbe-8134-a6f0bffc7714	2f97aac0-be51-4d4d-9767-b21d771918fe	2026-06-23 08:33:16.53334+00	2026-06-23 08:33:16.53334+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
74ada9ea-371b-43fa-ab2d-76f85102699b	2f97aac0-be51-4d4d-9767-b21d771918fe	2026-06-23 08:34:05.241176+00	2026-06-23 08:34:05.241176+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
af598f15-f2cc-470d-bbcd-789f98ff7481	2f97aac0-be51-4d4d-9767-b21d771918fe	2026-06-23 08:47:46.512335+00	2026-06-23 08:47:46.512335+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0	123.16.211.156	\N	\N	\N	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	cb697691-a2b9-453b-b22b-df1bdb064e06	authenticated	authenticated	unichim1@gmail.com	$2a$10$xMGoZ571zwIdnvMMrFXFr.EcOVkgVmt4KkXa.d0Ym01/XBswnu1fu	2026-06-21 13:40:54.831479+00	\N		2026-06-21 13:39:52.495208+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "cb697691-a2b9-453b-b22b-df1bdb064e06", "role": "TEACHER", "email": "unichim1@gmail.com", "fullName": "Dao Hoang", "phoneNumber": "0123456789", "email_verified": true, "phone_verified": false}	\N	2026-06-21 13:39:52.469084+00	2026-06-21 13:40:54.842796+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	9037dd23-2449-4f2a-9670-32203cfb9833	authenticated	authenticated	daohoang2911@gmail.com	\N	2026-06-21 12:37:03.910631+00	\N		\N		\N			\N	2026-06-22 15:30:18.67319+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "106246199960333955261", "name": "Hoàng Đào", "email": "daohoang2911@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKhzwWyLN60d0p9vzSIeA-_7ma8QgB_cf_-vWgRh3kxIZzRC9kv=s96-c", "full_name": "Hoàng Đào", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKhzwWyLN60d0p9vzSIeA-_7ma8QgB_cf_-vWgRh3kxIZzRC9kv=s96-c", "provider_id": "106246199960333955261", "email_verified": true, "phone_verified": false}	\N	2026-06-21 12:37:03.89414+00	2026-06-22 16:28:36.610534+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	cfc079a5-dd14-4c54-8956-e800f4a3793f	authenticated	authenticated	hoangdthe181921@gmail.com	$2a$10$FGqWdkvLRffDgw6v6sJK7u5IvOmxEkP1IJunaVXnmm033ER.shQN.	\N	\N	a3533a4018cd1222ed1e78e2da0cd43225b320fbdd441ec381e7939a	2026-06-22 11:13:31.471152+00		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"sub": "cfc079a5-dd14-4c54-8956-e800f4a3793f", "role": "PARENT", "email": "hoangdthe181921@gmail.com", "fullName": "Đào Trung Hoàng", "phoneNumber": "0373299648", "termsVersion": "2026-06-22-v1", "termsAccepted": true, "email_verified": false, "phone_verified": false, "termsAcceptedAt": "2026-06-22T11:13:30.340Z"}	\N	2026-06-22 11:13:31.400543+00	2026-06-22 11:13:33.373237+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	ef53da35-5503-403b-972a-ac1b97e356fa	authenticated	authenticated	hoangduy20407@gmail.com	\N	2026-06-23 07:56:01.510127+00	\N		\N		\N			\N	2026-06-23 08:14:31.848143+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "108416813367711914548", "name": "H. Duy (Đốm)", "email": "hoangduy20407@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJnFZsAzlTErP3Ia_4JHHhBKBWaA_Ksef6MBl4JWNwMgFWZtubK=s96-c", "full_name": "H. Duy (Đốm)", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJnFZsAzlTErP3Ia_4JHHhBKBWaA_Ksef6MBl4JWNwMgFWZtubK=s96-c", "provider_id": "108416813367711914548", "email_verified": true, "phone_verified": false}	\N	2026-06-23 07:56:01.481615+00	2026-06-23 08:14:31.854649+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	2f97aac0-be51-4d4d-9767-b21d771918fe	authenticated	authenticated	duyhvhe180050@fpt.edu.vn	\N	2026-06-23 07:59:04.190682+00	\N		\N		\N			\N	2026-06-23 08:47:46.510222+00	{"provider": "google", "providers": ["google"]}	{"iss": "https://accounts.google.com", "sub": "100896495392665299075", "name": "Hoang Van Duy (K18 HL)", "email": "duyhvhe180050@fpt.edu.vn", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJfAEr4d3i9mhsspGDpR8TqvqjWKt_Up1twd6KtbvVK5GvKEg=s96-c", "full_name": "Hoang Van Duy (K18 HL)", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocJfAEr4d3i9mhsspGDpR8TqvqjWKt_Up1twd6KtbvVK5GvKEg=s96-c", "provider_id": "100896495392665299075", "custom_claims": {"hd": "fpt.edu.vn"}, "email_verified": true, "phone_verified": false}	\N	2026-06-23 07:59:04.181854+00	2026-06-23 08:47:46.518035+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: account_audit_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_audit_events (id, actor_account_id, target_account_id, action, reason, created_at) FROM stdin;
e79c8a99-29f4-4af1-aa50-0b2a1a27a444	b9a9329d-7b23-44e3-b9a1-a9dbdd63fca3	d0eedadf-546c-4cfd-9684-5495b49755ed	ROLE_CHANGED	TOUR_OPERATOR_STAFF	2026-06-28 21:54:25.132369+00
f3012a1d-b619-41d3-a5a0-a8bd72e64664	b9a9329d-7b23-44e3-b9a1-a9dbdd63fca3	9baaefba-91a7-4b06-9075-e738bb3e5334	ACCOUNT_LOCKED	thích thì khóa	2026-06-28 22:12:37.469478+00
18afb501-4ca7-4d30-9d22-137d69272744	b9a9329d-7b23-44e3-b9a1-a9dbdd63fca3	d0eedadf-546c-4cfd-9684-5495b49755ed	ACCOUNT_LOCKED	test khóa tài khoản	2026-06-28 22:13:18.390791+00
32a80fbf-e670-4aa0-bd15-8cce59ece0d6	27281913-9f97-4a5e-8b37-af036422f02b	d0eedadf-546c-4cfd-9684-5495b49755ed	ACCOUNT_UNLOCKED	postman cleanup	2026-06-29 09:03:15.315973+00
9c24d5ed-8207-4f53-89b3-d41a9c26d716	a013f090-41c2-4442-beed-d525c2277eee	7b29bf58-0a1b-4741-adbf-a1c595f37b33	ROLE_CHANGED	TOUR_OPERATOR_STAFF	2026-07-02 08:12:48.315913+00
f607fae7-6508-42f1-965d-00e2d2cffa4c	b9a9329d-7b23-44e3-b9a1-a9dbdd63fca3	d0eedadf-546c-4cfd-9684-5495b49755ed	ROLE_CHANGED	SCHOOL_REPRESENTATIVE	2026-07-02 10:41:44.749901+00
7865109d-0300-435b-b4cf-2372cbb89614	a013f090-41c2-4442-beed-d525c2277eee	7b29bf58-0a1b-4741-adbf-a1c595f37b33	ROLE_CHANGED	SALES_STAFF	2026-07-02 11:54:44.940701+00
4c35cd24-157b-4c52-ae86-13c00354612a	27281913-9f97-4a5e-8b37-af036422f02b	688f939f-9c95-42d8-b980-cdc980d7fad4	ROLE_CHANGED	ADMIN	2026-07-02 14:56:17.264239+00
\.


--
-- Data for Name: account_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_roles (account_id, role_id, assigned_at) FROM stdin;
54f06fb0-0e6e-434c-a41d-f344653f021d	7961db58-631b-41f8-b530-225ca25efd53	2026-06-26 08:51:54.322292+00
9baaefba-91a7-4b06-9075-e738bb3e5334	a8b5b33b-55da-44f7-b11b-173667434869	2026-06-27 08:00:04.654321+00
d1ddb32b-b6f8-4f67-a7f9-37fe2f3c842c	3cabd595-6bb5-4e42-8efb-5222d00ee3c4	2026-06-27 09:32:27.101815+00
27281913-9f97-4a5e-8b37-af036422f02b	a8b5b33b-55da-44f7-b11b-173667434869	2026-06-27 10:14:57.979556+00
04f3ced9-8084-40f9-81d2-402e4ceed0b2	7961db58-631b-41f8-b530-225ca25efd53	2026-06-27 11:22:44.780246+00
b9a9329d-7b23-44e3-b9a1-a9dbdd63fca3	a8b5b33b-55da-44f7-b11b-173667434869	2026-06-26 08:21:58.256938+00
d0abbfdf-f255-49bc-a7c7-4de65bfc5d10	3cabd595-6bb5-4e42-8efb-5222d00ee3c4	2026-06-29 10:04:15.068678+00
a013f090-41c2-4442-beed-d525c2277eee	a8b5b33b-55da-44f7-b11b-173667434869	2026-06-30 14:51:30.842259+00
0962c18a-7cdd-4460-adab-e88d5a9fcb24	2c36e2f7-467d-445b-838c-5361f771e4cf	2026-06-30 14:50:24.517989+00
f35ad8d0-c91c-43f6-b109-75d06b9fdeb3	a8b5b33b-55da-44f7-b11b-173667434869	2026-07-02 09:19:55.681469+00
d0eedadf-546c-4cfd-9684-5495b49755ed	2c36e2f7-467d-445b-838c-5361f771e4cf	2026-07-02 10:41:44.742516+00
7b29bf58-0a1b-4741-adbf-a1c595f37b33	b745a0cb-0cc2-48de-8106-0cc6f2b30513	2026-07-02 11:54:44.930492+00
688f939f-9c95-42d8-b980-cdc980d7fad4	a8b5b33b-55da-44f7-b11b-173667434869	2026-07-02 14:56:17.256258+00
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (id, phone_number, password_hash, full_name, status, created_at, updated_at, username, email, terms_accepted_at, terms_version, auth_provider) FROM stdin;
b9a9329d-7b23-44e3-b9a1-a9dbdd63fca3	\N	$2a$10$VH0ZtJ2XIdbbzSMsTt7PaeI2R/iZmqqunM.tAfZ6MgUFp1qBY7uTa	Hoang Van Duy (K18 HL)	ACTIVE	2026-06-26 08:21:58.027982+00	2026-06-26 08:21:58.027982+00	\N	duyhvhe180050@fpt.edu.vn	2026-06-26 08:21:58.015663+00	2026-06-22-v1	GOOGLE
54f06fb0-0e6e-434c-a41d-f344653f021d	\N	$2a$10$RFM7UZ4g5hb7UZ7.hjC6k.2ml3WmFPl/KhjkIMxnY8nhVrXAYO.LK	merg	ACTIVE	2026-06-26 08:51:54.127461+00	2026-06-26 08:51:54.127461+00	\N	chientx24@gmail.com	2026-06-26 08:51:54.122468+00	2026-06-22-v1	GOOGLE
d1ddb32b-b6f8-4f67-a7f9-37fe2f3c842c	\N	\N	Duy Hoàng	ACTIVE	2026-06-27 09:32:26.974805+00	2026-06-27 09:32:26.974805+00	\N	01687911232.fhd@gmail.com	2026-06-27 09:32:26.96781+00	2026-06-22-v1	GOOGLE
27281913-9f97-4a5e-8b37-af036422f02b	\N	$2a$10$ybHQmo76ZLvRpUtQSCNqYu6zclrbdZGxPW2Zsl3xYo1Nt9HHl6hse	Dao Hoang	ACTIVE	2026-06-27 10:14:57.723762+00	2026-06-27 10:14:57.723762+00	\N	unichim1@gmail.com	2026-06-27 10:14:57.701033+00	2026-06-22-v1	LOCAL
04f3ced9-8084-40f9-81d2-402e4ceed0b2	\N	\N	Cao Phan Tuan Anh (K18 HL)	ACTIVE	2026-06-27 11:22:44.621987+00	2026-06-27 11:22:44.621987+00	\N	anhcpthe186751@fpt.edu.vn	2026-06-27 11:22:44.603965+00	2026-06-22-v1	GOOGLE
9baaefba-91a7-4b06-9075-e738bb3e5334	\N	\N	Chiến Trần Xuân (HE186184)	ACTIVE	2026-06-27 08:00:04.452919+00	2026-06-28 22:12:37.512419+00	\N	he186184tranxuanchien@gmail.com	2026-06-27 08:00:04.44337+00	2026-06-22-v1	GOOGLE
d0eedadf-546c-4cfd-9684-5495b49755ed	\N	\N	Thị Thu Thảo Bùi	ACTIVE	2026-06-27 10:16:20.744665+00	2026-06-29 09:03:15.383293+00	\N	thuthaox7@gmail.com	2026-06-27 10:16:20.715658+00	2026-06-22-v1	GOOGLE
688f939f-9c95-42d8-b980-cdc980d7fad4	\N	$2a$10$ybHQmo76ZLvRpUtQSCNqYu6zclrbdZGxPW2Zsl3xYo1Nt9HHl6hse	Hoàng Đào	ACTIVE	2026-06-26 12:03:15.890893+00	2026-06-26 12:03:15.890893+00	\N	daohoang2911@gmail.com	2026-06-26 12:03:15.890893+00	2026-06-22-v1	GOOGLE
d0abbfdf-f255-49bc-a7c7-4de65bfc5d10	\N	\N	Tran Xuan Chien	ACTIVE	2026-06-29 10:04:14.915814+00	2026-06-29 10:04:14.915814+00	\N	chientxhe186184@fpt.edu.vn	2026-06-29 10:04:14.906798+00	2026-06-22-v1	GOOGLE
0962c18a-7cdd-4460-adab-e88d5a9fcb24	\N	\N	Giáp Phan Quang	ACTIVE	2026-06-30 14:50:24.408325+00	2026-06-30 14:50:24.408325+00	\N	giapphan244@gmail.com	2026-06-30 14:50:24.400335+00	2026-06-22-v1	GOOGLE
a013f090-41c2-4442-beed-d525c2277eee	\N	\N	Phan Quang Giap (K18 HL)	ACTIVE	2026-06-30 14:51:30.759525+00	2026-06-30 14:51:30.759525+00	\N	giappqhe186239@fpt.edu.vn	2026-06-30 14:51:30.759525+00	2026-06-22-v1	GOOGLE
7b29bf58-0a1b-4741-adbf-a1c595f37b33	\N	$2a$10$c1fA7hCK1LxjvlS2aqcrSuZV9wm3hS4tQ2eKnQ0FNLLJEzWFQ.ebW	Giáp Phan Quang	ACTIVE	2026-06-26 07:56:46.472079+00	2026-06-26 07:56:46.472079+00	\N	giaphotboycp123@gmail.com	2026-06-26 07:56:46.465535+00	2026-06-22-v1	GOOGLE
f35ad8d0-c91c-43f6-b109-75d06b9fdeb3	\N	$2a$10$3sPuA1IKYbz2UQV8QX2YYuIsFnrERhIwD8l1cZLdI77arMvPPLzpC	System Administrator	ACTIVE	2026-07-02 09:19:55.681469+00	2026-07-02 09:19:55.681469+00	\N	admin@ventourkids.com	2026-07-02 09:19:55.681469+00	v1	LOCAL
\.


--
-- Data for Name: admin_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_profiles (id, account_id, created_at, updated_at) FROM stdin;
11ca59df-272a-435c-8868-8ef60b70e5d2	f35ad8d0-c91c-43f6-b109-75d06b9fdeb3	2026-07-02 09:19:55.681469+00	2026-07-02 09:19:55.681469+00
\.


--
-- Data for Name: booking_additional_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_additional_items (id, created_at, name, quantity, unit_price, updated_at, booking_version_id) FROM stdin;
\.


--
-- Data for Name: booking_itinerary_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_itinerary_items (id, activity_id, created_at, start_datetime, updated_at, booking_version_id) FROM stdin;
\.


--
-- Data for Name: booking_roster_students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_roster_students (id, booking_id, student_id, class_id, import_batch_id, row_number, created_at, notes_encrypted) FROM stdin;
\.


--
-- Data for Name: booking_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_status_history (id, actor_account_id, from_status, occurred_at, reason, to_status, booking_id) FROM stdin;
\.


--
-- Data for Name: booking_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_versions (id, created_at, deposit_amount, number_of_students, number_of_tour_guides, number_of_trackers, payment_due_date, payment_terms, position_title, price_per_student, proposal_valid_until, representative_full_name, representative_gender, status, updated_at, version_no, booking_id) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, tour_request_id, confirmed_by_profile_id, status, confirmed_at, created_at, updated_at, academic_year, desired_tour_date, expected_student_count, sales_staff_profile_id, school_representative_profile_id, special_requirements, target_grade, tour_package_id, version, school_id) FROM stdin;
\.


--
-- Data for Name: contract_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract_templates (id, content, name) FROM stdin;
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, booking_id, uploaded_by_sales_profile_id, contract_no, contract_type, status, signed_file_id, signed_file_name, signed_file_url, signed_at, created_at, updated_at, content, rejection_reason, reviewed_at, reviewed_by_tour_manager_profile_id, signed_document_id, submitted_at, booking_version_id, contract_template_id) FROM stdin;
\.


--
-- Data for Name: data_anonymization_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.data_anonymization_requests (id, requester_account_id, target_account_id, status, reason, resolved_by, resolved_at, created_at) FROM stdin;
\.


--
-- Data for Name: data_retention_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.data_retention_policies (id, code, created_at, description, expiration_action, name, retention_days, updated_at, updated_by) FROM stdin;
\.


--
-- Data for Name: device_replacement_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.device_replacement_logs (id, actor_account_id, new_assignment_id, old_assignment_id, reason, replaced_at) FROM stdin;
\.


--
-- Data for Name: document_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_metadata (id, bucket_name, checksum_sha256, created_at, etag, mime_type, object_key, original_filename, size_bytes, storage_provider, version_id, visibility) FROM stdin;
e3bc7f1e-218d-45ac-991f-1117d42662c0	ventourkids-330201062977-ap-southeast-1-an	\N	2026-06-27 20:38:04.739091+00	\N	image/png	school-proofs/b68101d9-e3fc-46b8-9ba0-4966b1b5c775-fresher.png	fresher.png	85645	S3	\N	PRIVATE
\.


--
-- Data for Name: gps_devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gps_devices (id, created_at, credential_ref, credential_status, device_code, last_authenticated_at, last_seen_at, tracker_state, updated_at) FROM stdin;
bbbbbbbb-0000-0000-0000-000000000001	2026-07-02 09:28:06.121649+00	cred-ref-001	ACTIVE	GPS-TEST-001	\N	2026-07-02 09:28:06.121649+00	ACTIVE	2026-07-02 09:28:45.926104+00
bbbbbbbb-0000-0000-0000-000000000002	2026-07-02 09:28:06.121649+00	cred-ref-002	ACTIVE	GPS-TEST-002	\N	2026-07-02 09:13:06.121649+00	STALE	2026-07-02 09:28:45.926104+00
bbbbbbbb-0000-0000-0000-000000000003	2026-07-02 09:28:06.121649+00	cred-ref-003	ACTIVE	GPS-TEST-003	\N	2026-07-02 09:23:06.121649+00	LOW_BATTERY	2026-07-02 09:28:45.926104+00
\.


--
-- Data for Name: livestream_interactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livestream_interactions (id, session_id, user_id, type, payload, created_at, sender_name, sender_role) FROM stdin;
20a913a8-4147-41e2-a455-7a064d5fc3c9	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123123	2026-06-29 03:36:58.219894+00	\N	\N
ba13c688-7bc9-4371-9ae0-fadfb5a07523	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	REACTION	heart	2026-06-29 03:37:03.950832+00	\N	\N
cf7e1119-36bb-4e80-a666-badce8109002	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	REACTION	wow	2026-06-29 03:37:06.115179+00	\N	\N
1518c23a-c427-4aa5-8b8d-076ca1e3b901	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	REACTION	clap	2026-06-29 03:37:07.556055+00	\N	\N
45c21e7b-7fb4-45ff-bab1-4ff9f7ff0111	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	REACTION	smile	2026-06-29 03:37:09.643224+00	\N	\N
fb46794a-5168-4096-866f-5bfe11d8fb12	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	REACTION	thumbup	2026-06-29 03:37:13.527251+00	\N	\N
c5cc5779-d945-476e-87d1-72a00b7c248d	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	Con tôi đang ở chô mô	2026-06-29 03:37:20.700151+00	\N	\N
7d16a49b-fcae-44ab-a738-9a165f357592	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	hiển thị đang bị sai rồi	2026-06-29 03:37:31.52762+00	\N	\N
f3c07fca-6124-4649-9115-e0e368e4bc60	07ee2efa-51c1-4757-b68a-40161698e894	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	cái thanh này đúng a đuồi	2026-06-29 03:37:45.100773+00	\N	\N
2cb09c8b-0d13-450f-8d22-c4b5475e9094	07ee2efa-51c1-4757-b68a-40161698e894	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	chu i	2026-06-29 03:38:15.595015+00	\N	\N
1c832fff-9084-4b82-9158-030ac6f4a639	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123	2026-06-29 03:46:08.351288+00	\N	\N
1c5883ba-e474-4bc8-9148-838679452cc5	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123123	2026-06-29 03:46:09.40374+00	\N	\N
9c009aa5-3b35-44d6-a3b2-617cd412a68e	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	12312	2026-06-29 03:46:10.243868+00	\N	\N
db4ef309-e7bd-4f0f-86ea-663e97ecc270	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	3123	2026-06-29 03:46:10.529233+00	\N	\N
f24d4074-5728-4a78-98ac-ad36030f5fd4	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	1	2026-06-29 03:46:10.622227+00	\N	\N
8c44b43d-5e22-4112-95af-d5950c71fec7	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	3	2026-06-29 03:46:10.825855+00	\N	\N
cc30976b-cb6d-48b6-a6de-d457a6b3ca72	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123	2026-06-29 03:46:10.906587+00	\N	\N
857d9708-776e-4c84-8019-cd82d21cbe22	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	12	2026-06-29 03:46:11.035834+00	\N	\N
c9eb50f0-4578-4cbd-9bdd-dd4a2e7ebcb2	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	312	2026-06-29 03:46:11.215333+00	\N	\N
e1a8210f-e4c8-44b5-a5e0-a3940edbb661	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	3	2026-06-29 03:46:11.324106+00	\N	\N
3e6d63b0-639e-495c-81f8-24d526451348	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	12	2026-06-29 03:46:11.472952+00	\N	\N
5cef87fc-3422-44f8-95b7-972ba9dc01a9	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	3	2026-06-29 03:46:12.085473+00	\N	\N
5ae8fa75-839f-41ac-905f-929c6237e51d	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	hả?	2026-06-29 03:46:23.377318+00	\N	\N
3254d02b-a6c1-48e8-9108-c998df9a7c07	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	dsa	2026-06-29 03:46:48.094602+00	\N	\N
08c03e1f-2ea1-47a6-8ec5-1ecd21f4fba4	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	....	2026-06-29 03:46:53.316165+00	\N	\N
942409ff-bedb-41d6-ad85-ef95856068f1	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	1	2026-06-29 03:47:22.067502+00	\N	\N
c6f11d56-6f26-4767-a1cd-8195ee82163a	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123123	2026-06-29 03:47:25.820143+00	\N	\N
ce01c63f-2f30-4397-a2c3-ad05e39602e4	6caa98d6-0876-4123-b40d-3ed2eed6faaa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	hello	2026-06-29 03:47:29.626324+00	\N	\N
dafdb410-7935-4f12-9e42-cc3c2d5e0525	84c37c6b-a1f8-449a-b227-ae514a89f754	9baaefba-91a7-4b06-9075-e738bb3e5334	REACTION	wow	2026-06-29 03:50:49.400562+00	\N	\N
59829f75-1732-4de3-9832-ed0b786a7c31	84c37c6b-a1f8-449a-b227-ae514a89f754	9baaefba-91a7-4b06-9075-e738bb3e5334	REACTION	heart	2026-06-29 03:50:54.9172+00	\N	\N
d3ff2256-cdaf-4b9c-a69e-55a55be0781c	84c37c6b-a1f8-449a-b227-ae514a89f754	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	hello	2026-06-29 03:50:58.723894+00	\N	\N
793af6b5-c135-479b-8ad7-b87c34cf6d9e	83e155eb-b58a-44da-bd1d-1125b06e6724	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	hello worl	2026-06-29 03:58:48.788706+00	\N	\N
e5d13e2f-7717-4e8d-82b8-edcaa5dd23bb	83e155eb-b58a-44da-bd1d-1125b06e6724	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	?	2026-06-29 03:59:00.455172+00	\N	\N
fad124c9-3c11-4d55-8871-c7ef69256dc4	83e155eb-b58a-44da-bd1d-1125b06e6724	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	bị lỗi rồi	2026-06-29 03:59:09.488432+00	\N	\N
4948c908-f8d9-48f2-aeea-1cd1334ff2c6	83e155eb-b58a-44da-bd1d-1125b06e6724	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	ng neoo nn i =))	2026-06-29 03:59:33.973749+00	\N	\N
605a8695-a0d9-457e-a4ca-3a43e0eb3c26	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	hello xin chao	2026-06-29 04:22:54.50529+00	Chiến Trần Xuân (HE186184)	ADMIN
9d0b2053-5acf-4816-94aa-096f3cbf166a	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	?	2026-06-29 04:24:30.106307+00	Chiến Trần Xuân (HE186184)	ADMIN
5e2ba540-1ec8-417b-b898-0e40b7dabf14	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	cái gì đây?	2026-06-29 04:24:41.497118+00	Chiến Trần Xuân (HE186184)	ADMIN
9b61a8ac-e87a-4b2a-9c48-28a52d807138	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	sao không hiển thị gì vậy	2026-06-29 04:24:47.436726+00	Chiến Trần Xuân (HE186184)	ADMIN
17dc7525-be86-49b4-9eae-f823619ffb85	cdd69488-823e-46dd-abbe-b0d907b75caa	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	Em khong biet thua can bo	2026-06-29 04:25:04.07805+00	Ẩn danh	PARENT
f0e49553-0b0e-43b6-8727-c4d83418a6e3	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	mm	2026-06-29 04:25:12.382337+00	Chiến Trần Xuân (HE186184)	ADMIN
582c10d0-755d-49d9-ad02-5c77dfb2d974	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123	2026-06-29 04:31:06.197102+00	Chiến Trần Xuân (HE186184)	ADMIN
61db89c7-a8a8-4212-b3b1-02d072d21fc4	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	hả?	2026-06-29 04:32:00.51739+00	Chiến Trần Xuân (HE186184)	ADMIN
26f7b3a8-2c25-4273-b1e0-55472b664e07	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123	2026-06-29 04:41:22.623174+00	Chiến Trần Xuân (HE186184)	ADMIN
eac58438-91c6-4519-8f5a-233e516fae91	cdd69488-823e-46dd-abbe-b0d907b75caa	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	1234	2026-06-29 04:41:29.768515+00	Chiến Trần Xuân (HE186184)	ADMIN
be38a939-3c2a-4282-bdb2-473872d45855	4db0e261-3786-4d61-9934-cca62b75f726	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123	2026-06-29 04:42:26.768911+00	Chiến Trần Xuân (HE186184)	ADMIN
7483490a-0840-4888-a38b-062a517a2104	4db0e261-3786-4d61-9934-cca62b75f726	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	hello jqk	2026-06-29 04:42:30.856625+00	Chiến Trần Xuân (HE186184)	ADMIN
cd44e874-45a8-45fa-b831-ba14929c8be1	4db0e261-3786-4d61-9934-cca62b75f726	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	được rofoid dấy bạn iu ơi	2026-06-29 04:42:36.251826+00	Chiến Trần Xuân (HE186184)	ADMIN
a238ccf0-927b-4b28-aa4d-3018719fdf0f	4db0e261-3786-4d61-9934-cca62b75f726	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	12312	2026-06-29 04:42:40.256636+00	Chiến Trần Xuân (HE186184)	ADMIN
0918f036-c7e7-4c90-aed1-8a5b2aec6168	4db0e261-3786-4d61-9934-cca62b75f726	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	23123	2026-06-29 04:42:42.386814+00	Chiến Trần Xuân (HE186184)	ADMIN
e6f75a8a-f95d-4e5f-93d2-7ef2effa341e	4db0e261-3786-4d61-9934-cca62b75f726	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	em chao sep	2026-06-29 04:42:54.583946+00	Hướng dẫn viên	TOUR_GUIDE
c6effee4-cc62-4bfb-9cd1-82373ad1d435	4db0e261-3786-4d61-9934-cca62b75f726	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	hello sep	2026-06-29 04:43:11.33999+00	Hướng dẫn viên	TOUR_GUIDE
07e601d9-330f-40e5-87e3-a32658ba3aa2	51d602b0-c96c-4af3-8684-aa3ee40594ed	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123	2026-06-29 04:48:58.358572+00	Chiến Trần Xuân (HE186184)	ADMIN
03c8f552-ec64-4f9f-8967-da82b5545dc6	51d602b0-c96c-4af3-8684-aa3ee40594ed	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123	2026-06-29 04:49:03.564178+00	Chiến Trần Xuân (HE186184)	ADMIN
de4b08c4-941d-4e15-8ee4-6efefa4c6af2	51d602b0-c96c-4af3-8684-aa3ee40594ed	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	123	2026-06-29 04:49:05.838152+00	Hướng dẫn viên	TOUR_GUIDE
0a4ec2b7-9854-4a40-ac80-e0c33ab7e42e	51d602b0-c96c-4af3-8684-aa3ee40594ed	9baaefba-91a7-4b06-9075-e738bb3e5334	REACTION	wow	2026-06-29 04:49:17.117837+00	Ẩn danh	PARENT
92414fa1-5289-4bfa-873f-8f9a735d5052	632bdfcf-7e7a-4f1e-8ebf-53a7d0b1fe96	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	123	2026-06-29 04:50:16.989589+00	Chiến Trần Xuân (HE186184)	ADMIN
9fc00408-bd2a-49b2-84f3-7e56316ef296	632bdfcf-7e7a-4f1e-8ebf-53a7d0b1fe96	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	asdf	2026-06-29 04:50:21.074816+00	Hướng dẫn viên	TOUR_GUIDE
baafd042-7851-429a-8e56-c7f1ff2bcf86	632bdfcf-7e7a-4f1e-8ebf-53a7d0b1fe96	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	hello wwol	2026-06-29 04:50:32.695076+00	Hướng dẫn viên	TOUR_GUIDE
ee28120c-02c4-4b7f-970b-ee84d14aa7a4	632bdfcf-7e7a-4f1e-8ebf-53a7d0b1fe96	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	được đấy cu em	2026-06-29 04:50:37.150653+00	Chiến Trần Xuân (HE186184)	ADMIN
808bb673-9f9a-4c71-baef-ee3e868ee2f1	fc426b32-41ab-4427-9fb5-19b8dc8f1b1b	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	123	2026-06-29 05:06:57.640396+00	Hướng dẫn viên	TOUR_GUIDE
82083144-2f41-4b33-a797-012a48c4ecaf	fc426b32-41ab-4427-9fb5-19b8dc8f1b1b	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	adf	2026-06-29 05:06:59.524876+00	Chiến Trần Xuân (HE186184)	ADMIN
172459a3-793c-4cba-bea1-a8486b0ae16a	4faa85ac-505a-4a47-98d9-a073c1038fa9	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	bac	2026-06-29 05:11:02.674361+00	Chiến Trần Xuân (HE186184)	ADMIN
3c098d03-3264-499b-9c50-2ea0145d9b51	4faa85ac-505a-4a47-98d9-a073c1038fa9	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	d	2026-06-29 05:11:06.459514+00	Hướng dẫn viên	TOUR_GUIDE
f82e662a-db86-4b1e-81fd-7ffdb5e71e23	3d29159d-4b56-4ce0-888f-b207dabcab35	9baaefba-91a7-4b06-9075-e738bb3e5334	CHAT	ádasd	2026-06-29 05:29:24.539397+00	Chiến Trần Xuân (HE186184)	ADMIN
d14f56ce-5c3d-49b1-87d3-db4de5a6779e	c4696390-4786-46cd-bd07-719a22899bc8	54f06fb0-0e6e-434c-a41d-f344653f021d	CHAT	dadada	2026-06-29 05:35:16.841295+00	Hướng dẫn viên	TOUR_GUIDE
\.


--
-- Data for Name: livestream_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.livestream_sessions (id, tour_id, guide_id, livekit_room_id, egress_id, status, s3_url, viewer_count, started_at, ended_at, created_at, updated_at, title, description, thumbnail_url) FROM stdin;
5d97c04e-649d-4443-895b-532c0e26c476	00000000-0000-0000-0000-000000000000	04f3ced9-8084-40f9-81d2-402e4ceed0b2	00000000-0000-0000-0000-000000000000	EG_EbXMwo8urHfY	ENDED	\N	0	2026-06-27 11:54:41.950575+00	2026-06-27 11:56:22.280578+00	2026-06-27 11:54:41.966941+00	2026-06-27 11:56:22.283576+00	hdhhdhhr	jdhdjdjjr	\N
e71d70d3-b0bb-46a5-8d95-0bca72410c24	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	5ad0401f-185c-434c-8241-7ff205c04e61	EG_f98kcmjie6jQ	ENDED	\N	0	2026-06-29 02:53:33.872237+00	2026-06-29 02:53:54.602059+00	2026-06-29 02:53:33.880474+00	2026-06-29 02:53:54.605059+00	tesst	tesst	\N
4abe6079-23fe-4524-9f8a-8fc72630e268	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	9984e70a-f9c2-44f7-b3e3-dc6287e05042	EG_LaXHFRAwQsYF	ENDED	\N	0	2026-06-29 02:54:48.002566+00	2026-06-29 02:54:58.509801+00	2026-06-29 02:54:48.002566+00	2026-06-29 02:54:58.509801+00	123	23	\N
23048cbe-7628-48c9-8626-9e558f74e325	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	917b4099-e64e-4d34-a71e-d20cfd883eec	EG_F8CVQQkPNem6	ENDED	\N	0	2026-06-29 03:02:14.635185+00	2026-06-29 03:07:55.831827+00	2026-06-29 03:02:14.639695+00	2026-06-29 03:07:55.833817+00	1231231	123123	\N
2367f0e7-01f3-4982-b4e9-af706a25b7af	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	5832993f-b797-4de8-b717-4375e19bb817	EG_kBwBkmLGZhyH	ENDED	\N	0	2026-06-29 03:14:10.0769+00	2026-06-29 03:14:31.92438+00	2026-06-29 03:14:10.078025+00	2026-06-29 03:14:31.925448+00	123	23123	\N
d2a555a3-404d-4d65-8005-8c2b9da17196	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	81e4182c-3c8d-4873-b078-380f38087009	EG_fv3ckrZwNV9D	ENDED	\N	0	2026-06-29 03:34:00.888817+00	2026-06-29 03:34:25.622949+00	2026-06-29 03:34:00.891815+00	2026-06-29 03:34:25.623948+00	12	23	\N
07ee2efa-51c1-4757-b68a-40161698e894	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	e9c7bbb7-3984-4062-bea0-e3293948de49	EG_iAi5woNXRPWz	ENDED	\N	0	2026-06-29 03:36:40.382989+00	2026-06-29 03:39:04.910193+00	2026-06-29 03:36:40.382989+00	2026-06-29 03:39:04.911696+00	11	1	\N
6caa98d6-0876-4123-b40d-3ed2eed6faaa	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	b6c3f565-6901-48ca-bb0b-93e8b04b454c	EG_qTspAdyc7PqX	ENDED	\N	0	2026-06-29 03:44:56.145817+00	2026-06-29 03:47:51.179879+00	2026-06-29 03:44:56.146815+00	2026-06-29 03:47:51.179879+00	1	1	\N
29f23474-ec22-4da7-86fa-cd9a52318828	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	05f9900e-9684-45a6-92ba-b7180c132249	EG_AhvuPcRLyQ7L	ENDED	\N	0	2026-06-29 03:48:06.152926+00	2026-06-29 03:48:37.872493+00	2026-06-29 03:48:06.153928+00	2026-06-29 03:48:37.873491+00	1	1	\N
12458ff9-4253-47c0-aa00-9f8d08f9afad	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	b35875f4-0fb4-4d97-bf12-2874cd18362a	EG_wesy2FbuKNp6	ENDED	\N	0	2026-06-29 03:49:16.84605+00	2026-06-29 03:49:30.190931+00	2026-06-29 03:49:16.84605+00	2026-06-29 03:49:30.191931+00	1111111	11111	\N
d6871c11-3c99-4ce1-b90a-90405b918e53	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	dd2d99dc-18a1-4347-8833-3f5917fd3449	EG_G5uG5opdGQLh	ENDED	\N	0	2026-06-29 03:49:45.642064+00	2026-06-29 03:49:56.230502+00	2026-06-29 03:49:45.642064+00	2026-06-29 03:49:56.230502+00	1	1	\N
84c37c6b-a1f8-449a-b227-ae514a89f754	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	45737a36-eea6-4787-b3b9-eaa6ca03498e	EG_Wxab89LsqhVF	ENDED	\N	0	2026-06-29 03:50:16.985116+00	2026-06-29 03:51:09.712189+00	2026-06-29 03:50:16.986116+00	2026-06-29 03:51:09.713196+00	123	21	\N
83e155eb-b58a-44da-bd1d-1125b06e6724	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	25e85faf-212a-4d64-8bb5-4d3026b3ee12	egress-39a913b7-8f57-4e79-9e09-0d6332618b37	ENDED	\N	0	2026-06-29 03:58:35.667319+00	2026-06-29 04:22:23.413039+00	2026-06-29 03:58:35.668319+00	2026-06-29 04:22:25.841573+00	123	123	\N
cdd69488-823e-46dd-abbe-b0d907b75caa	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	4c62fb9a-0c72-49b9-b236-13b99f44cafb	egress-3db39712-85cf-48b7-b119-dc239aa67304	ENDED	\N	0	2026-06-29 04:22:25.828538+00	2026-06-29 04:41:40.857071+00	2026-06-29 04:22:25.833046+00	2026-06-29 04:41:40.859581+00	11	12	\N
4db0e261-3786-4d61-9934-cca62b75f726	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	5b602afa-cd11-48a4-b2a4-ebf586b0062c	egress-001e95ac-328a-4303-b9c4-13bc97f3e14e	ENDED	\N	0	2026-06-29 04:42:03.395725+00	2026-06-29 04:43:29.764615+00	2026-06-29 04:42:03.395725+00	2026-06-29 04:43:29.764615+00	11	12	\N
51d602b0-c96c-4af3-8684-aa3ee40594ed	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	42227c77-8326-4968-8b3c-d8c253f828b2	egress-7e4ec4a8-7bcf-4922-932c-652f1ba43f8f	ENDED	\N	0	2026-06-29 04:48:19.192096+00	2026-06-29 04:49:23.847149+00	2026-06-29 04:48:19.192096+00	2026-06-29 04:49:23.848149+00	123	123	\N
632bdfcf-7e7a-4f1e-8ebf-53a7d0b1fe96	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	a08429dc-0742-4e93-9259-b1aee497fae2	egress-1b43b26f-d4cb-4469-b322-58020c61956b	ENDED	\N	0	2026-06-29 04:50:09.01066+00	2026-06-29 05:02:17.718654+00	2026-06-29 04:50:09.01066+00	2026-06-29 05:02:17.723191+00	ff	f	\N
d0e91dec-7202-4ded-a090-8f7a888ec53f	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	dd2edaa1-2ce2-4c29-bccb-bb4bf7220c72	egress-dc459ce6-8fd1-475f-81c8-0d7c2620043b	ENDED	\N	0	2026-06-29 05:04:36.083584+00	2026-06-29 05:05:02.654306+00	2026-06-29 05:04:36.084139+00	2026-06-29 05:05:02.655451+00	cc	c	\N
fc426b32-41ab-4427-9fb5-19b8dc8f1b1b	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	38f44f64-f24e-4ae2-92b7-e332f5480672	egress-55d04bdc-0132-4736-9d33-4053c41d491b	ENDED	\N	0	2026-06-29 05:06:05.336038+00	2026-06-29 05:07:05.217908+00	2026-06-29 05:06:05.337049+00	2026-06-29 05:07:05.218908+00	abc	abc	\N
4faa85ac-505a-4a47-98d9-a073c1038fa9	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	4374a9f3-2e81-4fec-a72d-a71c746fe672	egress-4b5ad376-4e3b-4521-8d5e-6e74dbede70d	ENDED	\N	0	2026-06-29 05:10:45.405602+00	2026-06-29 05:11:14.616123+00	2026-06-29 05:10:45.405602+00	2026-06-29 05:11:14.617628+00	ac	ac	\N
a1f757a1-ccef-4733-81b9-b5aa13a2fe75	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	57756bf9-8a3c-4722-93fa-029714eebf53	egress-e857b173-4d17-4f04-9445-96d5f5d43140	ENDED	\N	0	2026-06-29 05:12:48.471175+00	2026-06-29 05:13:10.566156+00	2026-06-29 05:12:48.478718+00	2026-06-29 05:13:10.568162+00	a	a	\N
9359955b-4255-4c2e-8e98-000ad5d9f0a8	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	05d19593-7094-4f5b-95f8-b679c16cad7e	egress-d5b5eb9d-da11-4be5-968e-efc13a404670	ENDED	\N	0	2026-06-29 05:13:26.61004+00	2026-06-29 05:16:51.99673+00	2026-06-29 05:13:26.61004+00	2026-06-29 05:16:51.999242+00	a	aa	\N
5166af2f-ae31-4908-ad9c-5c18c08e4f8c	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	43e55ff2-464e-4ee9-9f81-677649e298d1	egress-36a55c5c-de4d-4339-9e14-ecbb6aed3d7e	ENDED	\N	0	2026-06-29 05:17:56.270333+00	2026-06-29 05:18:07.854367+00	2026-06-29 05:17:56.271331+00	2026-06-29 05:18:07.855373+00	11	11	\N
a52fb82b-2f9e-48b7-8d80-fefdf04b712f	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	18f134dc-121d-4dbc-8eba-997b9df07510	egress-4976a975-1b99-4a04-9598-6927d0ee47c3	ENDED	\N	0	2026-06-29 05:18:19.694553+00	2026-06-29 05:21:56.210698+00	2026-06-29 05:18:19.694553+00	2026-06-29 05:21:56.213766+00	v	v	\N
7a4ff262-eaa3-4aba-b5b3-382d68059330	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	b4af973c-e418-4248-8e0e-203b63ee1f68	egress-f7ebebb9-f2f1-4a3d-8bbe-e50f233080df	ENDED	\N	0	2026-06-29 05:22:31.326319+00	2026-06-29 05:22:42.240471+00	2026-06-29 05:22:31.327321+00	2026-06-29 05:22:42.241488+00	123	123	\N
b564afa7-06c0-41bd-b328-028b121ed449	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	b8ba5acf-75b4-46b7-8a4b-40f4bfc09eaf	egress-205801a7-f61d-4880-acec-01e40232ab01	ENDED	\N	0	2026-06-29 05:22:53.780327+00	2026-06-29 05:23:05.160856+00	2026-06-29 05:22:53.78133+00	2026-06-29 05:23:05.161854+00	123	123	\N
3d29159d-4b56-4ce0-888f-b207dabcab35	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	e7b98e5f-2aa7-4784-8685-2d4882e1b90a	egress-c921fb14-d241-4bf3-8a46-107bce7f1c68	ENDED	\N	0	2026-06-29 05:27:51.243055+00	2026-06-29 05:31:08.17555+00	2026-06-29 05:27:51.244557+00	2026-06-29 05:31:08.17856+00	121	121	\N
2e1f6fe9-9900-4809-ab4e-d463a355a9db	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	117220d5-0fb8-49ce-84f8-691888c3908b	egress-a05a653c-04a9-4cbd-b2ff-2b864b4273db	ENDED	\N	0	2026-06-29 05:32:52.794121+00	2026-06-29 05:33:54.664846+00	2026-06-29 05:32:52.794626+00	2026-06-29 05:33:54.669494+00	123	123	\N
c4696390-4786-46cd-bd07-719a22899bc8	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	74bcfe2d-9c98-4e22-b73e-baede0037347	egress-deb8e358-edf2-4eea-a2bd-e996b5c165db	ENDED	\N	0	2026-06-29 05:34:04.817875+00	2026-06-29 05:35:28.930325+00	2026-06-29 05:34:04.818875+00	2026-06-29 05:35:28.931319+00	a	a	\N
9da1af0d-036d-4784-bbe0-009c9cfb9836	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	2e6d314e-93e0-47e5-98d3-343d3d0ac407	egress-994a16b4-f364-4dc3-b925-b7a0acebe1cf	ENDED	\N	0	2026-06-29 05:48:21.338115+00	2026-06-29 05:49:43.986204+00	2026-06-29 05:48:21.345655+00	2026-06-29 05:49:43.9902+00	babc	aa	/9j/4AAQSkZJRgABAQAAAQABAAD/4QGgRXhpZgAATU0AKgAAAAgABgEQAAIAAAAVAAAAVgEAAAQAAAABAAAFoAEBAAQAAAABAAAHgAEyAAIAAAAUAAAAa4dpAAQAAAABAAAAhgEPAAIAAAAHAAAAfwAAAABzZGtfZ3Bob25lMTZrX3g4Nl82NAAyMDI2OjA2OjI5IDEyOjQ3OjMwAEdvb2dsZQAAEIKdAAUAAAABAAABSIKaAAUAAAABAAABUJKSAAIAAAAEMDI4AJKRAAIAAAAEMDI4AJKQAAIAAAAEMDI4AJIKAAUAAAABAAABWJIJAAMAAAABAAAAAIgnAAMAAAABAGQAAJAEAAIAAAAUAAABYJADAAIAAAAUAAABdKADAAQAAAABAAAHgKQDAAMAAAABAAAAAKACAAQAAAABAAAFoJICAAUAAAABAAABiJIBAAoAAAABAAABkJAAAAcAAAAEMDIyMAAAAK0AAABkACKgxzuaygAAABEcAAAD6DIwMjY6MDY6MjkgMTI6NDc6MzAAMjAyNjowNjoyOSAxMjo0NzozMAAAAACeAAAAZAAAIk8AAAPo/9sAhAANCQoLCggNCwoLDg4NDxMgFRMSEhMnHB4XIC4pMTAuKS0sMzpKPjM2RjcsLUBXQUZMTlJTUjI+WmFaUGBKUVJPAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCANVAoADAREAAhEBAxEB/8QBogAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoLEAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+foBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxEAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDv64DIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAE3j3rD6xEnmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5ha3KCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCOvMMwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAJK9M0CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCOvMMwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAJK9M0CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCOvMMwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAJK9M0CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCh/aVn/AM9v/HT/AIV5lzK6D+0rP/nt/wCOn/Ci4XQf2lZ/89v/AB0/4UXC6D+0rP8A57f+On/Ci4XQf2lZ/wDPb/x0/wCFFwug/tKz/wCe3/jp/wAKLhdB/aVn/wA9v/HT/hRcLoP7Ss/+e3/jp/wouF0H9pWf/Pb/AMdP+FFwug/tKz/57f8Ajp/wouF0H9pWf/Pb/wAdP+FFwug/tKz/AOe3/jp/wouF0H9pWf8Az2/8dP8AhRcLoP7Ss/8Ant/46f8ACi4XQf2lZ/8APb/x0/4UXC6D+0rP/nt/46f8KLhdB/aVn/z2/wDHT/hRcLoP7Ss/+e3/AI6f8KLhdB/aVn/z2/8AHT/hRcLoP7Ss/wDnt/46f8KLhdB/aVn/AM9v/HT/AIUXC6D+0rP/AJ7f+On/AAouF0H9pWf/AD2/8dP+FFwug/tKz/57f+On/Ci4XQf2lZ/89v8Ax0/4UXC6D+0rP/nt/wCOn/Ci4XQf2lZ/89v/AB0/4UXC6D+0rP8A57f+On/Ci4XQf2lZ/wDPb/x0/wCFFwug/tKz/wCe3/jp/wAKLhdB/aVn/wA9v/HT/hRcLoP7Ss/+e3/jp/wouF0H9pWf/Pb/AMdP+FFwug/tKz/57f8Ajp/wouF0H9pWf/Pb/wAdP+FFwug/tKz/AOe3/jp/wouF0H9pWf8Az2/8dP8AhRcLoP7Ss/8Ant/46f8ACi4XQf2lZ/8APb/x0/4UXC6D+0rP/nt/46f8KLhdB/aVn/z2/wDHT/hRcLoP7Ss/+e3/AI6f8KLhdB/aVn/z2/8AHT/hRcLoP7Ss/wDnt/46f8KLhdB/aVn/AM9v/HT/AIUXC6D+0rP/AJ7f+On/AAouF0H9pWf/AD2/8dP+FFwug/tKz/57f+On/Ci4XRfr0zUKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOQryjAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDr69U3CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkK8owCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA6+vVNwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA5CvKMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOvr1TcKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOQryjAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAK09jU/lY7MKPY1P5WFmFHsan8rCzCj2NT+VhZhR7Gp/Kwswo9jU/lYWYUexqfysLMKPY1P5WFmdfXomwUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAV9CbBQAUAFABQAUAFABQB19cYwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA5CvKMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAr6E2CgAoAKACgAoAKACgDr64xhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFeUYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABX0JsFABQAUAFABQAUAFAHX1xjCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkK8owCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAIftdt/z8Q/99ivoTYPtdt/z8Q/99igA+123/PxD/wB9igA+123/AD8Q/wDfYoAPtdt/z8Q/99igA+123/PxD/32KAD7Xbf8/EP/AH2KAD7Xbf8APxD/AN9igDta4xhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFeUYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHH19CbBQAUAFABQAUAFABQB6/XGMKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOQryjAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4+voTYKACgAoAKACgAoAKAPX64xhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFeUYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHH19CbBQAUAFABQAUAFABQB6/XGMKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAFoAKACgAoAKACgAoAKACgAoAKACgDj68owCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOPr6E2CgAoAKACgAoAKACgD1+uMYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQAVqdAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHH0AFABQAUAFABQAUAFAHr9ZHOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUALWp0BQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcfQAUAFABQAUAFABQAUAevVkc4UAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQAtanQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx9ABQAUAFABQAUAFABQB69WRzhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFAC1qdAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHH0AFABQAUAFABQAUAFAHr1ZHOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAcx9quf+fiX/vs1qdAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQBDgelABgelABgelABgelABgelABgelABgelABgelAHrlZHOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAcnWp0BQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB63WRzhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFAHJ1qdAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAet1kc4UAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQBydanQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHrdZHOFABQAUAFABQAUAFABQAUAFABQBzn9qXv/Pb/wAcX/CgA/tS9/57f+OL/hQAf2pe/wDPb/xxf8KAD+1L3/nt/wCOL/hQAf2pe/8APb/x1f8ACvP9vPuZczD+1L3/AJ7f+Or/AIUe3n3DmYf2pe/89v8Ax1f8KPbz7hzMP7Uvf+e3/jq/4Ue3n3DmZTo9vPuHMwo9vPuHMwo9vPuHMwo9vPuHMzk69U7QoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA77+2rn+5D+R/xrz/rPkcfOH9tXP8Ach/I/wCNH1nyDnD+2rn+5D+R/wAaPrPkHOH9tXP9yH8j/jR9Z8g5zb3+1P6x5Fcwb/aj6x5BzBv9qPrHkHMG/wBqPrHkHMOrqKCgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgDk8V6P1jyN/b+QYo+seQe38gxR9Y8g9v5Bij6x5B7fyDFH1jyD2/kGKPrHkHt/IMUfWPIPb+QYo+seQe38hK19oY/XP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dCj2gfXP7oUe0D65/dOtryRBQAUAFAHV1RYUAFABQBJXpmgUAFABQByFABQAUAFABXlGAUAFABQAUAFABQAUAcrXSIKACgAoAKACgAoAKAGV0nKFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB1teadYUAFABQB1dUWFABQAUASV6ZoFABQAUAchQAUAFABQAV5RgFABQAUAFABQAUAFAHK10iCgAoAKACgAoAKACgBldJyhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAdbXmnWFABQAUAdXVFhQAUAFAElemaBQAUAFAHIUAFABQAUAFeUYBQAUAFABQAUAFABQBytdIgoAKACgAoAKACgAoAZXScoUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHW15p1hQAUAFAHV1RYUAFABQBJXpmgUAFABQByFABQAUAFABXlGAUAFABQAUAFABQAUAZX9jf8ATx/45/8AXrT2nkKwf2N/08f+Of8A16PaeQWD+xv+nj/xz/69HtPILB/Y3/Tx/wCOf/Xo9p5BYP7G/wCnj/xz/wCvR7TyCwf2N/08f+Of/Xo9p5BYP7G/6eP/ABz/AOvR7TyCwf2N/wBPH/jn/wBej2nkFih9k/2/0ruOUPsn+3+lAB9k/wBv9KAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP9v8ASgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/AG/0oAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/2/wBKAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP8Ab/SgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/b/AEoAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/wBv9KAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP9v8ASgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/AG/0oAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/2/wBKAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP8Ab/SgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/b/AEoAPsn+3+lAHSV5p1hQAUAFAHV1RYUAFABQBJXpmgUAFABQByFABQAUAFABXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBiV6RyBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAbdeadYUAFABQB1dUWFABQAUASV6ZoFABQAUAchQAUAFABQAV5RgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAYlekcgUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAG3XmnWFABQAUAdXVFhQAUAFAElemaBQAUAFAHIUAFABQAUAFeUYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAGJXpHIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBd/tW3/uy/kP8a4ORnWH9q2/92X8h/jRyMA/tW3/ALsv5D/GjkYB/atv/dl/If40cjA7H7XH/db8qCrh9rj/ALrflQFw+1x/3W/KgLh9rj/ut+VAXH/bov7r/kP8a7faw7l8yD7dF/df8h/jR7WHcOZB9ui/uv8AkP8AGj2sO4cyD7dF/df8h/jR7WHcOZHF/wBq2/8Acl/If40/aR7hzIP7Vt/7kv5D/Gj2ke4cyD+1bf8AuS/kP8aPaR7hzIP7Vt/7kv5D/Gj2ke4cyD+1bf8Auy/kP8a5Pq9TsZ2D+1bf+7L+Q/xo+r1OwWD+1bf+7L+Q/wAaPq9TsFg/tW3/ALsv5D/Gj6vU7BYP7Vt/7sv5D/Gj6vU7BYP7Vt/7sv5D/Gj6vU7BYP7Vt/7sv5D/ABo+r1OwWD+1bf8Auy/kP8aPq9TsFg/tW3/uy/kP8aPq9TsFg/tW3/uy/kP8aPq9TsFg/tW3/uy/kP8AGj6vU7BYP7Vt/wC7L+Q/xo+r1OwWD+1bf+7L+Q/xo+r1OwWD+1bf+7L+Q/xo+r1OwWD+1bf+7L+Q/wAaPq9TsFg/tW3/ALsv5D/Gj6vU7BYpV2HGFABQAUAFABQAUAFABWnsp9jX6vU7BR7KfYPq9TsFHsp9g+r1OwUeyn2D6vU7BR7KfYPq9TsFHsp9g+r1OwUeyn2D6vU7BR7KfYPq9TsFZmQUAFABQAUAFABQAUAFbfV6nY1+r1OwUfV6nYPq9TsFH1ep2D6vU7BR9Xqdg+r1OwUfV6nYPq9TsFH1ep2D6vU7BR9Xqdg+r1OwUfV6nYPq9TsFYmQUAFABQAUAFABQAUAFaeyn2Nfq9TsFHsp9g+r1OwUeyn2D6vU7BR7KfYPq9TsFHsp9g+r1OwUeyn2D6vU7BR7KfYPq9TsFHsp9g+r1OxTrgNgoAKACgDvakAoAKACgAoAKACgAoA4KqAKACgAoAK9AsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAuVkcIUAFABQAUAFABQAUAFegewFABQAUAFABQAUAFABXnnjhQAUAFABQAUAFABQAV7B7AUAFABQAUAFABQAUAFeOeOFABQAUAFABQAUAFABXoHsBQAUAFABQAUAFABQBTrxDiCgAoAKAO9qQCgAoAKACgAoAKACgDgqoAoAKACgAr0CwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgC5WRwhQAUAFABQAUAFABQAV6B7AUAFABQAUAFABQAUAFeeeOFABQAUAFABQAUAFABXsHsBQAUAFABQAUAFABQAV4544UAFABQAUAFABQAUAFegewFABQAUAFABQAUAFAFOvEOIKACgAoA72pAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKALlZHCFABQAUAFABQAUAFABXoHsBQAUAFABQAUAFABQAV5544UAFABQAUAFABQAUAFewewFABQAUAFABQAUAFABXjnjhQAUAFABQAUAFABQAV6B7AUAFABQAUAFABQAUASf2LqP/AD7/APj6/wCNeHc4g/sXUf8An3/8fX/Gi4B/Yuo/8+//AI+v+NFwD+xdR/59/wDx9f8AGi4HW0gCgAoAKACgAoAKACgDgqoAoAKACgAr0CwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgC5WRwhQAUAFAFL+1bH/AJ7/APjjf4VfJIv2cuwf2rY/89//ABxv8KOSQezl2D+1bH/nv/443+FHJIPZy7B/atj/AM9//HG/wo5JB7OXYZ/bem/8/P8A443+Fdp6of23pv8Az8/+ON/hQAf23pv/AD8/+ON/hQAf23pv/Pz/AOON/hQAf23pv/Pz/wCON/hQAf23pv8Az8/+ON/hQAf23pv/AD8/+ON/hQAf23pv/Pz/AOON/hQBoV5544UAFABQBB9st/8Anp+hoAPtlv8A89P0NAB9st/+en6GgA+2W/8Az0/Q0AH2y3/56foa9g9gPtlv/wA9P0NAB9st/wDnp+hoAPtlv/z0/Q0AH2y3/wCen6GgA+2W/wDz0/Q0AH2y3/56foaAD7Zb/wDPT9DQBPXjnjhQAUAFABQAUAFABQBn/wBt6b/z8/8Ajjf4V6B7Af23pv8Az8/+ON/hQAf23pv/AD8/+ON/hQAf23pv/Pz/AOON/hQAf23pv/Pz/wCON/hQAf23pv8Az8/+ON/hQAf23pv/AD8/+ON/hQAf23pv/Pz/AOON/hQB6DXhHEFABQAUAFABQAUAFABQAUAFABQBwVUAUAFABQAV6BYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBcrI4QoAKACgDi66TsCgAoAKAKdbnYFABQAUAFABQAUAFAHoFeeeOFABQAUAYdABQAUAFABXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAef16B7AUAFABQAUAFABQAUAe414RxBQAUAFABQAUAFABQAUAFABQAUAcFVAFABQAUAFegWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAXKyOEKACgAoA4uuk7AoAKACgCnW52BQAUAFABQAUAFABQB6BXnnjhQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFAHn9egewFABQAUAFABQAUAFAHuNeEcQUAFABQAUAFABQAUAFABQAUAFAHBVQBQAUAFABXoFhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAFysjhCgAoAKAOLrpOwKACgAoAp1udgUAFABQAUAFABQAUAegV5544UAFABQBh0AFABQAUAFewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQB5/XoHsBQAUAFABQAUAFABQB7jXhHEFABQAUAFABQAUAFABQAUAFABQBwVUAUAFABQAV2e1h3KuFHtYdwuFHtYdwuFHtYdwuFHtYdwuFHtYdwuFHtYdwuFHtYdwuFaDCgAoAKACgAoAKACgC5WRwhQAUAFAHF10nYFABQAUAU63OwKACgAoAKACgAoAKAPQK888cKACgAoAw6ACgAoAKACvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoA8/r0D2AoAKACgAoAKACgAoA9xrwjiCgAoAKACgAoAKACgAoAKACgAoA4KqAKACgAoAKACgAoAKACgAoAKACgAr0CwoAKACgAoAKACgAoAuVkcIUAFABQBxddJ2BQAUAFAFOtzsCgAoAKACgAoAKACgD0CvPPHCgAoAKAMOgAoAKACgAr2D2AoAKACgAoAKACgAoA3K8c8cKACgAoAKACgAoAKAPP69A9gKACgAoAKACgAoAKAPca8I4goAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACgAoAKACgAoAKACgAoAK9AsKACgAoAKACgAoAKALlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgDDoAKACgAoAK9g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgDgqoAoAKACgAoAKACgAoAKACgAoAKACvQLCgAoAKACgAoAKACgC5WRwhQAUAFAHF10nYFABQAUAU63OwKACgAoAKACgAoAKAPQK888cKACgAoAw6ACgAoAKACvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoA8/r0D2AoAKACgAoAKACgAoA9xrwjiCgAoAKACgAoAKACgAoAKACgAoA4KqAKACgAoAKACgAoAKACgAoAKACgAr0CwoAKACgAoAKACgAoAuVkcIUAFABQBxddJ2BQAUAFAFOtzsCgAoAKACgAoAKACgD0CvPPHCgAoAKAMOgAoAKACgAr2D2AoAKACgAoAKACgAoA3K8c8cKACgAoAKACgAoAKAPP69A9gKACgAoAKACgAoAKAPca8I4goAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KqAKACgAoAK9AsKACgAoAKACgAoAKALlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgDDoAKACgAoAK9g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgC5WRwhQAUAFAHF10nYFABQAUAU63OwKACgAoAKACgAoAKAPQK888cKACgAoAw6ACgAoAKACvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoA8/r0D2AoAKACgAoAKACgAoA9xrwjiCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDgqoAoAKACgAr0CwoAKACgAoAKACgAoAuVkcIUAFABQBxddJ2BQAUAFAFOtzsCgAoAKACgAoAKACgD0CvPPHCgAoAKAMOgAoAKACgAr2D2AoAKACgAoAKACgAoA3K8c8cKACgAoAKACgAoAKAPP69A9gKACgAoAKACgAoAKAPca8I4goAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KqAKACgAoAK9AsKACgAoAKACgAoAKALlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgDDoAKACgAoAK9g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAK/2Gz/59IP8Av2KAD7DZ/wDPpB/37FAB9hs/+fSD/v2KAD7DZ/8APpB/37FAC/YbP/n0g/79igA+w2f/AD6Qf9+xQAfYbP8A59IP+/YoAPsNn/z6Qf8AfsUAH2Gz/wCfSD/v2KAD7DZ/8+kH/fsUAH2Gz/59IP8Av2KAD7DZ/wDPpB/37FAHK12nIFABQAUAQ/Y7X/n2h/79inzMfNLuH2O1/wCfaH/v2KOZhzS7h9jtf+faH/v2KOZhzS7h9jtf+faH/v2KOZhzS7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7k1IQUAFABQBh0AFABQAUAFewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQBD9ktf+faH/v2KfMx8z7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7h9ktf+faH/AL9ijmYcz7nb1wnUFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHHV2nIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAdjXEdYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcdXacgUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAYdABQAUAFABXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAFABQAUAFABQAUAFABQB2NcR1hQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx1dpyBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBh0AFABQAUAFewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHY1xHWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHHV2nIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAdjXEdYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcdXacgUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAYdABQAUAFABXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAFABQAUAFABQAUAFABQB2NcR1hQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx1dpyBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBh0AFABQAUAFewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHY1xHWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHHV2nIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAdjXEdYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcL5r/3v0r0bIXs49g81/wC9+lFkHs49g81/736UWQezj2DzX/vfpRZB7OPYPNf+9+lFkHs49g81/wC9+lFkHs49g81/736UWQezj2DzX/vfpRZB7OPYPNf+9+lFkHs49g81/wC9+lFkHs49g81/736UWQezj2DzX/vfpRZB7OPYPNf+9+lFkHs49g81/wC9+lFkHs49g81/736UWQezj2DzX/vfpRZB7OPYPNf+9+lFkHs49g81/wC9+lFkHs49g81/736UWQezj2DzX/vfpRZB7OPYg8mP+7+posg9nHsHkx/3f1NFkHs49g8mP+7+posg9nHsHkx/3f1NFkHs49g8iP8Au/rW3tp9zbnkHkR/3f1o9tPuHPIPIj/u/rR7afcOeQeRH/d/Wj20+4c8g8iP+7+tHtp9w55B5Ef939aPbT7hzyDyI/7v60e2n3DnkHkR/wB39aPbT7hzyJ/Nf+9+lY2Rj7OPYPNf+9+lFkHs49g81/736UWQezj2DzX/AL36UWQezj2DzX/vfpRZB7OPYPNf+9+lFkHs49g81/736UWQezj2DzX/AL36UWQezj2DzX/vfpRZB7OPYPNf+9+lFkHs49g81/736UWQezj2DzX/AL36UWQezj2DzX/vfpRZB7OPYPNf+9+lFkHs49g81/736UWQezj2DzX/AL36UWQezj2O6rzhhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVekWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB3teaQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHBV6RYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHe15pAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcFXpFhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAd7XmkBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVekWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB3teaQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHBV6RYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHe15pAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcFXpFhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAd7XmkBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVekWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB3teaQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHBV6RYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHe15pAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcFXpFhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAd7XmkBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVekWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB3teaQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHBV6RYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHe15pAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcFXpFhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAd7XmkBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVekWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB3teaQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHBV6RYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHe15pAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcFXpFhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAd7XmkBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVekWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB//2Q==
bab094c7-1072-4efd-b2d3-95e48e5c99d3	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	c7bfd4b1-662d-49e8-88e9-00d1ce4753dd	egress-27c5d325-d7e4-492e-99e4-c69a24c7251e	ENDED	\N	0	2026-06-29 05:52:15.323943+00	2026-06-29 05:53:10.98532+00	2026-06-29 05:52:15.325448+00	2026-06-29 05:53:10.986755+00	a	a	\N
b6fb2f3f-8817-4097-9c77-1703ec28be22	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	81b856e9-97fd-4383-9b3d-fd2bee4f67df	egress-bda48c8d-a986-49fa-b1dd-73d27481ad41	ENDED	\N	0	2026-06-29 05:54:05.095907+00	2026-06-29 05:54:26.627748+00	2026-06-29 05:54:05.096913+00	2026-06-29 05:54:26.628752+00	a	a	/9j/4AAQSkZJRgABAQAAAQABAAD/4QGgRXhpZgAATU0AKgAAAAgABgEQAAIAAAAVAAAAVgEAAAQAAAABAAAFoAEBAAQAAAABAAAHgAEyAAIAAAAUAAAAa4dpAAQAAAABAAAAhgEPAAIAAAAHAAAAfwAAAABzZGtfZ3Bob25lMTZrX3g4Nl82NAAyMDI2OjA2OjI5IDEyOjUzOjAxAEdvb2dsZQAAEIKdAAUAAAABAAABSIKaAAUAAAABAAABUJKSAAIAAAAEMzM4AJKRAAIAAAAEMzM4AJKQAAIAAAAEMzM4AJIKAAUAAAABAAABWJIJAAMAAAABAAAAAIgnAAMAAAABAGQAAJAEAAIAAAAUAAABYJADAAIAAAAUAAABdKADAAQAAAABAAAHgKQDAAMAAAABAAAAAKACAAQAAAABAAAFoJICAAUAAAABAAABiJIBAAoAAAABAAABkJAAAAcAAAAEMDIyMAAAAK0AAABkACKgxzuaygAAABEcAAAD6DIwMjY6MDY6MjkgMTI6NTM6MDEAMjAyNjowNjoyOSAxMjo1MzowMQAAAACeAAAAZAAAIk8AAAPo/9sAhAANCQoLCggNCwoLDg4NDxMgFRMSEhMnHB4XIC4pMTAuKS0sMzpKPjM2RjcsLUBXQUZMTlJTUjI+WmFaUGBKUVJPAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCANVAoADAREAAhEBAxEB/8QBogAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoLEAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+foBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxEAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDv64DIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAE3j3rD6xEnmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5g3j3o+sRDmDePej6xEOYN496PrEQ5ha3KCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCOvMMwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAJK9M0CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCOvMMwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAJK9M0CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCOvMMwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAJK9M0CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAKn9qWX/Pb/xxv8KAD+1LL/nt/wCON/hQAf2pZf8APb/xxv8ACgA/tSy/57f+ON/hQBH/AGlZ/wDPb/x0/wCFeZcyug/tKz/57f8Ajp/wouF0H9pWf/Pb/wAdP+FFwug/tKz/AOe3/jp/wouF0H9pWf8Az2/8dP8AhRcLoP7Ss/8Ant/46f8ACi4XQf2lZ/8APb/x0/4UXC6D+0rP/nt/46f8KLhdB/aVn/z2/wDHT/hRcLoP7Ss/+e3/AI6f8KLhdB/aVn/z2/8AHT/hRcLoP7Ss/wDnt/46f8KLhdB/aVn/AM9v/HT/AIUXC6D+0rP/AJ7f+On/AAouF0H9pWf/AD2/8dP+FFwug/tKz/57f+On/Ci4XQf2lZ/89v8Ax0/4UXC6D+0rP/nt/wCOn/Ci4XQf2lZ/89v/AB0/4UXC6D+0rP8A57f+On/Ci4XQf2lZ/wDPb/x0/wCFFwug/tKz/wCe3/jp/wAKLhdB/aVn/wA9v/HT/hRcLoP7Ss/+e3/jp/wouF0H9pWf/Pb/AMdP+FFwug/tKz/57f8Ajp/wouF0H9pWf/Pb/wAdP+FFwug/tKz/AOe3/jp/wouF0H9pWf8Az2/8dP8AhRcLoP7Ss/8Ant/46f8ACi4XQf2lZ/8APb/x0/4UXC6D+0rP/nt/46f8KLhdB/aVn/z2/wDHT/hRcLoP7Ss/+e3/AI6f8KLhdB/aVn/z2/8AHT/hRcLoP7Ss/wDnt/46f8KLhdB/aVn/AM9v/HT/AIUXC6D+0rP/AJ7f+On/AAouF0H9pWf/AD2/8dP+FFwug/tKz/57f+On/Ci4XQf2lZ/89v8Ax0/4UXC6D+0rP/nt/wCOn/Ci4XQf2lZ/89v/AB0/4UXC6D+0rP8A57f+On/Ci4XQf2lZ/wDPb/x0/wCFFwug/tKz/wCe3/jp/wAKLhdB/aVn/wA9v/HT/hRcLoP7Ss/+e3/jp/wouF0X69M1CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA6+vVNwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkKACgAoAKACvKMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOvr1TcKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDr69U3CgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACtPY1P5WOzCj2NT+VhZhR7Gp/Kwswo9jU/lYWYUexqfysLMKPY1P5WFmFHsan8rCzCj2NT+VhZnX16JsFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQAV5RgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFfQmwUAFABQAUAFABQAUAdfXGMKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAK+hNgoAKACgAoAKACgAoA6+uMYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFABXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAV9CbBQAUAFABQAUAFABQB19cYwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkKACgAoAKACvKMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCH7Xbf8/EP/fYr6E2D7Xbf8/EP/fYoAPtdt/z8Q/8AfYoAPtdt/wA/EP8A32KAD7Xbf8/EP/fYoAPtdt/z8Q/99igA+123/PxD/wB9igA+123/AD8Q/wDfYoA7WuMYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFABXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx9fQmwUAFABQAUAFABQAUAev1xjCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOPr6E2CgAoAKACgAoAKACgD1+uMYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFABXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx9fQmwUAFABQAUAFABQAUAev1xjCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBaACgAoAKACgAoAKACgDj6ACgAoAKACvKMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDj6+hNgoAKACgAoAKACgAoA9frjGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAFanQFABQAUALQAUAFABQAlABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHH0AFABQAUAFABQAUAFAHr9ZHOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUALWp0BQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcfQAUAFABQAUAFABQAUAevVkc4UAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQAtanQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx9ABQAUAFABQAUAFABQB69WRzhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFAC1qdAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHH0AFABQAUAFABQAUAFAHr1ZHOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAcx9quf8An4l/77NanQH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAEOB6UAGB6UAGB6UAGB6UAGB6UAGB6UAGB6UAGB6UAeuVkc4UAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQBydanQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHrdZHOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAcnWp0BQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB63WRzhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFAHJ1qdAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAet1kc4UAFABQAUAFABQAUAFABQAUAFAHOf2pe/8APb/xxf8ACgA/tS9/57f+OL/hQAf2pe/89v8Axxf8KAD+1L3/AJ7f+OL/AIUAH9qXv/Pb/wAdX/CvP9vPuZczD+1L3/nt/wCOr/hR7efcOZh/al7/AM9v/HV/wo9vPuHMw/tS9/57f+Or/hR7efcOZlOj28+4czCj28+4czCj28+4czCj28+4czOTr1TtCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKAOTr2jvCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKAOTr2jvCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKAOTr2jvCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKAOTr2jvCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKAOTr2jvCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKAOTr2jvCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKAOTr2jvCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKAOTxXo/WPI39v5Bij6x5B7fyDFH1jyD2/kGKPrHkHt/IMUfWPIPb+QYo+seQe38gxR9Y8g9v5Bij6x5B7fyErX2hj9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn909cpGwUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAFeUYBQAUAFABQAUAFABQBytdIgoAKACgAoAKACgAoAZXScoUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHrlWekFABQAUAFABQAUAFABQAUAFABQByFABQAUAFABXlGAUAFABQAUAFABQAUAcrXSIKACgAoAKACgAoAKAGV0nKFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB65VnpBQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQAV5RgFABQAUAFABQAUAFAHK10iCgAoAKACgAoAKACgBldJyhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAeuVZ6QUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAFeUYBQAUAFABQAUAFABQBlf2N/08f+Of8A1609p5CsH9jf9PH/AI5/9ej2nkFg/sb/AKeP/HP/AK9HtPILB/Y3/Tx/45/9ej2nkFij9m/2/wBKftPILB9m/wBv9KPaeQWD7N/t/pR7TyCwfZv9v9KPaeQWE+yf7f6V2nKH2T/b/SgA+yf7f6UAH2T/AG/0oAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/2/wBKAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP8Ab/SgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/b/AEoAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/wBv9KAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP9v8ASgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/AG/0oAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/2/wBKAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP8Ab/SgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/b/AEoAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/wBv9KAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP9v8ASgD1OrPSCgAoAKACgAoAKACgAoAKACgAoA5CgAoAKACgAryjAKACgAoAKACgAoAKACgAoAKACgDFpgFABQAUAJXonIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB6VVnpBQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQAV5RgFABQAUAFABQAUAFABQAUAFABQBi0wCgAoAKAEr0TkCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9Kqz0goAKACgAoAKACgAoAKACgAoAKAOQoAKACgAoAK8owCgAoAKACgAoAKACgAoAKACgAoAxKYBQAUAFABXonIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB6D9ui/uv8AkP8AGp9rDuehzIPt0X91/wAh/jR7WHcOZB9ui/uv+Q/xo9rDuHMg+3Rf3X/If40e1h3DmQfbov7r/kP8aPaw7hzIPt0X91/yH+NHtYdw5kH26L+6/wCQ/wAaPaw7hzIPt0X91/yH+NHtYdw5kH26L+6/5D/Gj2sO4cyD7dF/df8AIf40e1h3DmQfbov7r/kP8aPaw7hzIPt0X91/yH+NHtYdw5kcX/atv/cl/If40/aR7hzIP7Vt/wC5L+Q/xo9pHuHMg/tW3/uS/kP8aPaR7hzIP7Vt/wC5L+Q/xo9pHuHMg/tW3/uy/kP8a5Pq9TsZ2D+1bf8Auy/kP8aPq9TsFg/tW3/uy/kP8aPq9TsFg/tW3/uy/kP8aPq9TsFg/tW3/uy/kP8AGj6vU7BYP7Vt/wC7L+Q/xo+r1OwWD+1bf+7L+Q/xo+r1OwWD+1bf+7L+Q/xo+r1OwWD+1bf+7L+Q/wAaPq9TsFg/tW3/ALsv5D/Gj6vU7BYP7Vt/7sv5D/Gj6vU7BYP7Vt/7sv5D/Gj6vU7BYpUewqdgsFHsKnYLBR7Cp2CwUewqdgsFdhxhQAUAFABQAUAFABQAVp7KfY1+r1OwUeyn2D6vU7BR7KfYPq9TsFHsp9g+r1OwUeyn2D6vU7BR7KfYPq9TsFHsp9g+r1OwUeyn2D6vU7BWZkFABQAUAFABQAUAFABW31ep2Nfq9TsFH1ep2D6vU7BR9Xqdg+r1OwUfV6nYPq9TsFH1ep2D6vU7BR9Xqdg+r1OwUfV6nYPq9TsFH1ep2D6vU7BWJkFABQAUAFABQAUAFABWnsp9jX6vU7BR7KfYPq9TsFHsp9g+r1OwUeyn2D6vU7BR7KfYPq9TsFHsp9g+r1OwUeyn2D6vU7BR7KfYPq9TsdjXnGwUAFABQAUAFABQAUAFABQAUAFAHBVQBQAUAFABXoFhQAUAFABQAUAFABQAUAFABQAUAXaACgAoAKAErI4QoAKACgAoAKACgAoAK9A9gKACgAoAKACgAoAKACvPPHCgAoAKACgAoAKACgAr2D2AoAKACgAoAKACgAoAK8c8cKACgAoAKACgAoAKACvQPYCgAoAKACgAoAKACgDsa8I4goAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAu0AFABQAUAJWRwhQAUAFABQAUAFABQAV6B7AUAFABQAUAFABQAUAFeeeOFABQAUAFABQAUAFABXsHsBQAUAFABQAUAFABQAV4544UAFABQAUAFABQAUAFegewFABQAUAFABQAUAFAHY14RxBQAUAFABQAUAFABQAUAFABQAUAcFVAFABQAUAFegWFABQAUAFABQAUAFABQAUAFABQBdoAKACgAoASsjhCgAoAKACgAoAKACgAr0D2AoAKACgAoAKACgAoAK888cKACgAoAKACgAoAKACvYPYCgAoAKACgAoAKACgArxzxwoAKACgAoAKACgAoAK9A9gKACgAoAKACgAoAKAOxrwjiCgAoAKACgAoAKACgAoAKACgAoA4KqAKACgAoAK9AsKACgAoAKACgAoAKACgAoAKACgC7QAUAFABQAlZHCFABQAUAUv7Vsf8Anv8A+ON/hV8ki/Zy7B/atj/z3/8AHG/wo5JB7OXYP7Vsf+e//jjf4Uckg9nLsH9q2P8Az3/8cb/CjkkHs5dhn9t6b/z8/wDjjf4V2nqh/bem/wDPz/443+FAB/bem/8APz/443+FAB/bem/8/P8A443+FAB/bem/8/P/AI43+FAB/bem/wDPz/443+FAB/bem/8APz/443+FAB/bem/8/P8A443+FAGhXnnjhQAUAFAEH2y3/wCen6GgA+2W/wDz0/Q0AH2y3/56foaAD7Zb/wDPT9DQAfbLf/np+hr2D2A+2W//AD0/Q0AH2y3/AOen6GgA+2W//PT9DQAfbLf/AJ6foaAD7Zb/APPT9DQAfbLf/np+hoAPtlv/AM9P0NAE9eOeOFABQAUAFABQAUAFAGf/AG3pv/Pz/wCON/hXoHsB/bem/wDPz/443+FAB/bem/8APz/443+FAB/bem/8/P8A443+FAB/bem/8/P/AI43+FAB/bem/wDPz/443+FAB/bem/8APz/443+FAB/bem/8/P8A443+FAHoNeEcQUAFABQAUAFABQAUAFABQAUAFAHBVQBQAUAFABXoFhQAUAFABQAUAFABQAUAFABQAUAXaACgAoAKAErI4QoAKACgDi66TsCgAoAKAKdbnYFABQAUAFABQAUAFAHoFeeeOFABQAUAYdABQAUAFABXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAef16B7AUAFABQAUAFABQAUAe414RxBQAUAFABQAUAFABQAUAFABQAUAcFVAFABQAUAFegWFABQAUAFABQAUAFABQAUAFABQBdoAKACgAoASsjhCgAoAKAOLrpOwKACgAoAp1udgUAFABQAUAFABQAUAegV5544UAFABQBh0AFABQAUAFewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQB5/XoHsBQAUAFABQAUAFABQB7jXhHEFABQAUAFABQAUAFABQAUAFABQBwVUAUAFABQAV6BYUAFABQAUAFABQAUAFABQAUAFAF2gAoAKACgBKyOEKACgAoA4uuk7AoAKACgCnW52BQAUAFABQAUAFABQB6BXnnjhQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFAHn9egewFABQAUAFABQAUAFAHuNeEcQUAFABQAUAFABQAUAFABQAUAFAHBVQBQAUAFABXZ7WHcq4Ue1h3C4Ue1h3C4Ue1h3C4Ue1h3C4Ue1h3C4Ue1h3C4Ue1h3C4VoMKACgAoAu0AFABQAUAJWRwhQAUAFAHF10nYFABQAUAU63OwKACgAoAKACgAoAKAPQK888cKACgAoAw6ACgAoAKACvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoA8/r0D2AoAKACgAoAKACgAoA9xrwjiCgAoAKACgAoAKACgAoAKACgAoA4KqAKACgAoAKACgAoAKACgAoAKACgAr0CwoAKACgC7QAUAFABQAlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgDDoAKACgAoAK9g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgDgqoAoAKACgAoAKACgAoAKACgAoAKACvQLCgAoAKALtABQAUAFACVkcIUAFABQBxddJ2BQAUAFAFOtzsCgAoAKACgAoAKACgD0CvPPHCgAoAKAMOgAoAKACgAr2D2AoAKACgAoAKACgAoA3K8c8cKACgAoAKACgAoAKAPP69A9gKACgAoAKACgAoAKAPca8I4goAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACgAoAKACgAoAKACgAoAK9AsKACgAoAu0AFABQAUAJWRwhQAUAFAHF10nYFABQAUAU63OwKACgAoAKACgAoAKAPQK888cKACgAoAw6ACgAoAKACvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoA8/r0D2AoAKACgAoAKACgAoA9xrwjiCgAoAKACgAoAKACgAoAKACgAoA4KqAKACgAoAKACgAoAKACgAoAKACgAr0CwoAKACgC7QAUAFABQAlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgDDoAKACgAoAK9g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKALtABQAUAFACVkcIUAFABQBxddJ2BQAUAFAFOtzsCgAoAKACgAoAKACgD0CvPPHCgAoAKAMOgAoAKACgAr2D2AoAKACgAoAKACgAoA3K8c8cKACgAoAKACgAoAKAPP69A9gKACgAoAKACgAoAKAPca8I4goAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KqAKACgAoAK9AsKACgAoAu0AFABQAUAJWRwhQAUAFAHF10nYFABQAUAU63OwKACgAoAKACgAoAKAPQK888cKACgAoAw6ACgAoAKACvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoA8/r0D2AoAKACgAoAKACgAoA9xrwjiCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDgqoAoAKACgAr0CwoAKACgC7QAUAFABQAlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgDDoAKACgAoAK9g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKALlABQAUAFABWRwhQAUAFAHF10nYFABQAUAU63OwKACgAoAKACgAoAKAPQK888cKACgAoAw6ACgAoAKACvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoA8/r0D2AoAKACgAoAKACgAoA9xrwjiCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCv9hs/+fSD/v2KAD7DZ/8APpB/37FAB9hs/wDn0g/79igA+w2f/PpB/wB+xQAv2Gz/AOfSD/v2KAD7DZ/8+kH/AH7FAB9hs/8An0g/79igA+w2f/PpB/37FAHK0AFABQAUAFdpyBQAUAFAEP2O1/59of8Av2KfMx80u4fY7X/n2h/79ijmYc0u4fY7X/n2h/79ijmYc0u4fY7X/n2h/wC/Yo5mHNLuH2S1/wCfaH/v2KOZhzPuH2S1/wCfaH/v2KOZhzPuH2S1/wCfaH/v2KOZhzPuH2S1/wCfaH/v2KOZhzPuH2S1/wCfaH/v2KOZhzPuH2S1/wCfaH/v2KOZhzPuH2S1/wCfaH/v2KOZhzPuH2S1/wCfaH/v2KOZhzPuTUhBQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFAEP2S1/59of8Av2KfMx8z7h9ktf8An2h/79ijmYcz7h9ktf8An2h/79ijmYcz7h9ktf8An2h/79ijmYcz7h9ktf8An2h/79ijmYcz7h9ktf8An2h/79ijmYcz7h9ktf8An2h/79ijmYcz7h9ktf8An2h/79ijmYcz7nb1wnUFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcdQAUAFABQAV2nIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAdjXEdYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx1ABQAUAFABXacgUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAYdABQAUAFABXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAFABQAUAFABQAUAFABQB2NcR1hQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHHUAFABQAUAFdpyBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBh0AFABQAUAFewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHY1xHWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcdQAUAFABQAV2nIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAdjXEdYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx1ABQAUAFABXacgUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAYdABQAUAFABXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAFABQAUAFABQAUAFABQB2NcR1hQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHHUAFABQAUAFdpyBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBh0AFABQAUAFewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHY1xHWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcdQAUAFABQAV2nIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAGHQAUAFABQAV7B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAdjXEdYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwvmv/AHv0p2APNf8AvfpRYA81/wC9+lFgDzX/AL36UWAPNf8AvfpXoWQvZx7B5r/3v0osg9nHsHmv/e/SiyD2cewea/8Ae/SiyD2cewea/wDe/SiyD2cewea/979KLIPZx7B5r/3v0osg9nHsHmv/AHv0osg9nHsHmv8A3v0osg9nHsHmv/e/SiyD2cewea/979KLIPZx7B5r/wB79KLIPZx7B5r/AN79KLIPZx7B5r/3v0osg9nHsHmv/e/SiyD2cewea/8Ae/SiyD2cewea/wDe/SiyD2cewea/979KLIPZx7B5r/3v0osg9nHsHmv/AHv0osg9nHsQeTH/AHf1NFkHs49g8mP+7+posg9nHsHkx/3f1NFkHs49g8mP+7+posg9nHsHkR/3f1rb20+5tzyDyI/7v60e2n3DnkHkR/3f1o9tPuHPIPIj/u/rR7afcOeQeRH/AHf1o9tPuHPIPIj/ALv60e2n3DnkHkR/3f1o9tPuHPIPIj/u/rR7afcOeRP5r/3v0rGyMfZx7B5r/wB79KLIPZx7B5r/AN79KLIPZx7B5r/3v0osg9nHsHmv/e/SiyD2cewea/8Ae/SiyD2cewea/wDe/SiyD2cewea/979KLIPZx7B5r/3v0osg9nHsHmv/AHv0osg9nHsHmv8A3v0osg9nHsHmv/e/SiyD2cewea/979KLIPZx7B5r/wB79KLIPZx7B5r/AN79KLIPZx7B5r/3v0osg9nHsd1XnDCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCqgCgAoAKACvQLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA//Z
e96881a8-f6a6-4210-8650-b18a0d250dc5	00000000-0000-0000-0000-000000000000	54f06fb0-0e6e-434c-a41d-f344653f021d	2dc7645a-abc1-4e74-801d-8beed8668a0c	egress-bdfc292c-61d6-4d7e-8f7c-d8215a1c6e32	ENDED	\N	0	2026-06-30 15:10:19.822962+00	2026-06-30 15:11:15.427164+00	2026-06-30 15:10:19.979221+00	2026-06-30 15:11:15.443331+00	12	12	/9j/4AAQSkZJRgABAQAAAQABAAD/4QGgRXhpZgAATU0AKgAAAAgABgEQAAIAAAAVAAAAVgEAAAQAAAABAAAFoAEBAAQAAAABAAAHgAEyAAIAAAAUAAAAa4dpAAQAAAABAAAAhgEPAAIAAAAHAAAAfwAAAABzZGtfZ3Bob25lMTZrX3g4Nl82NAAyMDI2OjA2OjMwIDIyOjEwOjA1AEdvb2dsZQAAEIKdAAUAAAABAAABSIKaAAUAAAABAAABUJKSAAIAAAAEMjYxAJKRAAIAAAAEMjYxAJKQAAIAAAAEMjYxAJIKAAUAAAABAAABWJIJAAMAAAABAAAAAIgnAAMAAAABAGQAAJAEAAIAAAAUAAABYJADAAIAAAAUAAABdKADAAQAAAABAAAHgKQDAAMAAAABAAAAAKACAAQAAAABAAAFoJICAAUAAAABAAABiJIBAAoAAAABAAABkJAAAAcAAAAEMDIyMAAAAK0AAABkACKgxzuaygAAABEcAAAD6DIwMjY6MDY6MzAgMjI6MTA6MDUAMjAyNjowNjozMCAyMjoxMDowNQAAAACeAAAAZAAAIk8AAAPo/9sAhAANCQoLCggNCwoLDg4NDxMgFRMSEhMnHB4XIC4pMTAuKS0sMzpKPjM2RjcsLUBXQUZMTlJTUjI+WmFaUGBKUVJPAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCANVAoADAREAAhEBAxEB/8QBogAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoLEAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+foBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxEAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDv64DIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCL7Xa/8/MP/AH2Kj2ke4roPtdr/AM/MP/fYo9pHuF0H2u1/5+Yf++xR7SPcLoPtdr/z8w/99ij2ke4XQfa7X/n5h/77FHtI9wug+12v/PzD/wB9ij2ke4XQfa7X/n5h/wC+xR7SPcLoPtdr/wA/MP8A32KPaR7hdB9rtf8An5h/77FHtI9wug+12v8Az8w/99ij2ke4XQfa7X/n5h/77FHtI9wug+12v/PzD/32KPaR7hdB9rtf+fmH/vsUe0j3C6D7Xa/8/MP/AH2KPaR7hdB9rtf+fmH/AL7FHtI9wug+12v/AD8w/wDfYo9pHuF0H2u1/wCfmH/vsUe0j3C6D7Xa/wDPzD/32KPaR7hdB9rtf+fmH/vsUe0j3C6D7Xa/8/MP/fYo9pHuF0H2u1/5+Yf++xR7SPcLoPtdr/z8w/8AfYo9pHuF0H2u1/5+Yf8AvsUe0j3C6D7Xa/8APzD/AN9ij2ke4XQfa7X/AJ+Yf++xR7SPcLoPtdr/AM/MP/fYo9pHuF0H2u1/5+Yf++xR7SPcLoPtdr/z8w/99ij2ke4XQfa7X/n5h/77FHtI9wug+12v/PzD/wB9ij2ke4XQfa7X/n5h/wC+xR7SPcLoPtdr/wA/MP8A32KPaR7hdB9rtf8An5h/77FHtI9wug+12v8Az8w/99ij2ke4XQfa7X/n5h/77FHtI9wug+12v/PzD/32KPaR7hdB9rtf+fmH/vsUe0j3C6D7Xa/8/MP/AH2KPaR7hdB9rtf+fmH/AL7FHtI9wug+12v/AD8w/wDfYo9pHuF0H2u2/wCfmH/vsVpyvsMPtdt/z8w/99ijlfYA+123/PzD/wB9ijlfYA+123/PzD/32KOV9gD7Xbf8/MP/AH2KOV9gD7Xbf8/MP/fYo5X2APtdt/z8w/8AfYo5X2APtdt/z8w/99ijlfYCWkAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAV9CbBQAUAFABQAUAFABQB19cYwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA5CvKMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAr6E2CgAoAKACgAoAKACgDr64xhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFeUYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABX0JsFABQAUAFABQAUAFAHX1xjCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkK8owCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAIftdt/z8Q/8AfYr6E2D7Xbf8/EP/AH2KAD7Xbf8APxD/AN9igA+123/PxD/32KAD7Xbf8/EP/fYoAPtdt/z8Q/8AfYoAPtdt/wA/EP8A32KAD7Xbf8/EP/fYoA7WuMYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx9fQmwUAFABQAUAFABQAUAev1xjCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkK8owCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOPr6E2CgAoAKACgAoAKACgD1+uMYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx9fQmwUAFABQAUAFABQAUAev1xjCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBaACgAoAKACgAoAKACgAoAKACgAoA4+vKMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDj6+hNgoAKACgAoAKACgAoA9frjGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAFanQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx9ABQAUAFABQAUAFABQB6/WRzhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFAC1qdAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHH0AFABQAUAFABQAUAFAHr1ZHOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUALWp0BQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcfQAUAFABQAUAFABQAUAevVkc4UAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQAtanQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBx9ABQAUAFABQAUAFABQB69WRzhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFAHMfarn/n4l/wC+zWp0B9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAB9quf8An4l/77NAB9quf+fiX/vs0AH2q5/5+Jf++zQAfarn/n4l/wC+zQAfarn/AJ+Jf++zQAfarn/n4l/77NAB9quf+fiX/vs0AH2q5/5+Jf8Avs0AH2q5/wCfiX/vs0AH2q5/5+Jf++zQAfarn/n4l/77NAB9quf+fiX/AL7NAEOB6UAGB6UAGB6UAGB6UAGB6UAGB6UAGB6UAGB6UAeuVkc4UAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAchQAUAFABQBydanQFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHrdZHOFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHIUAFABQAUAcnWp0BQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB63WRzhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQByFABQAUAFAHJ1qdAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAet1kc4UAFABQAUAFABQAUAFABQAUAFABQAUAFABQAzcfWuH20+5F2G4+tHtp9wuw3H1o9tPuF2G4+tHtp9wuzk6n28+5PMwo9vPuHMwo9vPuHMwo9vPuHMzk69U7QoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKACgAoAKACgCOvMMwoAKACgDlKkgKACgAoA5OvaO8KACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAPW6yOcKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAjrzDMKACgAoA5SpICgAoAKAOTr2jvCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD1usjnCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAI68wzCgAoAKAOUqSAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKACgAoAKACgDA/te4/uRfkf8a8u5jcP7XuP7kX5H/Gi4XD+17j+5F+R/xouFw/te4/uRfkf8aLhcz6QgoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA9brI5woAKACgAoAKACgAoAKACgAoAKACgAoAKACgDkK8owCgAoAKACgAoAKACgDk69o7woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA77+2rn+5D+R/xrz/rPkcfOH9tXP9yH8j/jR9Z8g5w/tq5/uQ/kf8aPrPkHOH9tXP8Ach/I/wCNH1nyDnNvf7U/rHkVzBv9qPrHkHMG/wBqPrHkHMG/2o+seQcw6uooKACgAoAKACgAoAKAOQryjAKACgAoAKACgAoAKAOTxXo/WPI39v5Bij6x5B7fyDFH1jyD2/kGKPrHkHt/IMUfWPIPb+QYo+seQe38gxR9Y8g9v5Bij6x5B7fyErX2hj9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn90KPaB9c/uhR7QPrn9062vJEFABQAUAdXVFhQAUAFAElemaBQAUAFABQAUAFABQByFeUYBQAUAFABQAUAFABQBytdIgoAKACgAoAKACgAoAZXScoUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHW15p1hQAUAFAHV1RYUAFABQBJXpmgUAFABQAUAFABQAUAchXlGAUAFABQAUAFABQAUAcrXSIKACgAoAKACgAoAKAGV0nKFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB1teadYUAFABQB1dUWFABQAUASV6ZoFABQAUAFABQAUAFAHIV5RgFABQAUAFABQAUAFAHK10iCgAoAKACgAoAKACgBldJyhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAdbXmnWFABQAUAdXVFhQAUAFAElemaBQAUAFABQAUAFABQByFeUYBQAUAFABQAUAFABQBlf2N/08f+Of8A1609p5CsH9jf9PH/AI5/9ej2nkFg/sb/AKeP/HP/AK9HtPILB/Y3/Tx/45/9ej2nkFg/sb/p4/8AHP8A69HtPILB/Y3/AE8f+Of/AF6PaeQWD+xv+nj/AMc/+vR7TyCwf2N/08f+Of8A16PaeQWKH2T/AG/0ruOUPsn+3+lAB9k/2/0oAPsn+3+lAB9k/wBv9KAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP9v8ASgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/AG/0oAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/2/wBKAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP8Ab/SgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/b/AEoAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/wBv9KAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP9v8ASgA+yf7f6UAH2T/b/SgA+yf7f6UAH2T/AG/0oAPsn+3+lAB9k/2/0oAPsn+3+lAB9k/2/wBKAD7J/t/pQAfZP9v9KAD7J/t/pQAfZP8Ab/SgA+yf7f6UAH2T/b/SgA+yf7f6UAdJXmnWFABQAUAdXVFhQAUAFAElemaBQAUAFABQAUAFABQByFeUYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAGJXpHIFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBt15p1hQAUAFAHV1RYUAFABQBJXpmgUAFABQAUAFABQAUAchXlGAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBiV6RyBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAbdeadYUAFABQB1dUWFABQAUASV6ZoFABQAUAFABQAUAFAHIV5RgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAYlekcgUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAF3+1bf+7L+Q/xrg5GdYf2rb/3ZfyH+NHIwD+1bf+7L+Q/xo5GAf2rb/wB2X8h/jRyMDsftcf8Adb8qCrh9rj/ut+VAXD7XH/db8qAuH2uP+635UBcf9ui/uv8AkP8AGu32sO5fMg+3Rf3X/If40e1h3DmQfbov7r/kP8aPaw7hzIPt0X91/wAh/jR7WHcOZB9ui/uv+Q/xo9rDuHMg+3Rf3X/If40e1h3DmQfbov7r/kP8aPaw7hzIPt0X91/yH+NHtYdw5kcX/atv/dl/If41y/V6nYzsH9q2/wDdl/If40fV6nYLB/atv/dl/If40fV6nYLB/atv/dl/If40fV6nYLB/atv/AHZfyH+NH1ep2Cwf2rb/AN2X8h/jR9XqdgsH9q2/92X8h/jR9XqdgsH9q2/92X8h/jR9XqdgsH9q2/8Adl/If40fV6nYLB/atv8A3ZfyH+NH1ep2Cwf2rb/3ZfyH+NH1ep2Cwf2rb/3ZfyH+NH1ep2Cwf2rb/wB2X8h/jR9XqdgsH9q2/wDdl/If40fV6nYLB/atv/dl/If40fV6nYLB/atv/dl/If40fV6nYLFKuw4woAKACgAoAKACgAoAK09lPsa/V6nYKPZT7B9Xqdgo9lPsH1ep2Cj2U+wfV6nYKPZT7B9Xqdgo9lPsH1ep2Cj2U+wfV6nYKPZT7B9XqdgrMyCgAoAKACgAoAKACgArb6vU7Gv1ep2Cj6vU7B9Xqdgo+r1OwfV6nYKPq9TsH1ep2Cj6vU7B9Xqdgo+r1OwfV6nYKPq9TsH1ep2Cj6vU7B9XqdgrEyCgAoAKACgAoAKACgArT2U+xr9Xqdgo9lPsH1ep2Cj2U+wfV6nYKPZT7B9Xqdgo9lPsH1ep2Cj2U+wfV6nYKPZT7B9Xqdgo9lPsH1ep2KdcBsFABQAUAd7UgFABQAUAFABQAUAFABQAUAFABQBwVekWFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAXKyOEKACgAoAKACgAoAKACvQPYCgAoAKACgAoAKACgArzzxwoAKACgAoAKACgAoAK9g9gKACgAoAKACgAoAKACvHPHCgAoAKACgAoAKACgAr0D2AoAKACgAoAKACgAoAp14hxBQAUAFAHe1IBQAUAFABQAUAFABQAUAFABQAUAcFXpFhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAFysjhCgAoAKACgAoAKACgAr0D2AoAKACgAoAKACgAoAK888cKACgAoAKACgAoAKACvYPYCgAoAKACgAoAKACgArxzxwoAKACgAoAKACgAoAK9A9gKACgAoAKACgAoAKAKdeIcQUAFABQB3tSAUAFABQAUAFABQAUAFABQAUAFAHBV6RYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBcrI4QoAKACgAoAKACgAoAK9A9gKACgAoAKACgAoAKACvPPHCgAoAKACgAoAKACgAr2D2AoAKACgAoAKACgAoAK8c8cKACgAoAKACgAoAKACvQPYCgAoAKACgAoAKACgCT+xdR/59/wDx9f8AGvDucQf2LqP/AD7/APj6/wCNFwD+xdR/59//AB9f8aLgH9i6j/z7/wDj6/40XA62kAUAFABQAUAFABQAUAFABQAUAFAHBV6RYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBcrI4QoAKACgCl/atj/z3/wDHG/wq+SRfs5dg/tWx/wCe/wD443+FHJIPZy7B/atj/wA9/wDxxv8ACjkkHs5dg/tWx/57/wDjjf4Uckg9nLsM/tvTf+fn/wAcb/Cu09UP7b03/n5/8cb/AAoAP7b03/n5/wDHG/woAP7b03/n5/8AHG/woAP7b03/AJ+f/HG/woAP7b03/n5/8cb/AAoAP7b03/n5/wDHG/woAP7b03/n5/8AHG/woA0K888cKACgAoAKACgAoAKAIPtlv/z0/Q17B7AfbLf/AJ6foaAD7Zb/APPT9DQAfbLf/np+hoAPtlv/AM9P0NAB9st/+en6GgA+2W//AD0/Q0AH2y3/AOen6GgCevHPHCgAoAKACgAoAKACgDP/ALb03/n5/wDHG/wr0D2A/tvTf+fn/wAcb/CgA/tvTf8An5/8cb/CgA/tvTf+fn/xxv8ACgA/tvTf+fn/AMcb/CgA/tvTf+fn/wAcb/CgA/tvTf8An5/8cb/CgA/tvTf+fn/xxv8ACgD0GvCOIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KvSLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKALlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgAoAKACgAoAw69g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KvSLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKALlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgAoAKACgAoAw69g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KvSLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKALlZHCFABQAUAcXXSdgUAFABQBTrc7AoAKACgAoAKACgAoA9ArzzxwoAKACgAoAKACgAoAw69g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgDz+vQPYCgAoAKACgAoAKACgD3GvCOIKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4Ku72sO5Vwo9rDuFwo9rDuFwo9rDuFwo9rDuFwo9rDuFwo9rDuFwo9rDuFwrQYUAFABQAUAFABQAUAXKyOEKACgAoA4uuk7AoAKACgCnW52BQAUAFABQAUAFABQB6BXnnjhQAUAFABQAUAFABQBh17B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFAHn9egewFABQAUAFABQAUAFAHuNeEcQUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVUAUAFABQAUAFABQAUAFegWFABQAUAFABQAUAFAFysjhCgAoAKAOLrpOwKACgAoAp1udgUAFABQAUAFABQAUAegV5544UAFABQAUAFABQAUAYdewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQB5/XoHsBQAUAFABQAUAFABQB7jXhHEFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcFVAFABQAUAFABQAUAFABXoFhQAUAFABQAUAFABQBcrI4QoAKACgDi66TsCgAoAKAKdbnYFABQAUAFABQAUAFAHoFeeeOFABQAUAFABQAUAFAGHXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAef16B7AUAFABQAUAFABQAUAe414RxBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHBVQBQAUAFABQAUAFABQAV6BYUAFABQAUAFABQAUAXKyOEKACgAoA4uuk7AoAKACgCnW52BQAUAFABQAUAFABQB6BXnnjhQAUAFABQAUAFABQBh17B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFAHn9egewFABQAUAFABQAUAFAHuNeEcQUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVUAUAFABQAUAFABQAUAFegWFABQAUAFABQAUAFAFysjhCgAoAKAOLrpOwKACgAoAp1udgUAFABQAUAFABQAUAegV5544UAFABQAUAFABQAUAYdewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQB5/XoHsBQAUAFABQAUAFABQB7jXhHEFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHBVQBQAUAFABXoFhQAUAFABQAUAFABQBcrI4QoAKACgDi66TsCgAoAKAKdbnYFABQAUAFABQAUAFAHoFeeeOFABQAUAFABQAUAFAGHXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAef16B7AUAFABQAUAFABQAUAe414RxBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBwVUAUAFABQAV6BYUAFABQAUAFABQAUAXKyOEKACgAoA4uuk7AoAKACgCnW52BQAUAFABQAUAFABQB6BXnnjhQAUAFABQAUAFABQBh17B7AUAFABQAUAFABQAUAbleOeOFABQAUAFABQAUAFAHn9egewFABQAUAFABQAUAFAHuNeEcQUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAcFVAFABQAUAFegWFABQAUAFABQAUAFAFysjhCgAoAKAOLrpOwKACgAoAp1udgUAFABQAUAFABQAUAegV5544UAFABQAUAFABQAUAYdewewFABQAUAFABQAUAFAG5XjnjhQAUAFABQAUAFABQB5/XoHsBQAUAFABQAUAFABQB7jXhHEFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAHBVQBQAUAFABXoFhQAUAFABQAUAFABQBcrI4QoAKACgDi66TsCgAoAKAKdbnYFABQAUAFABQAUAFAHoFeeeOFABQAUAFABQAUAFAGHXsHsBQAUAFABQAUAFABQBuV4544UAFABQAUAFABQAUAef16B7AUAFABQAUAFABQAUAe414RxBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBX+w2f/AD6Qf9+xQAfYbP8A59IP+/YoAPsNn/z6Qf8AfsUAH2Gz/wCfSD/v2KAF+w2f/PpB/wB+xQAfYbP/AJ9IP+/YoAPsNn/z6Qf9+xQAfYbP/n0g/wC/YoAPsNn/AM+kH/fsUAH2Gz/59IP+/YoAPsNn/wA+kH/fsUAH2Gz/AOfSD/v2KAOVrtOQKACgAoAh+x2v/PtD/wB+xT5mPml3D7Ha/wDPtD/37FHMw5pdw+x2v/PtD/37FHMw5pdw+x2v/PtD/wB+xRzMOaXcPslr/wA+0P8A37FHMw5n3D7Ja/8APtD/AN+xRzMOZ9w+yWv/AD7Q/wDfsUczDmfcPslr/wA+0P8A37FHMw5n3D7Ja/8APtD/AN+xRzMOZ9w+yWv/AD7Q/wDfsUczDmfcPslr/wA+0P8A37FHMw5n3D7Ja/8APtD/AN+xRzMOZ9yakIKACgAoAKACgAoAKAMOvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoAh+yWv/PtD/wB+xT5mPmfcPslr/wA+0P8A37FHMw5n3D7Ja/8APtD/AN+xRzMOZ9w+yWv/AD7Q/wDfsUczDmfcPslr/wA+0P8A37FHMw5n3D7Ja/8APtD/AN+xRzMOZ9w+yWv/AD7Q/wDfsUczDmfcPslr/wA+0P8A37FHMw5n3O3rhOoKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOOrtOQKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDDr2D2AoAKACgAoAKACgAoA3K8c8cKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA7GuI6woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA46u05AoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAMOvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDsa4jrCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDjq7TkCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAw69g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOxriOsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOOrtOQKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDDr2D2AoAKACgAoAKACgAoA3K8c8cKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA7GuI6woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA46u05AoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAMOvYPYCgAoAKACgAoAKACgDcrxzxwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDsa4jrCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDjq7TkCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAw69g9gKACgAoAKACgAoAKANyvHPHCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOxriOsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOOrtOQKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDDr2D2AoAKACgAoAKACgAoA3K8c8cKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA7GuI6woAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4XzX/vfpXo2QvZx7B5r/AN79KLIPZx7B5r/3v0osg9nHsHmv/e/SiyD2cewea/8Ae/SiyD2cewea/wDe/SiyD2cewea/979KLIPZx7B5r/3v0osg9nHsHmv/AHv0osg9nHsHmv8A3v0osg9nHsHmv/e/SiyD2cewea/979KLIPZx7B5r/wB79KLIPZx7B5r/AN79KLIPZx7B5r/3v0osg9nHsHmv/e/SiyD2cewea/8Ae/SiyD2cewea/wDe/SiyD2cewea/979KLIPZx7B5r/3v0osg9nHsHmv/AHv0osg9nHsHmv8A3v0osg9nHsHmv/e/SiyD2cewea/979KLIPZx7EHkR/3f1rb20+5tzyDyI/7v60e2n3DnkHkR/wB39aPbT7hzyDyI/wC7+tHtp9w55B5Ef939aPbT7hzyDyI/7v60e2n3DnkHkR/3f1o9tPuHPIPIj/u/rR7afcOeRP5r/wB79KxsjH2cewea/wDe/SiyD2cewea/979KLIPZx7B5r/3v0osg9nHsHmv/AHv0osg9nHsHmv8A3v0osg9nHsHmv/e/SiyD2cewea/979KLIPZx7B5r/wB79KLIPZx7B5r/AN79KLIPZx7B5r/3v0osg9nHsHmv/e/SiyD2cewea/8Ae/SiyD2cewea/wDe/SiyD2cewea/979KLIPZx7B5r/3v0osg9nHsd1XnDCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDgq9IsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDva80gKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCr0iwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAO9rzSAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KvSLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDgq9IsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDva80gKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCr0iwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAO9rzSAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KvSLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDgq9IsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDva80gKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCr0iwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAO9rzSAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KvSLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDgq9IsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDva80gKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCr0iwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAO9rzSAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KvSLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDgq9IsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDva80gKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAOCr0iwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAO9rzSAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA4KvSLCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA72vNICgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgDgq9IsKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD/AP/Z
\.


--
-- Data for Name: parent_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parent_profiles (id, account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, code, name, description, created_at, updated_at) FROM stdin;
10000000-0000-4000-8000-000000000001	DASHBOARD_ADMIN_VIEW	View admin dashboard	Access the administrator dashboard	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000002	DASHBOARD_SCHOOL_VIEW	View school dashboard	Access the school dashboard	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000003	DASHBOARD_STAFF_VIEW	View staff dashboard	Access the operational staff dashboard	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000004	SCHOOL_MANAGE	Manage schools	Create and maintain school records	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000005	USER_MANAGE	Manage users	Create and maintain user accounts	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000006	ROLE_MANAGE	Manage roles	Configure roles and permissions	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000007	APPROVAL_VIEW	View approvals	Review administrative approval requests	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000008	AUDIT_LOG_VIEW	View audit logs	Review security and administration audit logs	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000009	TOUR_VIEW	View tours	View tour information	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000010	TRACKING_VIEW	View tracking	View live tour tracking	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000011	TOUR_REQUEST_VIEW	View tour requests	View and process tour requests	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000012	ROSTER_VIEW	View rosters	View tour participant rosters	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000013	DOCUMENT_REVIEW	Review documents	Review tour documents and consent records	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000014	TEACHER_VIEW	View teachers	View teacher records	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000015	MESSAGE_VIEW	View messages	Access platform messaging	2026-06-26 07:50:30.87719+00	2026-06-26 07:50:30.87719+00
10000000-0000-4000-8000-000000000016	PROFILE_READ	Read own profile	Read the authenticated account profile	2026-06-26 07:50:34.410278+00	2026-06-26 07:50:34.410278+00
10000000-0000-4000-8000-000000000017	PROFILE_UPDATE	Update own profile	Update the authenticated account profile	2026-06-26 07:50:34.410278+00	2026-06-26 07:50:34.410278+00
10000000-0000-4000-8000-000000000018	DATA_ANONYMIZATION_REQUEST	Request anonymization	Request anonymization of the authenticated account	2026-06-26 07:50:34.410278+00	2026-06-26 07:50:34.410278+00
10000000-0000-4000-8000-000000000019	DATA_ANONYMIZATION_APPROVE	Approve anonymization	Approve account anonymization requests	2026-06-26 07:50:34.410278+00	2026-06-26 07:50:34.410278+00
10000000-0000-4000-8000-000000000020	ACCOUNT_MANAGE	Manage accounts	Lock and unlock user accounts	2026-06-26 07:50:34.410278+00	2026-06-26 07:50:34.410278+00
10000000-0000-4000-8000-000000000021	TOUR_REQUEST_CREATE	Create tour requests	Submit a new tour request (school) or draft (sales)	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
10000000-0000-4000-8000-000000000022	TOUR_REQUEST_VIEW_OWN	View own tour requests	View tour requests submitted by the actor's own school	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
10000000-0000-4000-8000-000000000023	TOUR_REQUEST_VIEW_ASSIGNED	View assigned tour requests	View tour requests pending sales review	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
10000000-0000-4000-8000-000000000024	TOUR_REQUEST_REVIEW	Accept or reject tour requests	Accept/reject a pending tour request	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
10000000-0000-4000-8000-000000000025	BOOKING_VIEW	View bookings	View booking draft/proposal/confirmation status	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
10000000-0000-4000-8000-000000000026	BOOKING_MANAGE	Manage bookings	Update booking proposal terms or cancel a booking	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
10000000-0000-4000-8000-000000000027	BOOKING_CONFIRM	Confirm bookings	Confirm a booking proposal or request changes	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
10000000-0000-4000-8000-000000000028	CONTRACT_VIEW	View contracts	View contract tracking status	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
10000000-0000-4000-8000-000000000029	CONTRACT_MANAGE	Manage contracts	Create/review/send/upload-signed/cancel a contract	2026-06-26 07:50:38.480966+00	2026-06-26 07:50:38.480966+00
\.


--
-- Data for Name: refresh_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_sessions (id, account_id, refresh_token_hash, device_id, ip_address, user_agent, revoked_at, expires_at, created_at, rotated_from_session_id) FROM stdin;
\.


--
-- Data for Name: registration_revision_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registration_revision_sessions (id, consumed_at, created_at, otp_code_hash, otp_expires_at, phone, revision_token_hash, token_expires_at, request_id) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id, granted_at) FROM stdin;
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000015	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000014	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000013	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000012	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000011	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000010	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000009	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000008	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000007	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000006	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000005	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000004	2026-06-26 07:50:30.87719+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000001	2026-06-26 07:50:30.87719+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000015	2026-06-26 07:50:30.87719+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000014	2026-06-26 07:50:30.87719+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000013	2026-06-26 07:50:30.87719+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000012	2026-06-26 07:50:30.87719+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000011	2026-06-26 07:50:30.87719+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000010	2026-06-26 07:50:30.87719+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000009	2026-06-26 07:50:30.87719+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000002	2026-06-26 07:50:30.87719+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000011	2026-06-26 07:50:30.87719+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000009	2026-06-26 07:50:30.87719+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000003	2026-06-26 07:50:30.87719+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000007	2026-06-26 07:50:30.87719+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000010	2026-06-26 07:50:30.87719+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000009	2026-06-26 07:50:30.87719+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000003	2026-06-26 07:50:30.87719+00
7c413715-7e44-4707-ae44-4fb7fcdcb96a	10000000-0000-4000-8000-000000000012	2026-06-26 07:50:30.87719+00
7c413715-7e44-4707-ae44-4fb7fcdcb96a	10000000-0000-4000-8000-000000000010	2026-06-26 07:50:30.87719+00
7c413715-7e44-4707-ae44-4fb7fcdcb96a	10000000-0000-4000-8000-000000000009	2026-06-26 07:50:30.87719+00
7c413715-7e44-4707-ae44-4fb7fcdcb96a	10000000-0000-4000-8000-000000000003	2026-06-26 07:50:30.87719+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	10000000-0000-4000-8000-000000000013	2026-06-26 07:50:30.87719+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	10000000-0000-4000-8000-000000000012	2026-06-26 07:50:30.87719+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	10000000-0000-4000-8000-000000000010	2026-06-26 07:50:30.87719+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	10000000-0000-4000-8000-000000000009	2026-06-26 07:50:30.87719+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	10000000-0000-4000-8000-000000000003	2026-06-26 07:50:30.87719+00
3cabd595-6bb5-4e42-8efb-5222d00ee3c4	10000000-0000-4000-8000-000000000016	2026-06-26 07:50:34.410278+00
3cabd595-6bb5-4e42-8efb-5222d00ee3c4	10000000-0000-4000-8000-000000000017	2026-06-26 07:50:34.410278+00
3cabd595-6bb5-4e42-8efb-5222d00ee3c4	10000000-0000-4000-8000-000000000018	2026-06-26 07:50:34.410278+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000016	2026-06-26 07:50:34.410278+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000017	2026-06-26 07:50:34.410278+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000018	2026-06-26 07:50:34.410278+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000016	2026-06-26 07:50:34.410278+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000017	2026-06-26 07:50:34.410278+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000018	2026-06-26 07:50:34.410278+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000016	2026-06-26 07:50:34.410278+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000017	2026-06-26 07:50:34.410278+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000018	2026-06-26 07:50:34.410278+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000016	2026-06-26 07:50:34.410278+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000017	2026-06-26 07:50:34.410278+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000018	2026-06-26 07:50:34.410278+00
7c413715-7e44-4707-ae44-4fb7fcdcb96a	10000000-0000-4000-8000-000000000016	2026-06-26 07:50:34.410278+00
7c413715-7e44-4707-ae44-4fb7fcdcb96a	10000000-0000-4000-8000-000000000017	2026-06-26 07:50:34.410278+00
7c413715-7e44-4707-ae44-4fb7fcdcb96a	10000000-0000-4000-8000-000000000018	2026-06-26 07:50:34.410278+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	10000000-0000-4000-8000-000000000016	2026-06-26 07:50:34.410278+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	10000000-0000-4000-8000-000000000017	2026-06-26 07:50:34.410278+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	10000000-0000-4000-8000-000000000018	2026-06-26 07:50:34.410278+00
7961db58-631b-41f8-b530-225ca25efd53	10000000-0000-4000-8000-000000000016	2026-06-26 07:50:34.410278+00
7961db58-631b-41f8-b530-225ca25efd53	10000000-0000-4000-8000-000000000017	2026-06-26 07:50:34.410278+00
7961db58-631b-41f8-b530-225ca25efd53	10000000-0000-4000-8000-000000000018	2026-06-26 07:50:34.410278+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000019	2026-06-26 07:50:34.410278+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000020	2026-06-26 07:50:34.410278+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000021	2026-06-26 07:50:38.480966+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000021	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000021	2026-06-26 07:50:38.480966+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000022	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000022	2026-06-26 07:50:38.480966+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000023	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000023	2026-06-26 07:50:38.480966+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000024	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000024	2026-06-26 07:50:38.480966+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000025	2026-06-26 07:50:38.480966+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000025	2026-06-26 07:50:38.480966+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000025	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000025	2026-06-26 07:50:38.480966+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000026	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000026	2026-06-26 07:50:38.480966+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000027	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000027	2026-06-26 07:50:38.480966+00
4169e714-cddd-4b10-9e71-da732fc8f261	10000000-0000-4000-8000-000000000028	2026-06-26 07:50:38.480966+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000028	2026-06-26 07:50:38.480966+00
2c36e2f7-467d-445b-838c-5361f771e4cf	10000000-0000-4000-8000-000000000028	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000028	2026-06-26 07:50:38.480966+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	10000000-0000-4000-8000-000000000029	2026-06-26 07:50:38.480966+00
a8b5b33b-55da-44f7-b11b-173667434869	10000000-0000-4000-8000-000000000029	2026-06-26 07:50:38.480966+00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, code, name, description, is_system_role, created_at, updated_at) FROM stdin;
3cabd595-6bb5-4e42-8efb-5222d00ee3c4	PARENT	Parent	Parent account role	t	2026-06-26 07:50:28.25559+00	2026-06-26 07:50:28.25559+00
a8b5b33b-55da-44f7-b11b-173667434869	ADMIN	Admin	System administrator role	t	2026-06-26 07:50:28.25559+00	2026-06-26 07:50:28.25559+00
2c36e2f7-467d-445b-838c-5361f771e4cf	SCHOOL_REPRESENTATIVE	School Representative	School representative role	t	2026-06-26 07:50:28.25559+00	2026-06-26 07:50:28.25559+00
b745a0cb-0cc2-48de-8106-0cc6f2b30513	SALES_STAFF	Sales Staff	Sales staff role	t	2026-06-26 07:50:28.25559+00	2026-06-26 07:50:28.25559+00
4169e714-cddd-4b10-9e71-da732fc8f261	TOUR_MANAGER	Tour Manager	Tour manager role	t	2026-06-26 07:50:28.25559+00	2026-06-26 07:50:28.25559+00
7c413715-7e44-4707-ae44-4fb7fcdcb96a	TOUR_OPERATOR_STAFF	Tour Operator Staff	Tour operator staff role	t	2026-06-26 07:50:28.25559+00	2026-06-26 07:50:28.25559+00
39c9a8fb-2f30-4526-b0cc-f544c6d49b26	TEACHER	Teacher	Teacher role	t	2026-06-26 07:50:28.25559+00	2026-06-26 07:50:28.25559+00
7961db58-631b-41f8-b530-225ca25efd53	TOUR_GUIDE	Tour Guide	Tour guide role	t	2026-06-26 07:50:28.25559+00	2026-06-26 07:50:28.25559+00
\.


--
-- Data for Name: roster_audit_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roster_audit_events (id, batch_id, booking_id, school_id, actor_account_id, status, total_rows, success_rows, failed_rows, created_at) FROM stdin;
\.


--
-- Data for Name: roster_import_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roster_import_batches (id, booking_id, school_id, uploaded_by_account_id, file_name, file_hash, status, total_rows, success_rows, failed_rows, created_classes, failure_code, started_at, completed_at) FROM stdin;
\.


--
-- Data for Name: route_cache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.route_cache (id, origin_latitude, origin_longitude, destination_latitude, destination_longitude, distance_meters, duration_seconds, provider, cached_at) FROM stdin;
\.


--
-- Data for Name: sales_staff_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_staff_profiles (id, account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: school_classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_classes (id, school_id, academic_year, class_name, normalized_class_name, student_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: school_dedupe_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_dedupe_keys (id, created_at, key_type, key_value, school_id) FROM stdin;
\.


--
-- Data for Name: school_merge_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_merge_records (id, merged_at, reason, merged_by_account_id, source_school_id, target_school_id) FROM stdin;
\.


--
-- Data for Name: school_representative_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_representative_profiles (id, contact_email, contact_phone, created_at, department, full_name, position_title, updated_at, account_id, school_id, participation_reason) FROM stdin;
\.


--
-- Data for Name: school_representative_registration_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_representative_registration_requests (id, created_at, duplicate_review_required, final_rejection_reason, last_resubmitted_at, last_revision_email_sent_at, last_revision_requested_at, reviewed_at, reviewed_by_account_id, revision_count, revision_reason, status, updated_at, version, account_id, candidate_school_id, profile_id, proof_document_id, school_id) FROM stdin;
\.


--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schools (id, address_line, created_at, email, name, phone, status, updated_at, website_url) FROM stdin;
d0bcfe41-faf0-462f-9598-e31e24641d0e	Vĩnh Lại, Hải Phòng	2026-06-27 20:38:04.837097+00	unghoe@school.edu.vn	THCS Ứng Hòe	0387911232	PENDING_VERIFICATION	2026-06-27 20:38:04.837097+00	\N
\.


--
-- Data for Name: student_class_memberships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_class_memberships (id, school_id, student_id, class_id, academic_year, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, school_id, student_code, full_name, date_of_birth, gender, parent_name, parent_phone_encrypted, parent_phone_masked, identity_hash, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: system_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_policies (id, category, code, created_at, description, name, updated_at, updated_by, value_text) FROM stdin;
\.


--
-- Data for Name: teacher_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_profiles (id, account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: telemetry_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telemetry_events (id, accuracy_meters, assignment_id, battery_level, event_id, ingestion_source, latitude, longitude, nonce_hash, received_at, recorded_at, sequence_no, signal_quality, signature_hash, source_type, device_id) FROM stdin;
ecd69a82-1351-4797-b78b-5fa73428aeab	5.00	cccccccc-0000-0000-0000-000000000001	85	4b862f78-28a2-428e-a357-029084ce0d3d	REST	21.028511	105.852598	nonce-hash-001-aabbccdd	2026-07-02 09:28:46.040533+00	2026-07-02 09:28:46.040533+00	1	90	sig-hash-001-aabbccdd	GPS	bbbbbbbb-0000-0000-0000-000000000001
cb8f21dc-fa9a-44e1-be1d-22b9b079b9f3	8.00	cccccccc-0000-0000-0000-000000000002	60	3e12571d-7496-4c8c-bd0b-e1e3c4201f28	REST	21.027763	105.835730	nonce-hash-002-aabbccdd	2026-07-02 09:16:46.040533+00	2026-07-02 09:16:46.040533+00	1	75	sig-hash-002-aabbccdd	GPS	bbbbbbbb-0000-0000-0000-000000000002
ce876686-e0da-432b-a6cf-b6317c97f970	10.00	cccccccc-0000-0000-0000-000000000003	12	d9d60cbf-8815-4d4e-b84f-b3c50377877f	REST	21.037074	105.833819	nonce-hash-003-aabbccdd	2026-07-02 09:25:46.040533+00	2026-07-02 09:25:46.040533+00	1	80	sig-hash-003-aabbccdd	GPS	bbbbbbbb-0000-0000-0000-000000000003
\.


--
-- Data for Name: tour_guide_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_guide_profiles (id, account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tour_manager_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_manager_profiles (id, account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tour_operator_staff_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_operator_staff_profiles (id, account_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tour_request_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_request_items (id, tour_request_id, destination_id, activity_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tour_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_requests (id, requested_by_profile_id, created_by_sales_profile_id, reviewed_by_sales_profile_id, package_id, request_type, expected_student_count, desired_date, status, notes, rejection_reason, reviewed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tracker_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tracker_assignments (id, active, assigned_at, created_at, operation_plan_id, replaced, replaced_at, school_confirmed_authorization, selected_tracker_reason, target_id, target_type, updated_at, device_id) FROM stdin;
cccccccc-0000-0000-0000-000000000001	t	2026-07-02 09:28:45.98293+00	2026-07-02 09:28:45.98293+00	aaaaaaaa-0000-0000-0000-000000000001	f	\N	t	\N	dddddddd-0000-0000-0000-000000000001	VEHICLE	2026-07-02 09:28:45.98293+00	bbbbbbbb-0000-0000-0000-000000000001
cccccccc-0000-0000-0000-000000000002	t	2026-07-02 09:28:45.98293+00	2026-07-02 09:28:45.98293+00	aaaaaaaa-0000-0000-0000-000000000001	f	\N	t	\N	dddddddd-0000-0000-0000-000000000002	VEHICLE	2026-07-02 09:28:45.98293+00	bbbbbbbb-0000-0000-0000-000000000002
cccccccc-0000-0000-0000-000000000003	t	2026-07-02 09:28:45.98293+00	2026-07-02 09:28:45.98293+00	aaaaaaaa-0000-0000-0000-000000000001	f	\N	t	\N	dddddddd-0000-0000-0000-000000000003	VEHICLE	2026-07-02 09:28:45.98293+00	bbbbbbbb-0000-0000-0000-000000000003
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, amount, created_at, type, contract_id) FROM stdin;
\.


--
-- Data for Name: trb_audit_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trb_audit_events (id, actor_account_id, target_entity_type, target_entity_id, action, reason, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-06-16 05:30:57
20211116045059	2026-06-16 05:30:57
20211116050929	2026-06-16 05:30:57
20211116051442	2026-06-16 05:30:57
20211116212300	2026-06-16 05:30:57
20211116213355	2026-06-16 05:30:57
20211116213934	2026-06-16 05:30:57
20211116214523	2026-06-16 05:30:57
20211122062447	2026-06-16 05:30:57
20211124070109	2026-06-16 05:30:57
20211202204204	2026-06-16 05:30:57
20211202204605	2026-06-16 05:30:57
20211210212804	2026-06-16 05:30:57
20211228014915	2026-06-16 05:30:57
20220107221237	2026-06-16 05:30:57
20220228202821	2026-06-16 05:30:57
20220312004840	2026-06-16 05:30:57
20220603231003	2026-06-16 05:30:57
20220603232444	2026-06-16 05:30:57
20220615214548	2026-06-16 05:30:57
20220712093339	2026-06-16 05:30:57
20220908172859	2026-06-16 05:30:57
20220916233421	2026-06-16 05:30:57
20230119133233	2026-06-16 05:30:57
20230128025114	2026-06-16 05:30:57
20230128025212	2026-06-16 05:30:57
20230227211149	2026-06-16 05:30:57
20230228184745	2026-06-16 05:30:57
20230308225145	2026-06-16 05:30:57
20230328144023	2026-06-16 05:30:57
20231018144023	2026-06-16 05:30:57
20231204144023	2026-06-16 05:30:57
20231204144024	2026-06-16 05:30:57
20231204144025	2026-06-16 05:30:57
20240108234812	2026-06-16 05:30:57
20240109165339	2026-06-16 05:30:57
20240227174441	2026-06-16 05:30:57
20240311171622	2026-06-16 05:30:57
20240321100241	2026-06-16 05:30:57
20240401105812	2026-06-16 05:30:57
20240418121054	2026-06-16 05:30:57
20240523004032	2026-06-16 05:30:57
20240618124746	2026-06-16 05:30:58
20240801235015	2026-06-16 05:30:58
20240805133720	2026-06-16 05:30:58
20240827160934	2026-06-16 05:30:58
20240919163303	2026-06-16 05:30:58
20240919163305	2026-06-16 05:30:58
20241019105805	2026-06-16 05:30:58
20241030150047	2026-06-16 05:30:58
20241108114728	2026-06-16 05:30:58
20241121104152	2026-06-16 05:30:58
20241130184212	2026-06-16 05:30:58
20241220035512	2026-06-16 05:30:58
20241220123912	2026-06-16 05:30:58
20241224161212	2026-06-16 05:30:58
20250107150512	2026-06-16 05:30:58
20250110162412	2026-06-16 05:30:58
20250123174212	2026-06-16 05:30:58
20250128220012	2026-06-16 05:30:58
20250506224012	2026-06-16 05:30:58
20250523164012	2026-06-16 05:30:58
20250714121412	2026-06-16 05:30:58
20250905041441	2026-06-16 05:30:58
20251103001201	2026-06-16 05:30:58
20251120212548	2026-06-16 05:30:58
20251120215549	2026-06-16 05:30:58
20260218120000	2026-06-16 05:30:58
20260326120000	2026-06-16 05:30:58
20260514120000	2026-06-16 05:30:58
20260527120000	2026-06-16 05:30:58
20260528120000	2026-06-16 05:30:58
20260603120000	2026-06-16 05:30:58
20260605120000	2026-06-16 05:30:58
20260606110000	2026-06-16 05:30:58
20260616120000	2026-06-25 07:42:20
20260624120000	2026-06-25 07:42:20
20260626120000	2026-07-02 14:54:30
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-06-16 03:24:33.819332
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-06-16 03:24:33.863064
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-06-16 03:24:33.869829
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-06-16 03:24:33.89483
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-06-16 03:24:33.906636
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-06-16 03:24:33.910218
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-06-16 03:24:33.913939
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-06-16 03:24:33.917691
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-06-16 03:24:33.92114
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-06-16 03:24:33.924772
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-06-16 03:24:33.928927
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-06-16 03:24:33.933266
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-06-16 03:24:33.938761
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-06-16 03:24:33.942066
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-06-16 03:24:33.946569
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-06-16 03:24:33.970649
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-06-16 03:24:33.974967
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-06-16 03:24:33.981985
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-06-16 03:24:33.985286
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-06-16 03:24:33.989789
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-06-16 03:24:33.993126
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-06-16 03:24:33.997983
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-06-16 03:24:34.012281
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-06-16 03:24:34.021158
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-06-16 03:24:34.024595
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-06-16 03:24:34.027718
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-06-16 03:24:34.031292
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-06-16 03:24:34.034292
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-06-16 03:24:34.037091
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-06-16 03:24:34.039815
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-06-16 03:24:34.042479
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-06-16 03:24:34.045103
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-06-16 03:24:34.047769
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-06-16 03:24:34.050613
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-06-16 03:24:34.053371
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-06-16 03:24:34.056176
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-06-16 03:24:34.058878
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-06-16 03:24:34.061651
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-06-16 03:24:34.06527
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-06-16 03:24:34.07434
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-06-16 03:24:34.077334
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-06-16 03:24:34.080514
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-06-16 03:24:34.083306
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-06-16 03:24:34.086137
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-06-16 03:24:34.089698
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-06-16 03:24:34.093343
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-06-16 03:24:34.102266
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-06-16 03:24:34.105898
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-06-16 03:24:34.108917
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-06-16 03:24:34.12477
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-06-16 03:24:34.129198
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-06-16 03:24:34.815074
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-06-16 03:24:34.816468
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-06-16 03:24:34.82713
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-06-16 03:24:34.829183
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-06-16 03:24:34.830605
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-06-16 03:24:34.834926
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-06-16 03:24:34.8393
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-06-16 03:24:34.842377
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-06-16 03:24:34.846102
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-06-16 03:24:34.849704
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 15, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: account_audit_events account_audit_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_audit_events
    ADD CONSTRAINT account_audit_events_pkey PRIMARY KEY (id);


--
-- Name: account_roles account_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT account_roles_pkey PRIMARY KEY (account_id, role_id);


--
-- Name: accounts accounts_phone_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_phone_number_key UNIQUE (phone_number);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: admin_profiles admin_profiles_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_profiles
    ADD CONSTRAINT admin_profiles_account_id_key UNIQUE (account_id);


--
-- Name: admin_profiles admin_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_profiles
    ADD CONSTRAINT admin_profiles_pkey PRIMARY KEY (id);


--
-- Name: booking_additional_items booking_additional_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_additional_items
    ADD CONSTRAINT booking_additional_items_pkey PRIMARY KEY (id);


--
-- Name: booking_itinerary_items booking_itinerary_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_itinerary_items
    ADD CONSTRAINT booking_itinerary_items_pkey PRIMARY KEY (id);


--
-- Name: booking_roster_students booking_roster_students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_roster_students
    ADD CONSTRAINT booking_roster_students_pkey PRIMARY KEY (id);


--
-- Name: booking_status_history booking_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_status_history
    ADD CONSTRAINT booking_status_history_pkey PRIMARY KEY (id);


--
-- Name: booking_versions booking_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_versions
    ADD CONSTRAINT booking_versions_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_tour_request_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_tour_request_id_key UNIQUE (tour_request_id);


--
-- Name: contract_templates contract_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract_templates
    ADD CONSTRAINT contract_templates_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_contract_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_contract_no_key UNIQUE (contract_no);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: data_anonymization_requests data_anonymization_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_anonymization_requests
    ADD CONSTRAINT data_anonymization_requests_pkey PRIMARY KEY (id);


--
-- Name: data_retention_policies data_retention_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_retention_policies
    ADD CONSTRAINT data_retention_policies_pkey PRIMARY KEY (id);


--
-- Name: device_replacement_logs device_replacement_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_replacement_logs
    ADD CONSTRAINT device_replacement_logs_pkey PRIMARY KEY (id);


--
-- Name: document_metadata document_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_metadata
    ADD CONSTRAINT document_metadata_pkey PRIMARY KEY (id);


--
-- Name: gps_devices gps_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gps_devices
    ADD CONSTRAINT gps_devices_pkey PRIMARY KEY (id);


--
-- Name: livestream_interactions livestream_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livestream_interactions
    ADD CONSTRAINT livestream_interactions_pkey PRIMARY KEY (id);


--
-- Name: livestream_sessions livestream_sessions_livekit_room_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livestream_sessions
    ADD CONSTRAINT livestream_sessions_livekit_room_id_key UNIQUE (livekit_room_id);


--
-- Name: livestream_sessions livestream_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livestream_sessions
    ADD CONSTRAINT livestream_sessions_pkey PRIMARY KEY (id);


--
-- Name: parent_profiles parent_profiles_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_profiles
    ADD CONSTRAINT parent_profiles_account_id_key UNIQUE (account_id);


--
-- Name: parent_profiles parent_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_profiles
    ADD CONSTRAINT parent_profiles_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: refresh_sessions refresh_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_sessions
    ADD CONSTRAINT refresh_sessions_pkey PRIMARY KEY (id);


--
-- Name: refresh_sessions refresh_sessions_refresh_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_sessions
    ADD CONSTRAINT refresh_sessions_refresh_token_hash_key UNIQUE (refresh_token_hash);


--
-- Name: registration_revision_sessions registration_revision_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registration_revision_sessions
    ADD CONSTRAINT registration_revision_sessions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_code_key UNIQUE (code);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roster_audit_events roster_audit_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roster_audit_events
    ADD CONSTRAINT roster_audit_events_pkey PRIMARY KEY (id);


--
-- Name: roster_import_batches roster_import_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roster_import_batches
    ADD CONSTRAINT roster_import_batches_pkey PRIMARY KEY (id);


--
-- Name: route_cache route_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.route_cache
    ADD CONSTRAINT route_cache_pkey PRIMARY KEY (id);


--
-- Name: sales_staff_profiles sales_staff_profiles_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_staff_profiles
    ADD CONSTRAINT sales_staff_profiles_account_id_key UNIQUE (account_id);


--
-- Name: sales_staff_profiles sales_staff_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_staff_profiles
    ADD CONSTRAINT sales_staff_profiles_pkey PRIMARY KEY (id);


--
-- Name: school_classes school_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_pkey PRIMARY KEY (id);


--
-- Name: school_dedupe_keys school_dedupe_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_dedupe_keys
    ADD CONSTRAINT school_dedupe_keys_pkey PRIMARY KEY (id);


--
-- Name: school_merge_records school_merge_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_merge_records
    ADD CONSTRAINT school_merge_records_pkey PRIMARY KEY (id);


--
-- Name: school_representative_profiles school_representative_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_profiles
    ADD CONSTRAINT school_representative_profiles_pkey PRIMARY KEY (id);


--
-- Name: school_representative_registration_requests school_representative_registration_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_registration_requests
    ADD CONSTRAINT school_representative_registration_requests_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: student_class_memberships student_class_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_class_memberships
    ADD CONSTRAINT student_class_memberships_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: system_policies system_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_policies
    ADD CONSTRAINT system_policies_pkey PRIMARY KEY (id);


--
-- Name: teacher_profiles teacher_profiles_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_account_id_key UNIQUE (account_id);


--
-- Name: teacher_profiles teacher_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT teacher_profiles_pkey PRIMARY KEY (id);


--
-- Name: telemetry_events telemetry_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telemetry_events
    ADD CONSTRAINT telemetry_events_pkey PRIMARY KEY (id);


--
-- Name: tour_guide_profiles tour_guide_profiles_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_guide_profiles
    ADD CONSTRAINT tour_guide_profiles_account_id_key UNIQUE (account_id);


--
-- Name: tour_guide_profiles tour_guide_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_guide_profiles
    ADD CONSTRAINT tour_guide_profiles_pkey PRIMARY KEY (id);


--
-- Name: tour_manager_profiles tour_manager_profiles_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_manager_profiles
    ADD CONSTRAINT tour_manager_profiles_account_id_key UNIQUE (account_id);


--
-- Name: tour_manager_profiles tour_manager_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_manager_profiles
    ADD CONSTRAINT tour_manager_profiles_pkey PRIMARY KEY (id);


--
-- Name: tour_operator_staff_profiles tour_operator_staff_profiles_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_operator_staff_profiles
    ADD CONSTRAINT tour_operator_staff_profiles_account_id_key UNIQUE (account_id);


--
-- Name: tour_operator_staff_profiles tour_operator_staff_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_operator_staff_profiles
    ADD CONSTRAINT tour_operator_staff_profiles_pkey PRIMARY KEY (id);


--
-- Name: tour_request_items tour_request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_request_items
    ADD CONSTRAINT tour_request_items_pkey PRIMARY KEY (id);


--
-- Name: tour_requests tour_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_requests
    ADD CONSTRAINT tour_requests_pkey PRIMARY KEY (id);


--
-- Name: tracker_assignments tracker_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracker_assignments
    ADD CONSTRAINT tracker_assignments_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: trb_audit_events trb_audit_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trb_audit_events
    ADD CONSTRAINT trb_audit_events_pkey PRIMARY KEY (id);


--
-- Name: school_representative_profiles uk58fvtgpua332pb0naus1tes4k; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_profiles
    ADD CONSTRAINT uk58fvtgpua332pb0naus1tes4k UNIQUE (account_id);


--
-- Name: system_policies uk9rdigplmq13424cldfgls5vuh; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_policies
    ADD CONSTRAINT uk9rdigplmq13424cldfgls5vuh UNIQUE (code);


--
-- Name: booking_roster_students uk_booking_roster_student; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_roster_students
    ADD CONSTRAINT uk_booking_roster_student UNIQUE (booking_id, student_id);


--
-- Name: roster_import_batches uk_roster_import_file; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roster_import_batches
    ADD CONSTRAINT uk_roster_import_file UNIQUE (booking_id, school_id, file_hash);


--
-- Name: school_classes uk_school_classes_scope; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT uk_school_classes_scope UNIQUE (school_id, academic_year, normalized_class_name);


--
-- Name: student_class_memberships uk_student_class_membership; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_class_memberships
    ADD CONSTRAINT uk_student_class_membership UNIQUE (student_id, academic_year);


--
-- Name: student_class_memberships uk_student_class_membership_scope; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_class_memberships
    ADD CONSTRAINT uk_student_class_membership_scope UNIQUE (student_id, class_id, academic_year);


--
-- Name: students uk_students_identity_hash; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT uk_students_identity_hash UNIQUE (school_id, identity_hash);


--
-- Name: students uk_students_school_code; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT uk_students_school_code UNIQUE (school_id, student_code);


--
-- Name: gps_devices ukfrncfkpyw3ljxi1llxcn79rjk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gps_devices
    ADD CONSTRAINT ukfrncfkpyw3ljxi1llxcn79rjk UNIQUE (device_code);


--
-- Name: data_retention_policies ukja86bknn8g4pf32pnwyshfjbc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_retention_policies
    ADD CONSTRAINT ukja86bknn8g4pf32pnwyshfjbc UNIQUE (code);


--
-- Name: school_representative_registration_requests uks4hqcgxl52cijeix8yo9cdgkj; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_registration_requests
    ADD CONSTRAINT uks4hqcgxl52cijeix8yo9cdgkj UNIQUE (proof_document_id);


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: idx_users_created_at_desc; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_created_at_desc ON auth.users USING btree (created_at DESC);


--
-- Name: idx_users_email; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_email ON auth.users USING btree (email);


--
-- Name: idx_users_last_sign_in_at_desc; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_last_sign_in_at_desc ON auth.users USING btree (last_sign_in_at DESC);


--
-- Name: idx_users_name; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_users_name ON auth.users USING btree (((raw_user_meta_data ->> 'name'::text))) WHERE ((raw_user_meta_data ->> 'name'::text) IS NOT NULL);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: idx_account_audit_events_target; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_account_audit_events_target ON public.account_audit_events USING btree (target_account_id, created_at);


--
-- Name: idx_accounts_email_lower; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_accounts_email_lower ON public.accounts USING btree (lower((email)::text)) WHERE (email IS NOT NULL);


--
-- Name: idx_accounts_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_accounts_username ON public.accounts USING btree (username);


--
-- Name: idx_booking_roster_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_roster_booking ON public.booking_roster_students USING btree (booking_id);


--
-- Name: idx_booking_roster_booking_class; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_booking_roster_booking_class ON public.booking_roster_students USING btree (booking_id, class_id);


--
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- Name: idx_contracts_booking_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_contracts_booking_active ON public.contracts USING btree (booking_id) WHERE ((status)::text <> 'CANCELLED'::text);


--
-- Name: idx_data_anonymization_requests_target; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_data_anonymization_requests_target ON public.data_anonymization_requests USING btree (target_account_id, status);


--
-- Name: idx_li_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_li_session_id ON public.livestream_interactions USING btree (session_id, created_at DESC);


--
-- Name: idx_ls_guide_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ls_guide_id ON public.livestream_sessions USING btree (guide_id);


--
-- Name: idx_ls_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ls_status ON public.livestream_sessions USING btree (status);


--
-- Name: idx_ls_tour_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ls_tour_id ON public.livestream_sessions USING btree (tour_id);


--
-- Name: idx_refresh_sessions_account_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_sessions_account_id ON public.refresh_sessions USING btree (account_id);


--
-- Name: idx_refresh_sessions_expires_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_refresh_sessions_expires_at ON public.refresh_sessions USING btree (expires_at);


--
-- Name: idx_roster_batches_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roster_batches_booking ON public.roster_import_batches USING btree (booking_id, school_id);


--
-- Name: idx_school_classes_school_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_school_classes_school_year ON public.school_classes USING btree (school_id, academic_year);


--
-- Name: idx_student_memberships_class; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_student_memberships_class ON public.student_class_memberships USING btree (class_id);


--
-- Name: idx_students_school_identity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_school_identity ON public.students USING btree (school_id, identity_hash);


--
-- Name: idx_tour_request_items_request; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_request_items_request ON public.tour_request_items USING btree (tour_request_id);


--
-- Name: idx_tour_requests_requested_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_requests_requested_by ON public.tour_requests USING btree (requested_by_profile_id);


--
-- Name: idx_tour_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_requests_status ON public.tour_requests USING btree (status);


--
-- Name: idx_trb_audit_events_target; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trb_audit_events_target ON public.trb_audit_events USING btree (target_entity_type, target_entity_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: booking_roster_students booking_roster_students_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_roster_students
    ADD CONSTRAINT booking_roster_students_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: booking_roster_students booking_roster_students_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_roster_students
    ADD CONSTRAINT booking_roster_students_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.school_classes(id);


--
-- Name: booking_roster_students booking_roster_students_import_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_roster_students
    ADD CONSTRAINT booking_roster_students_import_batch_id_fkey FOREIGN KEY (import_batch_id) REFERENCES public.roster_import_batches(id);


--
-- Name: booking_roster_students booking_roster_students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_roster_students
    ADD CONSTRAINT booking_roster_students_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: data_anonymization_requests data_anonymization_requests_requester_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_anonymization_requests
    ADD CONSTRAINT data_anonymization_requests_requester_account_id_fkey FOREIGN KEY (requester_account_id) REFERENCES public.accounts(id);


--
-- Name: data_anonymization_requests data_anonymization_requests_target_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_anonymization_requests
    ADD CONSTRAINT data_anonymization_requests_target_account_id_fkey FOREIGN KEY (target_account_id) REFERENCES public.accounts(id);


--
-- Name: contracts fk2n4r7961qt2d5x0vss2tkjb3d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT fk2n4r7961qt2d5x0vss2tkjb3d FOREIGN KEY (booking_version_id) REFERENCES public.booking_versions(id);


--
-- Name: booking_versions fk32r93s47gaos67qpqfa8mpnbj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_versions
    ADD CONSTRAINT fk32r93s47gaos67qpqfa8mpnbj FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: booking_additional_items fk4b0wny05s97g4aiwt7v1srdv5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_additional_items
    ADD CONSTRAINT fk4b0wny05s97g4aiwt7v1srdv5 FOREIGN KEY (booking_version_id) REFERENCES public.booking_versions(id);


--
-- Name: school_merge_records fk4i5eetidi6rjw4gxylxma0aep; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_merge_records
    ADD CONSTRAINT fk4i5eetidi6rjw4gxylxma0aep FOREIGN KEY (source_school_id) REFERENCES public.schools(id);


--
-- Name: booking_itinerary_items fk5iw5x3tgcspeenglvvtw6egp6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_itinerary_items
    ADD CONSTRAINT fk5iw5x3tgcspeenglvvtw6egp6 FOREIGN KEY (booking_version_id) REFERENCES public.booking_versions(id);


--
-- Name: school_representative_profiles fk7g7blbcnxtkh6yyu911gsh3vf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_profiles
    ADD CONSTRAINT fk7g7blbcnxtkh6yyu911gsh3vf FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: transactions fk8mhtteatdgidlqoxpn7k0i1nf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk8mhtteatdgidlqoxpn7k0i1nf FOREIGN KEY (contract_id) REFERENCES public.contracts(id);


--
-- Name: account_roles fk_account_roles_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT fk_account_roles_account FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: account_roles fk_account_roles_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_roles
    ADD CONSTRAINT fk_account_roles_role FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: admin_profiles fk_admin_profiles_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_profiles
    ADD CONSTRAINT fk_admin_profiles_account FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: bookings fk_bookings_tour_request; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_bookings_tour_request FOREIGN KEY (tour_request_id) REFERENCES public.tour_requests(id);


--
-- Name: contracts fk_contracts_booking; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT fk_contracts_booking FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: contracts fk_contracts_uploaded_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT fk_contracts_uploaded_by FOREIGN KEY (uploaded_by_sales_profile_id) REFERENCES public.sales_staff_profiles(id);


--
-- Name: parent_profiles fk_parent_profiles_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parent_profiles
    ADD CONSTRAINT fk_parent_profiles_account FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: role_permissions fk_role_permissions_permission; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions fk_role_permissions_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: sales_staff_profiles fk_sales_staff_profiles_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_staff_profiles
    ADD CONSTRAINT fk_sales_staff_profiles_account FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: teacher_profiles fk_teacher_profiles_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_profiles
    ADD CONSTRAINT fk_teacher_profiles_account FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: tour_guide_profiles fk_tour_guide_profiles_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_guide_profiles
    ADD CONSTRAINT fk_tour_guide_profiles_account FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: tour_manager_profiles fk_tour_manager_profiles_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_manager_profiles
    ADD CONSTRAINT fk_tour_manager_profiles_account FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: tour_operator_staff_profiles fk_tour_operator_staff_profiles_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_operator_staff_profiles
    ADD CONSTRAINT fk_tour_operator_staff_profiles_account FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: tour_request_items fk_tour_request_items_request; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_request_items
    ADD CONSTRAINT fk_tour_request_items_request FOREIGN KEY (tour_request_id) REFERENCES public.tour_requests(id) ON DELETE CASCADE;


--
-- Name: tour_requests fk_tour_requests_created_by_sales; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_requests
    ADD CONSTRAINT fk_tour_requests_created_by_sales FOREIGN KEY (created_by_sales_profile_id) REFERENCES public.sales_staff_profiles(id);


--
-- Name: tour_requests fk_tour_requests_reviewed_by_sales; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_requests
    ADD CONSTRAINT fk_tour_requests_reviewed_by_sales FOREIGN KEY (reviewed_by_sales_profile_id) REFERENCES public.sales_staff_profiles(id);


--
-- Name: school_representative_registration_requests fkb66u6ilve0nno0kag58csvatt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_registration_requests
    ADD CONSTRAINT fkb66u6ilve0nno0kag58csvatt FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: telemetry_events fkbigwu0d0kkwojq0v1s7riu4em; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telemetry_events
    ADD CONSTRAINT fkbigwu0d0kkwojq0v1s7riu4em FOREIGN KEY (device_id) REFERENCES public.gps_devices(id);


--
-- Name: school_representative_registration_requests fkdc1f8442gnspgiibwk5nt57gi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_registration_requests
    ADD CONSTRAINT fkdc1f8442gnspgiibwk5nt57gi FOREIGN KEY (candidate_school_id) REFERENCES public.schools(id);


--
-- Name: school_representative_registration_requests fkdrn5t3ej92dsvdljkihp1rs5h; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_registration_requests
    ADD CONSTRAINT fkdrn5t3ej92dsvdljkihp1rs5h FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: registration_revision_sessions fkeb185tfqcc21eo7s97msxqj4y; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registration_revision_sessions
    ADD CONSTRAINT fkeb185tfqcc21eo7s97msxqj4y FOREIGN KEY (request_id) REFERENCES public.school_representative_registration_requests(id);


--
-- Name: contracts fkedql6jmdb0su517s3bapsn70d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT fkedql6jmdb0su517s3bapsn70d FOREIGN KEY (contract_template_id) REFERENCES public.contract_templates(id);


--
-- Name: school_merge_records fkfgm5vputgfrycdbgqf7lumy11; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_merge_records
    ADD CONSTRAINT fkfgm5vputgfrycdbgqf7lumy11 FOREIGN KEY (target_school_id) REFERENCES public.schools(id);


--
-- Name: school_dedupe_keys fkfthcchk49nt0sobdc3n7fwqxt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_dedupe_keys
    ADD CONSTRAINT fkfthcchk49nt0sobdc3n7fwqxt FOREIGN KEY (school_id) REFERENCES public.schools(id);


--
-- Name: school_representative_registration_requests fkgk42je6xybxbjsns5g7wfm8q7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_registration_requests
    ADD CONSTRAINT fkgk42je6xybxbjsns5g7wfm8q7 FOREIGN KEY (profile_id) REFERENCES public.school_representative_profiles(id);


--
-- Name: school_representative_registration_requests fki67uv4yeysrpec4cgbjbnya0m; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_registration_requests
    ADD CONSTRAINT fki67uv4yeysrpec4cgbjbnya0m FOREIGN KEY (proof_document_id) REFERENCES public.document_metadata(id);


--
-- Name: school_representative_profiles fkiph9k5121xij8kxto6rahyf4m; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_representative_profiles
    ADD CONSTRAINT fkiph9k5121xij8kxto6rahyf4m FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: tracker_assignments fkkxgucuj8ydnqc4egrgn71jwbk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracker_assignments
    ADD CONSTRAINT fkkxgucuj8ydnqc4egrgn71jwbk FOREIGN KEY (device_id) REFERENCES public.gps_devices(id);


--
-- Name: booking_status_history fkqpj6h79qfscwluo5embxdap7c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_status_history
    ADD CONSTRAINT fkqpj6h79qfscwluo5embxdap7c FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: school_merge_records fkrmt9xcajxxjf8hhtc4ecdie87; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_merge_records
    ADD CONSTRAINT fkrmt9xcajxxjf8hhtc4ecdie87 FOREIGN KEY (merged_by_account_id) REFERENCES public.accounts(id);


--
-- Name: livestream_interactions livestream_interactions_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livestream_interactions
    ADD CONSTRAINT livestream_interactions_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.livestream_sessions(id) ON DELETE CASCADE;


--
-- Name: livestream_interactions livestream_interactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livestream_interactions
    ADD CONSTRAINT livestream_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.accounts(id);


--
-- Name: livestream_sessions livestream_sessions_guide_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.livestream_sessions
    ADD CONSTRAINT livestream_sessions_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.accounts(id);


--
-- Name: refresh_sessions refresh_sessions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_sessions
    ADD CONSTRAINT refresh_sessions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: roster_audit_events roster_audit_events_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roster_audit_events
    ADD CONSTRAINT roster_audit_events_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.roster_import_batches(id);


--
-- Name: roster_import_batches roster_import_batches_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roster_import_batches
    ADD CONSTRAINT roster_import_batches_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: student_class_memberships student_class_memberships_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_class_memberships
    ADD CONSTRAINT student_class_memberships_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.school_classes(id);


--
-- Name: student_class_memberships student_class_memberships_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_class_memberships
    ADD CONSTRAINT student_class_memberships_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) TO dashboard_user;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION send_binary(payload bytea, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION wal2json_escape_identifier(name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO postgres;
GRANT ALL ON FUNCTION realtime.wal2json_escape_identifier(name text) TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE account_audit_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.account_audit_events TO anon;
GRANT ALL ON TABLE public.account_audit_events TO authenticated;
GRANT ALL ON TABLE public.account_audit_events TO service_role;


--
-- Name: TABLE account_roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.account_roles TO anon;
GRANT ALL ON TABLE public.account_roles TO authenticated;
GRANT ALL ON TABLE public.account_roles TO service_role;


--
-- Name: TABLE accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.accounts TO anon;
GRANT ALL ON TABLE public.accounts TO authenticated;
GRANT ALL ON TABLE public.accounts TO service_role;


--
-- Name: TABLE admin_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_profiles TO anon;
GRANT ALL ON TABLE public.admin_profiles TO authenticated;
GRANT ALL ON TABLE public.admin_profiles TO service_role;


--
-- Name: TABLE booking_additional_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.booking_additional_items TO anon;
GRANT ALL ON TABLE public.booking_additional_items TO authenticated;
GRANT ALL ON TABLE public.booking_additional_items TO service_role;


--
-- Name: TABLE booking_itinerary_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.booking_itinerary_items TO anon;
GRANT ALL ON TABLE public.booking_itinerary_items TO authenticated;
GRANT ALL ON TABLE public.booking_itinerary_items TO service_role;


--
-- Name: TABLE booking_roster_students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.booking_roster_students TO anon;
GRANT ALL ON TABLE public.booking_roster_students TO authenticated;
GRANT ALL ON TABLE public.booking_roster_students TO service_role;


--
-- Name: TABLE booking_status_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.booking_status_history TO anon;
GRANT ALL ON TABLE public.booking_status_history TO authenticated;
GRANT ALL ON TABLE public.booking_status_history TO service_role;


--
-- Name: TABLE booking_versions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.booking_versions TO anon;
GRANT ALL ON TABLE public.booking_versions TO authenticated;
GRANT ALL ON TABLE public.booking_versions TO service_role;


--
-- Name: TABLE bookings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;


--
-- Name: TABLE contract_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contract_templates TO anon;
GRANT ALL ON TABLE public.contract_templates TO authenticated;
GRANT ALL ON TABLE public.contract_templates TO service_role;


--
-- Name: TABLE contracts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contracts TO anon;
GRANT ALL ON TABLE public.contracts TO authenticated;
GRANT ALL ON TABLE public.contracts TO service_role;


--
-- Name: TABLE data_anonymization_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.data_anonymization_requests TO anon;
GRANT ALL ON TABLE public.data_anonymization_requests TO authenticated;
GRANT ALL ON TABLE public.data_anonymization_requests TO service_role;


--
-- Name: TABLE data_retention_policies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.data_retention_policies TO anon;
GRANT ALL ON TABLE public.data_retention_policies TO authenticated;
GRANT ALL ON TABLE public.data_retention_policies TO service_role;


--
-- Name: TABLE device_replacement_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.device_replacement_logs TO anon;
GRANT ALL ON TABLE public.device_replacement_logs TO authenticated;
GRANT ALL ON TABLE public.device_replacement_logs TO service_role;


--
-- Name: TABLE document_metadata; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.document_metadata TO anon;
GRANT ALL ON TABLE public.document_metadata TO authenticated;
GRANT ALL ON TABLE public.document_metadata TO service_role;


--
-- Name: TABLE gps_devices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.gps_devices TO anon;
GRANT ALL ON TABLE public.gps_devices TO authenticated;
GRANT ALL ON TABLE public.gps_devices TO service_role;


--
-- Name: TABLE livestream_interactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.livestream_interactions TO anon;
GRANT ALL ON TABLE public.livestream_interactions TO authenticated;
GRANT ALL ON TABLE public.livestream_interactions TO service_role;


--
-- Name: TABLE livestream_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.livestream_sessions TO anon;
GRANT ALL ON TABLE public.livestream_sessions TO authenticated;
GRANT ALL ON TABLE public.livestream_sessions TO service_role;


--
-- Name: TABLE parent_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.parent_profiles TO anon;
GRANT ALL ON TABLE public.parent_profiles TO authenticated;
GRANT ALL ON TABLE public.parent_profiles TO service_role;


--
-- Name: TABLE permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.permissions TO anon;
GRANT ALL ON TABLE public.permissions TO authenticated;
GRANT ALL ON TABLE public.permissions TO service_role;


--
-- Name: TABLE refresh_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.refresh_sessions TO anon;
GRANT ALL ON TABLE public.refresh_sessions TO authenticated;
GRANT ALL ON TABLE public.refresh_sessions TO service_role;


--
-- Name: TABLE registration_revision_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.registration_revision_sessions TO anon;
GRANT ALL ON TABLE public.registration_revision_sessions TO authenticated;
GRANT ALL ON TABLE public.registration_revision_sessions TO service_role;


--
-- Name: TABLE role_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.role_permissions TO anon;
GRANT ALL ON TABLE public.role_permissions TO authenticated;
GRANT ALL ON TABLE public.role_permissions TO service_role;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roles TO anon;
GRANT ALL ON TABLE public.roles TO authenticated;
GRANT ALL ON TABLE public.roles TO service_role;


--
-- Name: TABLE roster_audit_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roster_audit_events TO anon;
GRANT ALL ON TABLE public.roster_audit_events TO authenticated;
GRANT ALL ON TABLE public.roster_audit_events TO service_role;


--
-- Name: TABLE roster_import_batches; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roster_import_batches TO anon;
GRANT ALL ON TABLE public.roster_import_batches TO authenticated;
GRANT ALL ON TABLE public.roster_import_batches TO service_role;


--
-- Name: TABLE route_cache; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.route_cache TO anon;
GRANT ALL ON TABLE public.route_cache TO authenticated;
GRANT ALL ON TABLE public.route_cache TO service_role;


--
-- Name: TABLE sales_staff_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sales_staff_profiles TO anon;
GRANT ALL ON TABLE public.sales_staff_profiles TO authenticated;
GRANT ALL ON TABLE public.sales_staff_profiles TO service_role;


--
-- Name: TABLE school_classes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_classes TO anon;
GRANT ALL ON TABLE public.school_classes TO authenticated;
GRANT ALL ON TABLE public.school_classes TO service_role;


--
-- Name: TABLE school_dedupe_keys; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_dedupe_keys TO anon;
GRANT ALL ON TABLE public.school_dedupe_keys TO authenticated;
GRANT ALL ON TABLE public.school_dedupe_keys TO service_role;


--
-- Name: TABLE school_merge_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_merge_records TO anon;
GRANT ALL ON TABLE public.school_merge_records TO authenticated;
GRANT ALL ON TABLE public.school_merge_records TO service_role;


--
-- Name: TABLE school_representative_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_representative_profiles TO anon;
GRANT ALL ON TABLE public.school_representative_profiles TO authenticated;
GRANT ALL ON TABLE public.school_representative_profiles TO service_role;


--
-- Name: TABLE school_representative_registration_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_representative_registration_requests TO anon;
GRANT ALL ON TABLE public.school_representative_registration_requests TO authenticated;
GRANT ALL ON TABLE public.school_representative_registration_requests TO service_role;


--
-- Name: TABLE schools; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.schools TO anon;
GRANT ALL ON TABLE public.schools TO authenticated;
GRANT ALL ON TABLE public.schools TO service_role;


--
-- Name: TABLE student_class_memberships; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_class_memberships TO anon;
GRANT ALL ON TABLE public.student_class_memberships TO authenticated;
GRANT ALL ON TABLE public.student_class_memberships TO service_role;


--
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.students TO anon;
GRANT ALL ON TABLE public.students TO authenticated;
GRANT ALL ON TABLE public.students TO service_role;


--
-- Name: TABLE system_policies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.system_policies TO anon;
GRANT ALL ON TABLE public.system_policies TO authenticated;
GRANT ALL ON TABLE public.system_policies TO service_role;


--
-- Name: TABLE teacher_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teacher_profiles TO anon;
GRANT ALL ON TABLE public.teacher_profiles TO authenticated;
GRANT ALL ON TABLE public.teacher_profiles TO service_role;


--
-- Name: TABLE telemetry_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.telemetry_events TO anon;
GRANT ALL ON TABLE public.telemetry_events TO authenticated;
GRANT ALL ON TABLE public.telemetry_events TO service_role;


--
-- Name: TABLE tour_guide_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tour_guide_profiles TO anon;
GRANT ALL ON TABLE public.tour_guide_profiles TO authenticated;
GRANT ALL ON TABLE public.tour_guide_profiles TO service_role;


--
-- Name: TABLE tour_manager_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tour_manager_profiles TO anon;
GRANT ALL ON TABLE public.tour_manager_profiles TO authenticated;
GRANT ALL ON TABLE public.tour_manager_profiles TO service_role;


--
-- Name: TABLE tour_operator_staff_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tour_operator_staff_profiles TO anon;
GRANT ALL ON TABLE public.tour_operator_staff_profiles TO authenticated;
GRANT ALL ON TABLE public.tour_operator_staff_profiles TO service_role;


--
-- Name: TABLE tour_request_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tour_request_items TO anon;
GRANT ALL ON TABLE public.tour_request_items TO authenticated;
GRANT ALL ON TABLE public.tour_request_items TO service_role;


--
-- Name: TABLE tour_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tour_requests TO anon;
GRANT ALL ON TABLE public.tour_requests TO authenticated;
GRANT ALL ON TABLE public.tour_requests TO service_role;


--
-- Name: TABLE tracker_assignments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tracker_assignments TO anon;
GRANT ALL ON TABLE public.tracker_assignments TO authenticated;
GRANT ALL ON TABLE public.tracker_assignments TO service_role;


--
-- Name: TABLE transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transactions TO anon;
GRANT ALL ON TABLE public.transactions TO authenticated;
GRANT ALL ON TABLE public.transactions TO service_role;


--
-- Name: TABLE trb_audit_events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trb_audit_events TO anon;
GRANT ALL ON TABLE public.trb_audit_events TO authenticated;
GRANT ALL ON TABLE public.trb_audit_events TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict 4bb5DzdSG0eqMcx0lhs1hXde4E9BmalbXOr9cQUW7Vbtwd1GKykualGytA4wSpL

