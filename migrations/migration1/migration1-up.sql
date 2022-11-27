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
    location_id integer,
    CONSTRAINT fk_users_location FOREIGN KEY (location_id) REFERENCES public.locations(id)
);

CREATE TABLE public.user_languages (
    user_id integer NOT NULL,
    language_id integer NOT NULL,
    CONSTRAINT user_languages_pkey PRIMARY KEY (user_id, language_id),
    CONSTRAINT fk_language_id_language FOREIGN KEY (language_id) REFERENCES public.languages(id),
    CONSTRAINT fk_user_id_user FOREIGN KEY (user_id) REFERENCES public.users(id)
);

