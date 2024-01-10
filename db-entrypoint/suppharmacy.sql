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
-- Name: drug_category; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.drug_category (
    id integer NOT NULL,
    active boolean NOT NULL default TRUE,
    name character varying(100) NOT NULL
);


ALTER TABLE public.drug_category OWNER TO suppharmacy;

--
-- Name: drug_category_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.drug_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.drug_category_id_seq OWNER TO suppharmacy;

--
-- Name: drug_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.drug_category_id_seq OWNED BY public.drug_category.id;

--
-- Name: product_product; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.product_product (
    id integer NOT NULL,
    active boolean NOT NULL default TRUE,
    code character varying(15),
    dealer_price numeric,
    description character varying(150),
    list_price numeric,
    name character varying(100) NOT NULL,
    sale_ok boolean NOT NULL,
    presentation character varying(100),
    laboratory_id integer,
    drug_category_id integer,
    is_antibiotic boolean
);


ALTER TABLE public.product_product OWNER TO suppharmacy;

--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_product_id_seq OWNER TO suppharmacy;

--
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.product_product_id_seq OWNED BY public.product_product.id;


--
-- Name: purchase_order; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.purchase_order (
    id integer NOT NULL,
    active boolean NOT NULL default TRUE,
    amount_total numeric(8,2),
    date date,
    name character varying(100) NOT NULL,
    partner_id integer,
    state character varying(15),
    user_id integer
);


ALTER TABLE public.purchase_order OWNER TO suppharmacy;

--
-- Name: purchase_order_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.purchase_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchase_order_id_seq OWNER TO suppharmacy;

--
-- Name: purchase_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.purchase_order_id_seq OWNED BY public.purchase_order.id;


--
-- Name: purchase_order_line; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.purchase_order_line (
    id integer NOT NULL,
    order_id integer,
    price_unit numeric(8,2),
    price_total numeric(8,2),
    product_id integer,
    product_qty numeric
);


ALTER TABLE public.purchase_order_line OWNER TO suppharmacy;

--
-- Name: purchase_order_line_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.purchase_order_line_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchase_order_line_id_seq OWNER TO suppharmacy;

--
-- Name: purchase_order_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.purchase_order_line_id_seq OWNED BY public.purchase_order_line.id;


--
-- Name: res_laboratory; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.res_laboratory (
    id integer NOT NULL,
    active boolean NOT NULL default TRUE,
    name character varying(100) NOT NULL
);


ALTER TABLE public.res_laboratory OWNER TO suppharmacy;

--
-- Name: res_laboratory_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.res_laboratory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.res_laboratory_id_seq OWNER TO suppharmacy;

--
-- Name: res_laboratory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.res_laboratory_id_seq OWNED BY public.res_laboratory.id;


--
-- Name: res_partner; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.res_partner (
    id integer NOT NULL,
    active boolean NOT NULL default TRUE,
    name character varying(100) NOT NULL,
    city character varying(100),
    country character varying(100),
    email character varying(100),
    is_company boolean NOT NULL,
    mobile character varying(15),
    phone character varying(15),
    ref character varying(100),
    rfc character varying(15),
    cp character varying(5),
    birth_date date,
    customer boolean,
    supplier boolean
);


ALTER TABLE public.res_partner OWNER TO suppharmacy;

--
-- Name: res_partner_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.res_partner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.res_partner_id_seq OWNER TO suppharmacy;

--
-- Name: res_partner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.res_partner_id_seq OWNED BY public.res_partner.id;


--
-- Name: res_users; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.res_users (
    id integer NOT NULL,
    active boolean NOT NULL default TRUE,
    name character varying(100) NOT NULL,
    username character varying(50) NOT NULL UNIQUE,
    password character varying(131) NOT NULL
);


ALTER TABLE public.res_users OWNER TO suppharmacy;

--
-- Name: res_users_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.res_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.res_users_id_seq OWNER TO suppharmacy;

--
-- Name: res_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.res_users_id_seq OWNED BY public.res_users.id;


--
-- Name: sale_order; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.sale_order (
    id integer NOT NULL,
    active boolean NOT NULL default TRUE,
    amount_total numeric(8,2),
    date date,
    name character varying(100) NOT NULL,
    partner_id integer,
    state character varying(15),
    user_id integer,
    requires_prescription boolean default FALSE,
    prescription boolean default FALSE
);


ALTER TABLE public.sale_order OWNER TO suppharmacy;

--
-- Name: sale_order_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.sale_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sale_order_id_seq OWNER TO suppharmacy;

--
-- Name: sale_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.sale_order_id_seq OWNED BY public.sale_order.id;


--
-- Name: sale_order_line; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.sale_order_line (
    id integer NOT NULL,
    order_id integer,
    price_unit numeric(8,2),
    price_total numeric(8,2),
    product_id integer,
    product_qty numeric
);


ALTER TABLE public.sale_order_line OWNER TO suppharmacy;

--
-- Name: sale_order_line_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.sale_order_line_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sale_order_line_id_seq OWNER TO suppharmacy;

--
-- Name: sale_order_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.sale_order_line_id_seq OWNED BY public.sale_order_line.id;


--
-- Name: stock_move; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.stock_move (
    id integer NOT NULL,
    date date,
    name character varying(100) NOT NULL,
    origin character varying(100),
    picking_id integer,
    quantity_done numeric,
    product_id integer,
    product_qty numeric,
    lot_number character varying(100),
    expiration_time date
);


ALTER TABLE public.stock_move OWNER TO suppharmacy;

--
-- Name: stock_move_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.stock_move_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_move_id_seq OWNER TO suppharmacy;

--
-- Name: stock_move_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.stock_move_id_seq OWNED BY public.stock_move.id;


--
-- Name: stock_picking; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.stock_picking (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    date date,
    partner_id integer,
    sale_id integer,
    purchase_id integer,
    state character varying(15),
    type_picking character varying(50),
    user_id integer
);


ALTER TABLE public.stock_picking OWNER TO suppharmacy;

--
-- Name: stock_picking_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.stock_picking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_picking_id_seq OWNER TO suppharmacy;

--
-- Name: stock_picking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.stock_picking_id_seq OWNED BY public.stock_picking.id;


--
-- Name: stock_quant; Type: TABLE; Schema: public; Owner: suppharmacy
--

CREATE TABLE public.stock_quant (
    id integer NOT NULL,
    available_quantity numeric,
    expiration_time date,
    lot_number character varying(100),
    product_id integer,
    quantity numeric
);


ALTER TABLE public.stock_quant OWNER TO suppharmacy;

--
-- Name: stock_quant_id_seq; Type: SEQUENCE; Schema: public; Owner: suppharmacy
--

CREATE SEQUENCE public.stock_quant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_quant_id_seq OWNER TO suppharmacy;

--
-- Name: stock_quant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: suppharmacy
--

ALTER SEQUENCE public.stock_quant_id_seq OWNED BY public.stock_quant.id;


--
-- Name: drug_category id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.drug_category ALTER COLUMN id SET DEFAULT nextval('public.drug_category_id_seq'::regclass);

--
-- Name: product_product id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.product_product ALTER COLUMN id SET DEFAULT nextval('public.product_product_id_seq'::regclass);


--
-- Name: purchase_order id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.purchase_order ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_id_seq'::regclass);


--
-- Name: purchase_order_line id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.purchase_order_line ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_line_id_seq'::regclass);


--
-- Name: res_laboratory id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.res_laboratory ALTER COLUMN id SET DEFAULT nextval('public.res_laboratory_id_seq'::regclass);


--
-- Name: res_partner id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.res_partner ALTER COLUMN id SET DEFAULT nextval('public.res_partner_id_seq'::regclass);


--
-- Name: res_users id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.res_users ALTER COLUMN id SET DEFAULT nextval('public.res_users_id_seq'::regclass);


--
-- Name: sale_order id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.sale_order ALTER COLUMN id SET DEFAULT nextval('public.sale_order_id_seq'::regclass);


--
-- Name: sale_order_line id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.sale_order_line ALTER COLUMN id SET DEFAULT nextval('public.sale_order_line_id_seq'::regclass);


--
-- Name: stock_move id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_move ALTER COLUMN id SET DEFAULT nextval('public.stock_move_id_seq'::regclass);


--
-- Name: stock_picking id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_picking ALTER COLUMN id SET DEFAULT nextval('public.stock_picking_id_seq'::regclass);


--
-- Name: stock_quant id; Type: DEFAULT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_quant ALTER COLUMN id SET DEFAULT nextval('public.stock_quant_id_seq'::regclass);


--
-- Data for Name: drug_category; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.drug_category (id, active, name) FROM stdin;
\.


--
-- Data for Name: product_product; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.product_product (id, active, code, dealer_price, description, list_price, name, sale_ok, presentation, laboratory_id, drug_category_id, is_antibiotic) FROM stdin;
\.


--
-- Data for Name: purchase_order; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.purchase_order (id, active, amount_total, date, name, partner_id, state, user_id) FROM stdin;
\.


--
-- Data for Name: purchase_order_line; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.purchase_order_line (id, order_id, price_unit, price_total, product_id, product_qty) FROM stdin;
\.


--
-- Data for Name: res_laboratory; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.res_laboratory (id, active, name) FROM stdin;
\.


--
-- Data for Name: res_partner; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.res_partner (id, active, name, city, country, email, is_company, mobile, phone, ref, rfc, cp, birth_date, customer, supplier) FROM stdin;
\.


--
-- Data for Name: res_users; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.res_users (id, active, name, username, password) FROM stdin;
\.


--
-- Data for Name: sale_order; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.sale_order (id, active, amount_total, date, name, partner_id, state, user_id, requires_prescription, prescription) FROM stdin;
\.


--
-- Data for Name: sale_order_line; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.sale_order_line (id, order_id, price_unit, price_total, product_id, product_qty) FROM stdin;
\.


--
-- Data for Name: stock_move; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.stock_move (id, date, name, origin, picking_id, quantity_done, product_id, product_qty, lot_number, expiration_time) FROM stdin;
\.


--
-- Data for Name: stock_picking; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.stock_picking (id, name, date, partner_id, sale_id, purchase_id, state, type_picking, user_id) FROM stdin;
\.


--
-- Data for Name: stock_quant; Type: TABLE DATA; Schema: public; Owner: suppharmacy
--

COPY public.stock_quant (id, available_quantity, expiration_time, lot_number, product_id, quantity) FROM stdin;
\.


--
-- Name: drug_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.drug_category_id_seq', 1, false);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.product_product_id_seq', 1, false);


--
-- Name: purchase_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.purchase_order_id_seq', 1, false);


--
-- Name: purchase_order_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.purchase_order_line_id_seq', 1, false);


--
-- Name: res_laboratory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.res_laboratory_id_seq', 1, false);


--
-- Name: res_partner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.res_partner_id_seq', 4, true);


--
-- Name: res_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.res_users_id_seq', 1, false);


--
-- Name: sale_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.sale_order_id_seq', 1, false);


--
-- Name: sale_order_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.sale_order_line_id_seq', 1, false);


--
-- Name: stock_move_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.stock_move_id_seq', 1, false);


--
-- Name: stock_picking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.stock_picking_id_seq', 1, false);


--
-- Name: stock_quant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: suppharmacy
--

SELECT pg_catalog.setval('public.stock_quant_id_seq', 1, false);


--
-- Name: drug_category drug_category_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.drug_category
    ADD CONSTRAINT drug_category_pkey PRIMARY KEY (id);

--
-- Name: product_product product_product_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.product_product
    ADD CONSTRAINT product_product_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_line purchase_order_line_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.purchase_order_line
    ADD CONSTRAINT purchase_order_line_pkey PRIMARY KEY (id);


--
-- Name: purchase_order purchase_order_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT purchase_order_pkey PRIMARY KEY (id);


--
-- Name: res_laboratory res_laboratory_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.res_laboratory
    ADD CONSTRAINT res_laboratory_pkey PRIMARY KEY (id);


--
-- Name: res_partner res_partner_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.res_partner
    ADD CONSTRAINT res_partner_pkey PRIMARY KEY (id);


--
-- Name: res_users res_users_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.res_users
    ADD CONSTRAINT res_users_pkey PRIMARY KEY (id);


--
-- Name: res_users res_users_username_key; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.res_users
    ADD CONSTRAINT res_users_username_key UNIQUE (username);


--
-- Name: sale_order_line sale_order_line_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.sale_order_line
    ADD CONSTRAINT sale_order_line_pkey PRIMARY KEY (id);


--
-- Name: sale_order sale_order_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.sale_order
    ADD CONSTRAINT sale_order_pkey PRIMARY KEY (id);


--
-- Name: stock_move stock_move_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_move
    ADD CONSTRAINT stock_move_pkey PRIMARY KEY (id);


--
-- Name: stock_picking stock_picking_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_picking
    ADD CONSTRAINT stock_picking_pkey PRIMARY KEY (id);


--
-- Name: stock_quant stock_quant_pkey; Type: CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_quant
    ADD CONSTRAINT stock_quant_pkey PRIMARY KEY (id);


--
-- Name: product_product product_product_drug_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.product_product
    ADD CONSTRAINT product_product_drug_category_id_fkey FOREIGN KEY (drug_category_id) REFERENCES public.drug_category(id);


--
-- Name: product_product product_product_laboratory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.product_product
    ADD CONSTRAINT product_product_laboratory_id_fkey FOREIGN KEY (laboratory_id) REFERENCES public.res_laboratory(id);


--
-- Name: purchase_order_line purchase_order_line_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.purchase_order_line
    ADD CONSTRAINT purchase_order_line_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.purchase_order(id) ON DELETE CASCADE;


--
-- Name: purchase_order_line purchase_order_line_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.purchase_order_line
    ADD CONSTRAINT purchase_order_line_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product_product(id);


--
-- Name: purchase_order purchase_order_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT purchase_order_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.res_partner(id);


--
-- Name: purchase_order purchase_order_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT purchase_order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.res_users(id);


--
-- Name: sale_order_line sale_order_line_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.sale_order_line
    ADD CONSTRAINT sale_order_line_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.sale_order(id) ON DELETE CASCADE;


--
-- Name: sale_order_line sale_order_line_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.sale_order_line
    ADD CONSTRAINT sale_order_line_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product_product(id);


--
-- Name: sale_order sale_order_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.sale_order
    ADD CONSTRAINT sale_order_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.res_partner(id);


--
-- Name: sale_order sale_order_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.sale_order
    ADD CONSTRAINT sale_order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.res_users(id);


--
-- Name: stock_move stock_move_picking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_move
    ADD CONSTRAINT stock_move_picking_id_fkey FOREIGN KEY (picking_id) REFERENCES public.stock_picking(id) ON DELETE CASCADE;


--
-- Name: stock_move stock_move_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_move
    ADD CONSTRAINT stock_move_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product_product(id);

--
-- Name: stock_picking stock_picking_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_picking
    ADD CONSTRAINT stock_picking_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.res_partner(id);


--
-- Name: stock_picking stock_picking_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_picking
    ADD CONSTRAINT stock_picking_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.purchase_order(id);


--
-- Name: stock_picking stock_picking_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_picking
    ADD CONSTRAINT stock_picking_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sale_order(id);


--
-- Name: stock_picking stock_picking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_picking
    ADD CONSTRAINT stock_picking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.res_users(id);


--
-- Name: stock_quant stock_quant_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: suppharmacy
--

ALTER TABLE ONLY public.stock_quant
    ADD CONSTRAINT stock_quant_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product_product(id);


--
-- PostgreSQL database dump complete
--

