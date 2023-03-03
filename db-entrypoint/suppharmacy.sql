--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Debian 14.7-1.pgdg110+1)
-- Dumped by pg_dump version 14.7 (Debian 14.7-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: partner; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.partner (
    id integer NOT NULL,
    name character varying(100),
    last_name character varying(100)
);


ALTER TABLE public.partner OWNER TO suppharmacy;

--
-- Name: partner_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.partner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.partner_id_seq OWNER TO suppharmacy;

--
-- Name: partner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.partner_id_seq OWNED BY public.partner.id;


--
-- Name: partner id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.partner ALTER COLUMN id SET DEFAULT nextval('public.partner_id_seq'::regclass);


--
-- Data for Name: partner; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.partner (id, name, last_name) FROM stdin;
\.


--
-- Name: partner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.partner_id_seq', 1, false);


--
-- Name: partner partner_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.partner
    ADD CONSTRAINT partner_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

