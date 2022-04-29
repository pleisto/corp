-----------------------------------------------------------
-- THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY) --
-----------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS ltree WITH SCHEMA public;

COMMENT ON EXTENSION ltree IS 'data type for hierarchical tree-like structures';

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';

CREATE TYPE public.pod_kind AS ENUM (
    'user',
    'space'
);

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

CREATE TABLE public.db_migrations (
    name text NOT NULL,
    hash text NOT NULL,
    date timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.events (
    id integer NOT NULL,
    actor_type text NOT NULL,
    actor_id text NOT NULL,
    target_type text,
    target_id text,
    event text NOT NULL,
    context jsonb DEFAULT '{}'::jsonb NOT NULL,
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

CREATE TABLE public.pods (
    id integer NOT NULL,
    kind public.pod_kind NOT NULL,
    locked_at timestamp without time zone,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    bio text
);

CREATE SEQUENCE public.pods_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.pods_id_seq OWNED BY public.pods.id;

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
    owner_id bigint NOT NULL,
    invite_enable boolean DEFAULT false NOT NULL,
    invite_secret text NOT NULL
)
INHERITS (public.pods);

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

CREATE TABLE public.users (
    initialized boolean DEFAULT false NOT NULL
)
INHERITS (public.pods);

CREATE TABLE public.users_providers (
    id integer NOT NULL,
    user_id bigint NOT NULL,
    provider text NOT NULL,
    subject text NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);

COMMENT ON COLUMN public.users_providers.meta IS 'Provider metadata';

CREATE SEQUENCE public.users_providers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.users_providers_id_seq OWNED BY public.users_providers.id;

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);

ALTER TABLE ONLY public.pods ALTER COLUMN id SET DEFAULT nextval('public.pods_id_seq'::regclass);

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);

ALTER TABLE ONLY public.spaces ALTER COLUMN id SET DEFAULT nextval('public.pods_id_seq'::regclass);

ALTER TABLE ONLY public.spaces_members ALTER COLUMN id SET DEFAULT nextval('public.spaces_members_id_seq'::regclass);

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.pods_id_seq'::regclass);

ALTER TABLE ONLY public.users_providers ALTER COLUMN id SET DEFAULT nextval('public.users_providers_id_seq'::regclass);

ALTER TABLE ONLY public.db_migrations
    ADD CONSTRAINT db_migrations_pkey PRIMARY KEY (name);

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.pods
    ADD CONSTRAINT pods_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.spaces_members
    ADD CONSTRAINT spaces_members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users_providers
    ADD CONSTRAINT users_providers_pkey PRIMARY KEY (id);

CREATE INDEX events_actor_type_actor_id_event_key ON public.events USING btree (actor_type, actor_id, event);

CREATE UNIQUE INDEX pods_lower_slug_text_ukey ON public.pods USING btree (lower(slug));

CREATE UNIQUE INDEX settings_key_scope_ukey ON public.settings USING btree (key, scope);

CREATE UNIQUE INDEX spaces_invite_secret_ukey ON public.spaces USING btree (invite_secret);

CREATE UNIQUE INDEX users_providers_provider_subject_ukey ON public.users_providers USING btree (provider, subject);

ALTER TABLE ONLY public.spaces_members
    ADD CONSTRAINT spaces_members_space_id_fk FOREIGN KEY (space_id) REFERENCES public.pods(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.spaces_members
    ADD CONSTRAINT spaces_members_user_id_fk FOREIGN KEY (user_id) REFERENCES public.pods(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.spaces
    ADD CONSTRAINT spaces_owner_id_fk FOREIGN KEY (owner_id) REFERENCES public.pods(id) ON DELETE RESTRICT;

ALTER TABLE ONLY public.users_providers
    ADD CONSTRAINT users_providers_user_id_fk FOREIGN KEY (user_id) REFERENCES public.pods(id) ON DELETE CASCADE;

