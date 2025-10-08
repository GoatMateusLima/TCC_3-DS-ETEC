--
-- PostgreSQL database dump
--

\restrict N0DAPUpVTELxVwyEsKttK3E0nBw1mY1dTUDCcLfzbrBQGYix2AcnsaDMC5r0p0f

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-06 00:00:07

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16416)
-- Name: adocao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adocao (
    adocao_id integer NOT NULL,
    data_adocao date NOT NULL,
    status character varying(30) NOT NULL,
    adotante_id integer NOT NULL,
    animal_id integer NOT NULL
);


ALTER TABLE public.adocao OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16415)
-- Name: adocao_adocao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adocao_adocao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adocao_adocao_id_seq OWNER TO postgres;

--
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 223
-- Name: adocao_adocao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adocao_adocao_id_seq OWNED BY public.adocao.adocao_id;


--
-- TOC entry 222 (class 1259 OID 16407)
-- Name: adotante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adotante (
    adotante_id integer NOT NULL,
    nome character varying(250) NOT NULL,
    email character varying(250) NOT NULL,
    whatsapp character varying(20) NOT NULL,
    data_cadastro date NOT NULL,
    data_nascimento date,
    cpf character varying(18) NOT NULL,
    link_validacao character varying(200)
);


ALTER TABLE public.adotante OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16406)
-- Name: adotante_adotante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adotante_adotante_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adotante_adotante_id_seq OWNER TO postgres;

--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 221
-- Name: adotante_adotante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adotante_adotante_id_seq OWNED BY public.adotante.adotante_id;


--
-- TOC entry 220 (class 1259 OID 16398)
-- Name: animal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.animal (
    animal_id integer NOT NULL,
    nome character varying(100) NOT NULL,
    especie character varying(50) NOT NULL,
    raca character varying(100) NOT NULL,
    sexo character varying(10) NOT NULL,
    descricao character varying(300),
    data_entrada date,
    data_saida date,
    link_img text
);


ALTER TABLE public.animal OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16397)
-- Name: animal_animal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.animal_animal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.animal_animal_id_seq OWNER TO postgres;

--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 219
-- Name: animal_animal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.animal_animal_id_seq OWNED BY public.animal.animal_id;


--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: membros_ong; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membros_ong (
    membro_id integer NOT NULL,
    nome character varying(250) NOT NULL,
    cpf character varying(18) NOT NULL,
    email character varying(250) NOT NULL,
    whatsapp character varying(20) NOT NULL,
    data_entrada date NOT NULL,
    link_validacao character varying(200),
    funcao character varying(100) NOT NULL
);


ALTER TABLE public.membros_ong OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: membros_ong_membro_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.membros_ong_membro_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membros_ong_membro_id_seq OWNER TO postgres;

--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 217
-- Name: membros_ong_membro_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.membros_ong_membro_id_seq OWNED BY public.membros_ong.membro_id;


--
-- TOC entry 226 (class 1259 OID 16433)
-- Name: ong; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ong (
    ong_id integer NOT NULL,
    nome character varying(250) NOT NULL,
    email character varying(250) NOT NULL,
    cnpj character varying(18) NOT NULL,
    rua character varying(250) NOT NULL,
    whatsapp character varying(20) NOT NULL,
    data_criacao date NOT NULL,
    cep character varying(9) NOT NULL,
    bairro character varying(150) NOT NULL,
    numero character varying(10) NOT NULL,
    membro_id integer,
    status_registro boolean DEFAULT true
);


ALTER TABLE public.ong OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16432)
-- Name: ong_ong_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ong_ong_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ong_ong_id_seq OWNER TO postgres;

--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 225
-- Name: ong_ong_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ong_ong_id_seq OWNED BY public.ong.ong_id;


--
-- TOC entry 4664 (class 2604 OID 16419)
-- Name: adocao adocao_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adocao ALTER COLUMN adocao_id SET DEFAULT nextval('public.adocao_adocao_id_seq'::regclass);


--
-- TOC entry 4663 (class 2604 OID 16410)
-- Name: adotante adotante_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adotante ALTER COLUMN adotante_id SET DEFAULT nextval('public.adotante_adotante_id_seq'::regclass);


--
-- TOC entry 4662 (class 2604 OID 16401)
-- Name: animal animal_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.animal ALTER COLUMN animal_id SET DEFAULT nextval('public.animal_animal_id_seq'::regclass);


--
-- TOC entry 4661 (class 2604 OID 16392)
-- Name: membros_ong membro_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membros_ong ALTER COLUMN membro_id SET DEFAULT nextval('public.membros_ong_membro_id_seq'::regclass);


--
-- TOC entry 4665 (class 2604 OID 16436)
-- Name: ong ong_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ong ALTER COLUMN ong_id SET DEFAULT nextval('public.ong_ong_id_seq'::regclass);


--
-- TOC entry 4848 (class 0 OID 16416)
-- Dependencies: 224
-- Data for Name: adocao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adocao (adocao_id, data_adocao, status, adotante_id, animal_id) FROM stdin;
\.


--
-- TOC entry 4846 (class 0 OID 16407)
-- Dependencies: 222
-- Data for Name: adotante; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adotante (adotante_id, nome, email, whatsapp, data_cadastro, data_nascimento, cpf, link_validacao) FROM stdin;
\.


--
-- TOC entry 4844 (class 0 OID 16398)
-- Dependencies: 220
-- Data for Name: animal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.animal (animal_id, nome, especie, raca, sexo, descricao, data_entrada, data_saida, link_img) FROM stdin;
\.


--
-- TOC entry 4842 (class 0 OID 16389)
-- Dependencies: 218
-- Data for Name: membros_ong; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.membros_ong (membro_id, nome, cpf, email, whatsapp, data_entrada, link_validacao, funcao) FROM stdin;
\.


--
-- TOC entry 4850 (class 0 OID 16433)
-- Dependencies: 226
-- Data for Name: ong; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ong (ong_id, nome, email, cnpj, rua, whatsapp, data_criacao, cep, bairro, numero, membro_id, status_registro) FROM stdin;
1	ONG Teste	teste@ong.com	12345678901234	Rua A	11999999999	2024-09-20	12345678	Centro	100	\N	t
2	ONG PETS	pestsanka@gamil.com	12348678901234	Rua A	11999999999	2024-09-20	12345678	Centro	100	\N	t
3	ONG HOT	hots@gmail.com	12345678901239	Rua A	11999999999	2024-09-20	12345678	Centro	100	\N	t
\.


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 223
-- Name: adocao_adocao_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adocao_adocao_id_seq', 1, false);


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 221
-- Name: adotante_adotante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adotante_adotante_id_seq', 1, false);


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 219
-- Name: animal_animal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.animal_animal_id_seq', 1, false);


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 217
-- Name: membros_ong_membro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.membros_ong_membro_id_seq', 1, false);


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 225
-- Name: ong_ong_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ong_ong_id_seq', 3, true);


--
-- TOC entry 4682 (class 2606 OID 16585)
-- Name: adocao adocao_animal_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adocao
    ADD CONSTRAINT adocao_animal_unique UNIQUE (animal_id);


--
-- TOC entry 4684 (class 2606 OID 16421)
-- Name: adocao adocao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adocao
    ADD CONSTRAINT adocao_pkey PRIMARY KEY (adocao_id);


--
-- TOC entry 4676 (class 2606 OID 16577)
-- Name: adotante adotante_cpf_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adotante
    ADD CONSTRAINT adotante_cpf_unique UNIQUE (cpf);


--
-- TOC entry 4678 (class 2606 OID 16575)
-- Name: adotante adotante_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adotante
    ADD CONSTRAINT adotante_email_unique UNIQUE (email);


--
-- TOC entry 4680 (class 2606 OID 16414)
-- Name: adotante adotante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adotante
    ADD CONSTRAINT adotante_pkey PRIMARY KEY (adotante_id);


--
-- TOC entry 4674 (class 2606 OID 16405)
-- Name: animal animal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT animal_pkey PRIMARY KEY (animal_id);


--
-- TOC entry 4686 (class 2606 OID 16583)
-- Name: ong cnpj_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ong
    ADD CONSTRAINT cnpj_unique UNIQUE (cnpj);


--
-- TOC entry 4688 (class 2606 OID 16581)
-- Name: ong email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ong
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- TOC entry 4668 (class 2606 OID 16587)
-- Name: membros_ong membros_ong_cpf_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membros_ong
    ADD CONSTRAINT membros_ong_cpf_unique UNIQUE (cpf);


--
-- TOC entry 4670 (class 2606 OID 16589)
-- Name: membros_ong membros_ong_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membros_ong
    ADD CONSTRAINT membros_ong_email_unique UNIQUE (email);


--
-- TOC entry 4672 (class 2606 OID 16396)
-- Name: membros_ong membros_ong_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membros_ong
    ADD CONSTRAINT membros_ong_pkey PRIMARY KEY (membro_id);


--
-- TOC entry 4690 (class 2606 OID 16579)
-- Name: ong name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ong
    ADD CONSTRAINT name_unique UNIQUE (nome);


--
-- TOC entry 4692 (class 2606 OID 16440)
-- Name: ong ong_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ong
    ADD CONSTRAINT ong_pkey PRIMARY KEY (ong_id);


--
-- TOC entry 4693 (class 2606 OID 16422)
-- Name: adocao adocao_adotante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adocao
    ADD CONSTRAINT adocao_adotante_id_fkey FOREIGN KEY (adotante_id) REFERENCES public.adotante(adotante_id);


--
-- TOC entry 4694 (class 2606 OID 16427)
-- Name: adocao adocao_animal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adocao
    ADD CONSTRAINT adocao_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES public.animal(animal_id);


--
-- TOC entry 4695 (class 2606 OID 16441)
-- Name: ong ong_membro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ong
    ADD CONSTRAINT ong_membro_id_fkey FOREIGN KEY (membro_id) REFERENCES public.membros_ong(membro_id);


-- Completed on 2025-10-06 00:00:09

--
-- PostgreSQL database dump complete
--

\unrestrict N0DAPUpVTELxVwyEsKttK3E0nBw1mY1dTUDCcLfzbrBQGYix2AcnsaDMC5r0p0f

