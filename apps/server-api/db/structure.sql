-----------------------------------------------------------
-- THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY) --
-----------------------------------------------------------


CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

CREATE FUNCTION public.settings_scope_priority(scope public.ltree, fallback text DEFAULT ''::text, root text DEFAULT 'root'::text) RETURNS integer
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN CASE scope::text
         WHEN 'root' THEN 0
         WHEN fallback THEN 1
         ELSE nlevel(scope)
         END;

END;

$$;

COMMENT ON FUNCTION public.settings_scope_priority(scope public.ltree, fallback text, root text) IS 'Returns the priority of a scope. The root scope has the lowest priority.';

CREATE TABLE public.accounts_providers (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    provider character varying(256) NOT NULL,
    subject character varying(512) NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);

COMMENT ON COLUMN public.accounts_providers.meta IS 'Provider metadata';

CREATE SEQUENCE public.accounts_providers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.accounts_providers_id_seq OWNED BY public.accounts_providers.id;

CREATE TABLE public.accounts_users (
    id integer NOT NULL,
    locked_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);

CREATE SEQUENCE public.accounts_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.accounts_users_id_seq OWNED BY public.accounts_users.id;

CREATE TABLE public.db_migrations (
    name text NOT NULL,
    hash text NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.events (
    id integer NOT NULL,
    actor_type character varying(256) NOT NULL,
    actor_id character varying(256) NOT NULL,
    event character varying(256) NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL
)
WITH (fillfactor='85');

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;

CREATE TABLE public.settings (
    id integer NOT NULL,
    key public.ltree NOT NULL,
    value jsonb,
    scope public.ltree NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);

COMMENT ON COLUMN public.settings.key IS 'Settings key with namespace';

COMMENT ON COLUMN public.settings.scope IS 'Scope of application of key. format: {spaceId}.{userId}';

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;

CREATE TABLE public.spaces (
    id integer NOT NULL,
    owner_id bigint NOT NULL,
    locked_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    domain character varying(256) NOT NULL,
    name text NOT NULL,
    bio text,
    initialized boolean DEFAULT false NOT NULL,
    personal boolean DEFAULT false NOT NULL,
    invite_enable boolean DEFAULT false NOT NULL,
    invite_secret character varying(256) NOT NULL
);

CREATE SEQUENCE public.spaces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.spaces_id_seq OWNED BY public.spaces.id;

CREATE TABLE public.spaces_members (
    id integer NOT NULL,
    space_id bigint NOT NULL,
    user_id bigint NOT NULL,
    role integer NOT NULL,
    state integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);

CREATE SEQUENCE public.spaces_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.spaces_members_id_seq OWNED BY public.spaces_members.id;

ALTER TABLE ONLY public.accounts_providers ALTER COLUMN id SET DEFAULT nextval('public.accounts_providers_id_seq'::regclass);

ALTER TABLE ONLY public.accounts_users ALTER COLUMN id SET DEFAULT nextval('public.accounts_users_id_seq'::regclass);

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);

ALTER TABLE ONLY public.spaces ALTER COLUMN id SET DEFAULT nextval('public.spaces_id_seq'::regclass);

ALTER TABLE ONLY public.spaces_members ALTER COLUMN id SET DEFAULT nextval('public.spaces_members_i


d_seq'::regclass);

ALTER TABLE ONLY public.accounts_providers
    ADD CONSTRAINT accounts_providers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.db_migrations
    ADD CONSTRAINT db_migrations_pkey PRIMARY KEY (name);

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.spaces_members
    ADD CONSTRAINT spaces_members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_pkey PRIMARY KEY (id);

CREATE UNIQUE INDEX accounts_providers_provider_subject_ukey ON public.accounts_providers USING btree (provider, subject);

CREATE INDEX events_actor_type_actor_id_event_key ON public.events USING btree (actor_type, actor_id, event);

CREATE UNIQUE INDEX settings_key_scope_ukey ON public.settings USING btree (key, scope);

CREATE UNIQUE INDEX spaces_invite_secret_ukey ON public.spaces USING btree (invite_secret);

CREATE UNIQUE INDEX spaces_lower_domain_text_ukey ON public.spaces USING btree (lower((domain)::text));

ALTER TABLE ONLY public.accounts_providers
    ADD CONSTRAINT accounts_providers_user_id_fk FOREIGN KEY (user_id) REFERENCES public.accounts_users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.spaces_members
    ADD CONSTRAINT spaces_members_space_id_fk FOREIGN KEY (space_id) REFERENCES public.spaces(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.spaces_members
    ADD CONSTRAINT spaces_members_user_id_fk FOREIGN KEY (user_id) REFERENCES public.accounts_users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_owner_id_fk FOREIGN KEY (owner_id) REFERENCES public.accounts_users(id) ON DELETE RESTRICT;

