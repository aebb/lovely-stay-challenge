CREATE TABLE public.languages (
    id SERIAL PRIMARY KEY NOT NULL,
    name character varying(255) UNIQUE NOT NULL
);

CREATE TABLE public.locations (
    id SERIAL PRIMARY KEY NOT NULL,
    name character varying(255) UNIQUE NOT NULL
);

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY NOT NULL,
    name character varying(255) UNIQUE NOT NULL,
    location_id integer REFERENCES public.locations(id)
);

CREATE TABLE public.user_languages (
    user_id integer NOT NULL REFERENCES public.users(id),
    language_id integer NOT NULL REFERENCES public.languages(id),
    CONSTRAINT user_languages_pkey PRIMARY KEY (user_id, language_id)
);

