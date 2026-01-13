--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

--
-- Name: Priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Priority" AS ENUM (
    'high',
    'medium',
    'low'
);


ALTER TYPE public."Priority" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: initiative_teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initiative_teams (
    id text NOT NULL,
    initiative_id text NOT NULL,
    team_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.initiative_teams OWNER TO postgres;

--
-- Name: initiatives; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.initiatives (
    id text NOT NULL,
    code character varying(10) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    perspective_id text NOT NULL,
    target_kpi character varying(100),
    estimated_effort character varying(50),
    priority public."Priority",
    display_order integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.initiatives OWNER TO postgres;

--
-- Name: perspectives; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perspectives (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    color_bg character varying(7) NOT NULL,
    color_bar character varying(7) NOT NULL,
    color_header character varying(7) NOT NULL,
    display_order integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.perspectives OWNER TO postgres;

--
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedules (
    id text NOT NULL,
    initiative_id text NOT NULL,
    year integer DEFAULT 2026 NOT NULL,
    start_month integer NOT NULL,
    end_month integer NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.schedules OWNER TO postgres;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    color character varying(7) NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
bac0d72f-0adb-4053-ac25-0a88bc9f3824	be242cb14edd1103d3d71448a57e08c77ca25b0997c2f32b24ac6f5d6d247a03	2026-01-05 13:55:48.507532+05	20260105085548_prisma_migrate1	\N	\N	2026-01-05 13:55:48.493173+05	1
2571bd2b-7b50-4e01-a2e9-2ccf6e08fc91	b993049ff311b0dedea8e0f6283f602b3bb704bef3ff28c5998f49d328f3e6ae	2026-01-08 11:41:20.246987+05	20260108064120_add_teams	\N	\N	2026-01-08 11:41:20.238115+05	1
a5d9dadf-604d-4d17-9e44-d012662a8282	f5754297855dd0738f7a11e329e49a03d0787f1ba1acf4e0e036efa5461499d2	2026-01-08 12:15:39.855756+05	20260108071539_add_many_to_many_teams	\N	\N	2026-01-08 12:15:39.847778+05	1
\.


--
-- Data for Name: initiative_teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.initiative_teams (id, initiative_id, team_id, created_at) FROM stdin;
2819d384-df8d-40c3-820a-5e43296751ef	5db4d4fd-f467-4727-984a-465ba62f4500	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:16:17.812
e30d9406-900a-4a4d-b933-15c575e8cf89	5db4d4fd-f467-4727-984a-465ba62f4500	e747813c-bb0e-4756-b344-10ca98003166	2026-01-08 07:16:22.832
0cf471f3-b674-48ed-807f-0004ee0bf46d	fe1e7110-98b3-49a4-a0f1-819b7d2ef8fa	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:16:50.525
30cfc284-258e-4c36-bd05-beebd1ffede5	6dcb72d0-77f8-40c0-b4c1-d4a52a6ef2b2	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:16:56.215
c7df06b0-1d09-4a23-acb3-737c27a00c83	6dcb72d0-77f8-40c0-b4c1-d4a52a6ef2b2	e747813c-bb0e-4756-b344-10ca98003166	2026-01-08 07:16:59.806
d231f837-ddfc-452b-9172-2e2c986ed960	10687927-3d5f-4da5-8241-3b77215aa785	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:17:04.463
a0c4ea47-da65-430e-8e2d-0cf2f53aa6f8	10687927-3d5f-4da5-8241-3b77215aa785	e747813c-bb0e-4756-b344-10ca98003166	2026-01-08 07:17:08.091
507a32ae-d738-4397-985b-c1ae8027b657	59a59fc9-5e2d-44b5-a174-14a57cd82942	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:17:18.209
2057ae2b-eb87-4099-9356-c7edd85f9b48	0a989e54-a292-42d8-888d-bfc809b8e2f8	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:17:34.202
45a9b28b-d597-48d1-ab5b-338441272cda	0a989e54-a292-42d8-888d-bfc809b8e2f8	e747813c-bb0e-4756-b344-10ca98003166	2026-01-08 07:17:34.202
7836f5c7-301a-47a8-93d7-d8663bd6aa70	59a59fc9-5e2d-44b5-a174-14a57cd82942	e747813c-bb0e-4756-b344-10ca98003166	2026-01-08 07:17:43.165
346e02bf-5377-48aa-b8b4-6e3adf551c78	28094eca-595d-4a19-98e4-8d427fd61c3d	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:17:52.928
a03dfed2-677d-435d-974a-c5664a67f3f0	4c29a241-8c9d-40c9-85fe-f3fb3bebb66d	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:18:12.864
f9c32aac-06d8-4727-8275-d3ce31d778f2	3975881d-2cc8-4d75-8407-debd6c709007	e747813c-bb0e-4756-b344-10ca98003166	2026-01-08 07:18:44.397
0f678784-e801-4d01-8b1c-8d3f41ee8114	3975881d-2cc8-4d75-8407-debd6c709007	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:18:44.397
09cbc146-3cb1-463d-be6b-dfe1b4c94e3f	e9361ea9-778b-4f31-88d1-73054b6d37db	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:18:51.505
49971a68-01f2-47cf-a5d4-0ee1ee3c61ca	1d49fc1b-e960-48a9-8ac2-43af999efd44	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:18:59.446
53249aee-beec-4f5c-9cd0-e8b2d8819629	a663da04-91ed-47c5-89c0-719bb2cc3055	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:19:05.642
826c7d88-d8d0-42b6-8eda-eec5a8f3afd9	bc540e78-b2af-4a7f-8434-e2549dfc9602	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:19:11.664
e385abaa-fe87-4537-8c13-efc360fad20b	bc540e78-b2af-4a7f-8434-e2549dfc9602	debfcfc7-0ccb-40b4-b1f1-f466bc5dce40	2026-01-08 07:19:20.931
21fa40af-a39d-4cfb-8e37-7336c5f757b5	a663da04-91ed-47c5-89c0-719bb2cc3055	debfcfc7-0ccb-40b4-b1f1-f466bc5dce40	2026-01-08 07:19:25.447
8936019d-ab36-4925-ae5f-5bfa28b49e44	b2680104-ea68-4222-b335-dedbf00fabfe	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:19:31.662
1fbb5e83-ddf5-4d72-933b-4f142e02a504	21e566b4-1d48-4bf6-afc6-ca8df36b9191	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:19:36.152
24c2ef5b-5780-467b-84f2-147ba0d7195d	c1a0a783-925c-48a3-ba3d-10d7f54c19a8	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:19:42.092
1d1df0e6-ca67-4b0f-a87e-a262d57963b1	943a53ae-d42d-4b73-a017-f55e5198de34	e747813c-bb0e-4756-b344-10ca98003166	2026-01-08 07:19:59.632
b42e719c-e0f4-4ab9-b5e4-6d238d33c394	3a50b0b8-dfef-42ee-b059-b7d24409c6d4	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:20:36.259
ddcf9aae-c99d-4bd4-936b-2ef7a8be2b98	e4e903d0-3e20-4a65-99d5-6bd1b92ad8a6	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:20:56.009
c96b7e0f-b812-4d1f-9ec0-2f3265cee1eb	e4e903d0-3e20-4a65-99d5-6bd1b92ad8a6	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 07:21:01.496
597e8aea-672a-4af9-9a34-212025e65ac0	1c6c2409-f6a4-4014-9dc5-376a405d6414	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:21:25.948
619017c9-8649-46c3-aab6-b87a3946f06e	ef1fa6bf-592d-4a72-91fa-4019693fbab5	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 07:21:41.125
fff90f16-393e-4a42-8251-9cb2e4de67e0	6b9df8d0-fbef-4fb3-b45c-626db50b5719	07794c83-87c8-413e-9b82-1dfb70f00083	2026-01-08 08:27:31.486
35a2241a-04cb-4376-b904-e61157870544	6b9df8d0-fbef-4fb3-b45c-626db50b5719	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 08:27:31.486
6f02d25c-6988-4cde-b3dd-c6b6888b6d5f	854c4863-0328-47f7-9bee-3661597199eb	07794c83-87c8-413e-9b82-1dfb70f00083	2026-01-08 08:27:52.095
4c339f7f-7dc2-4cec-af45-44b048023ba4	53c6d24a-4b1e-422a-8152-5618e0088534	4203e9b2-fab4-4c54-b625-aeda2736b342	2026-01-08 08:28:07.686
c30b26ff-9894-4118-acf9-5630dfdc9a6b	53c6d24a-4b1e-422a-8152-5618e0088534	a3a92e62-17f9-4a5b-8095-5fac706ea836	2026-01-08 08:28:07.686
083c203a-67af-46ed-b40c-90599ad01064	53c6d24a-4b1e-422a-8152-5618e0088534	e747813c-bb0e-4756-b344-10ca98003166	2026-01-08 08:28:07.686
50f6e57f-bc37-45ac-bbdd-aa1e4d1774f2	53c6d24a-4b1e-422a-8152-5618e0088534	debfcfc7-0ccb-40b4-b1f1-f466bc5dce40	2026-01-08 08:28:07.686
\.


--
-- Data for Name: initiatives; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.initiatives (id, code, name, description, perspective_id, target_kpi, estimated_effort, priority, display_order, created_at, updated_at) FROM stdin;
d0149c07-5e4d-4c84-b731-4465e0076868	I2	SLA monitoring and reporting tools	Implement tools for monitoring and reporting SLA performance	bd3d34d7-7df0-40ac-86df-934f86167feb	\N	\N	medium	19	2026-01-05 08:55:57.791	2026-01-05 08:55:57.791
4c910367-c804-437f-96c8-5d5e0c796176	I4	Corrective measures for SLA issues	Develop process for corrective measures when SLA issues occur	bd3d34d7-7df0-40ac-86df-934f86167feb	\N	\N	medium	21	2026-01-05 08:55:57.793	2026-01-05 08:55:57.793
4ccbe6d4-92cf-4e90-82e8-aacaa8135113	I5	ICT staff SLA management training	Train ICT staff on SLA management	bd3d34d7-7df0-40ac-86df-934f86167feb	\N	\N	medium	22	2026-01-05 08:55:57.794	2026-01-05 08:55:57.794
b654ba74-2916-431d-bfe1-2435519c799a	I6	Map IT processes and identify gaps	Map existing IT processes and identify gaps	bd3d34d7-7df0-40ac-86df-934f86167feb	\N	\N	medium	23	2026-01-05 08:55:57.795	2026-01-05 08:55:57.795
11c88650-8c32-407c-93fd-52e09f06b8dc	O2	Certification incentives program	Establish certification incentives program for staff	80afc56c-1234-4d92-8dab-2f2844f9b862	\N	\N	medium	26	2026-01-05 08:55:57.798	2026-01-05 08:55:57.798
4ae7a01c-baef-4764-9149-b70d3fa4b660	O4	Innovation lab/sandbox environment	Set up innovation lab and sandbox environment	80afc56c-1234-4d92-8dab-2f2844f9b862	\N	\N	medium	28	2026-01-05 08:55:57.8	2026-01-05 08:55:57.8
10687927-3d5f-4da5-8241-3b77215aa785	F4	Pilot testing open-source solutions	Test selected open-source solutions in controlled environment	0c2db78c-6944-4ef7-b10e-77ede5b381c0	\N	\N	medium	4	2026-01-05 08:55:57.773	2026-01-08 07:17:08.091
6dcb72d0-77f8-40c0-b4c1-d4a52a6ef2b2	F3	Open-source alternatives assessment	Evaluate open-source alternatives to proprietary software	0c2db78c-6944-4ef7-b10e-77ede5b381c0			medium	3	2026-01-05 08:55:57.771	2026-01-08 07:16:59.806
5db4d4fd-f467-4727-984a-465ba62f4500	F1	Conduct License usage audit	Conduct comprehensive audit of software license usage	0c2db78c-6944-4ef7-b10e-77ede5b381c0			medium	1	2026-01-05 08:55:57.767	2026-01-08 07:16:22.832
28094eca-595d-4a19-98e4-8d427fd61c3d	C1	Project/task management system	Implement project and task management system	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	\N	\N	medium	7	2026-01-05 08:55:57.777	2026-01-08 07:17:52.928
59a59fc9-5e2d-44b5-a174-14a57cd82942	F5	Migration roadmap development	Develop roadmap for migrating to open-source solutions	0c2db78c-6944-4ef7-b10e-77ede5b381c0			medium	5	2026-01-05 08:55:57.774	2026-01-08 07:17:43.165
0a989e54-a292-42d8-888d-bfc809b8e2f8	F6	Staff training on open-source tools	Train staff on using open-source tools	0c2db78c-6944-4ef7-b10e-77ede5b381c0			medium	6	2026-01-05 08:55:57.775	2026-01-08 07:17:34.202
1c3b19c7-6cf9-4a64-9183-c0f879ac727c	O1	Technical workshops/knowledge sharing	Organize technical workshops and knowledge sharing sessions	80afc56c-1234-4d92-8dab-2f2844f9b862	\N	\N	medium	25	2026-01-05 08:55:57.797	2026-01-08 06:56:33.73
4c29a241-8c9d-40c9-85fe-f3fb3bebb66d	C6	Digitalize board paper submission (CS)	Digitalize board paper submission process for Customer Service	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	\N	\N	medium	12	2026-01-05 08:55:57.783	2026-01-08 07:18:12.864
ef1fa6bf-592d-4a72-91fa-4019693fbab5	C10	AI chatbots for support	Implement AI-powered chatbots for customer support	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3			medium	16	2026-01-05 08:55:57.788	2026-01-08 07:21:41.125
21e566b4-1d48-4bf6-afc6-ca8df36b9191	C5	Digitize historical records (CS)	Digitize historical records for Customer Service	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	\N	\N	medium	11	2026-01-05 08:55:57.782	2026-01-08 07:19:36.152
1d49fc1b-e960-48a9-8ac2-43af999efd44	I8	Matrix Upgrade		bd3d34d7-7df0-40ac-86df-934f86167feb			medium	0	2026-01-08 05:29:26.667	2026-01-08 07:18:59.446
c1a0a783-925c-48a3-ba3d-10d7f54c19a8	C9	Helpdesk KPIs and metrics	Define and track helpdesk KPIs and metrics	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	\N	\N	medium	15	2026-01-05 08:55:57.787	2026-01-08 07:19:42.092
6b9df8d0-fbef-4fb3-b45c-626db50b5719	I3	Regular SLA performance reviews	Establish regular review process for SLA performance	bd3d34d7-7df0-40ac-86df-934f86167feb			medium	20	2026-01-05 08:55:57.792	2026-01-08 08:27:31.486
943a53ae-d42d-4b73-a017-f55e5198de34	C11	Cybersecurity awareness training	Provide cybersecurity awareness training to customers	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3			medium	17	2026-01-05 08:55:57.789	2026-01-08 07:19:59.632
1c6c2409-f6a4-4014-9dc5-376a405d6414	C2	Extend CMMS functionality	Extend Computerized Maintenance Management System features	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3			medium	8	2026-01-05 08:55:57.779	2026-01-08 07:21:25.948
fe1e7110-98b3-49a4-a0f1-819b7d2ef8fa	F2	Real-time license monitoring system	Implement system to monitor license usage in real-time	0c2db78c-6944-4ef7-b10e-77ede5b381c0			medium	2	2026-01-05 08:55:57.77	2026-01-08 07:16:50.525
e9361ea9-778b-4f31-88d1-73054b6d37db	C4	Boatyard Management System (ERD)	Develop Entity Relationship Diagram for Boatyard Management System	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	\N	\N	medium	10	2026-01-05 08:55:57.781	2026-01-08 07:18:51.505
b2680104-ea68-4222-b335-dedbf00fabfe	C3	Extend PMS functionality	Extend Property Management System features	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	\N	\N	medium	9	2026-01-05 08:55:57.78	2026-01-08 07:19:31.662
a663da04-91ed-47c5-89c0-719bb2cc3055	C7	Implement Retail module (TD)	Implement Retail module for Trade Division	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	\N	\N	medium	13	2026-01-05 08:55:57.784	2026-01-08 07:19:25.447
bc540e78-b2af-4a7f-8434-e2549dfc9602	C8	Implement CRM module (TD)	Implement Customer Relationship Management module for Trade Division	a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	\N	\N	medium	14	2026-01-05 08:55:57.786	2026-01-08 07:19:20.931
3a50b0b8-dfef-42ee-b059-b7d24409c6d4	I1	Define SLAs for critical services	Define Service Level Agreements for critical ICT services	bd3d34d7-7df0-40ac-86df-934f86167feb	\N	\N	medium	18	2026-01-05 08:55:57.79	2026-01-08 07:20:36.259
e4e903d0-3e20-4a65-99d5-6bd1b92ad8a6	O3	Pilot emerging technologies	Pilot emerging technologies to evaluate potential	80afc56c-1234-4d92-8dab-2f2844f9b862	\N	\N	medium	27	2026-01-05 08:55:57.799	2026-01-08 07:21:01.496
3975881d-2cc8-4d75-8407-debd6c709007	I7	Standardized workflows documentation	Document standardized workflows	bd3d34d7-7df0-40ac-86df-934f86167feb			medium	24	2026-01-05 08:55:57.796	2026-01-08 07:21:17.602
854c4863-0328-47f7-9bee-3661597199eb	O6	Reward technology adoption success	Establish rewards for successful technology adoption	80afc56c-1234-4d92-8dab-2f2844f9b862			medium	30	2026-01-05 08:55:57.801	2026-01-08 08:27:52.095
53c6d24a-4b1e-422a-8152-5618e0088534	O5	Innovation brainstorming sessions	Conduct innovation brainstorming sessions	80afc56c-1234-4d92-8dab-2f2844f9b862			medium	29	2026-01-05 08:55:57.801	2026-01-08 08:28:07.686
\.


--
-- Data for Name: perspectives; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.perspectives (id, name, color_bg, color_bar, color_header, display_order, created_at, updated_at) FROM stdin;
0c2db78c-6944-4ef7-b10e-77ede5b381c0	Financial	#dbeafe	#3b82f6	#1e40af	1	2026-01-05 08:55:57.757	2026-01-05 08:55:57.757
a7d2fbf2-3738-49f7-a1f4-7bed2a684bc3	Customer	#dcfce7	#22c55e	#166534	2	2026-01-05 08:55:57.763	2026-01-05 08:55:57.763
bd3d34d7-7df0-40ac-86df-934f86167feb	Internal Process	#fef3c7	#f59e0b	#b45309	3	2026-01-05 08:55:57.764	2026-01-05 08:55:57.764
80afc56c-1234-4d92-8dab-2f2844f9b862	Organization	#f3e8ff	#a855f7	#7c3aed	4	2026-01-05 08:55:57.766	2026-01-05 08:55:57.766
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, initiative_id, year, start_month, end_month, notes, created_at, updated_at) FROM stdin;
be67afbf-ac4f-4e56-ae8b-02d45681b0f0	4ccbe6d4-92cf-4e90-82e8-aacaa8135113	2026	2	4	\N	2026-01-05 09:47:50.803	2026-01-08 05:41:26.06
1f088c94-7026-47d0-bc61-86c95b9be0e9	11c88650-8c32-407c-93fd-52e09f06b8dc	2026	5	6	\N	2026-01-05 09:46:41.5	2026-01-08 05:47:27.1
af26612f-6d5f-41b0-998a-8e31a0139336	3a50b0b8-dfef-42ee-b059-b7d24409c6d4	2026	0	4	\N	2026-01-05 09:35:01.624	2026-01-05 09:42:25.377
ea3cbdb7-9e20-4ee9-b6f7-0afae55aac7f	1d49fc1b-e960-48a9-8ac2-43af999efd44	2026	0	2	\N	2026-01-08 06:02:13.752	2026-01-08 06:02:25.133
8a5a5ed0-aec3-4b56-a232-e6e40f7ca067	10687927-3d5f-4da5-8241-3b77215aa785	2026	0	1	\N	2026-01-05 09:22:25.302	2026-01-08 06:04:14.187
9a91237b-5112-40d4-96e7-d691baa10247	1c3b19c7-6cf9-4a64-9183-c0f879ac727c	2026	5	6	\N	2026-01-05 09:35:02.843	2026-01-05 09:46:48.443
000c58ea-3f26-470f-ad05-dfa63e6a906a	e4e903d0-3e20-4a65-99d5-6bd1b92ad8a6	2026	5	8	\N	2026-01-05 09:46:59.405	2026-01-05 09:47:00.667
340ad6b8-f238-47e6-a48a-50f6636b1015	0a989e54-a292-42d8-888d-bfc809b8e2f8	2026	2	4	\N	2026-01-05 09:26:46.984	2026-01-08 06:04:26.524
30b7ddb4-a488-47d9-b73d-2aaf691ab3cb	59a59fc9-5e2d-44b5-a174-14a57cd82942	2026	1	3	\N	2026-01-05 09:22:15.36	2026-01-08 06:04:31.399
c9b022a0-d535-406d-95d9-ca61320dc731	4ae7a01c-baef-4764-9149-b70d3fa4b660	2026	8	10	\N	2026-01-05 09:47:04.552	2026-01-05 09:47:04.552
b6870cd0-2cce-4a23-86da-ba263cf8e258	53c6d24a-4b1e-422a-8152-5618e0088534	2026	5	10	\N	2026-01-05 09:47:09.883	2026-01-05 09:47:09.883
baabf308-2600-4c13-b08f-c61be7af52b1	854c4863-0328-47f7-9bee-3661597199eb	2026	11	11	\N	2026-01-05 09:47:14.556	2026-01-05 09:47:16.239
2ad47652-8add-4791-b931-dd9bc3e70442	6dcb72d0-77f8-40c0-b4c1-d4a52a6ef2b2	2026	0	1	\N	2026-01-05 09:22:16.693	2026-01-05 09:40:12.438
ffb19659-d508-414a-8139-b2074f75538a	b654ba74-2916-431d-bfe1-2435519c799a	2026	5	7	\N	2026-01-05 09:47:32.936	2026-01-05 09:47:32.936
09c8ca3c-0a8a-41c3-8c75-9fa776ad351a	28094eca-595d-4a19-98e4-8d427fd61c3d	2026	0	2	\N	2026-01-05 09:40:24.567	2026-01-05 09:40:28.057
d935a69d-985f-4c50-9255-68e6c6e493db	1c6c2409-f6a4-4014-9dc5-376a405d6414	2026	1	5	\N	2026-01-05 09:40:35.964	2026-01-08 07:01:14.542
2f1d525f-4833-49c9-ade8-d801c0943a28	3975881d-2cc8-4d75-8407-debd6c709007	2026	8	10	\N	2026-01-05 09:47:39.805	2026-01-05 09:47:43.328
affe6e42-fe0b-4939-980b-f82be00d35d3	b2680104-ea68-4222-b335-dedbf00fabfe	2026	0	8	\N	2026-01-05 09:34:56.942	2026-01-05 09:41:13.492
3a6b392b-f02a-4417-a5f6-6d85b3a111e6	21e566b4-1d48-4bf6-afc6-ca8df36b9191	2026	0	2	\N	2026-01-05 09:41:22.138	2026-01-05 09:41:22.138
3b4cd8c1-4142-40e2-87f3-3ea598d584ea	4c910367-c804-437f-96c8-5d5e0c796176	2026	4	6	\N	2026-01-05 09:47:57.416	2026-01-05 09:48:16.282
95f40028-dda0-4fe6-977e-69a0a1c87a0f	4c29a241-8c9d-40c9-85fe-f3fb3bebb66d	2026	1	3	\N	2026-01-05 09:34:59.282	2026-01-05 09:41:36.298
41cfeb2c-9842-44b9-b80c-68fd0c5d6fae	a663da04-91ed-47c5-89c0-719bb2cc3055	2026	1	5	\N	2026-01-05 09:41:41.667	2026-01-05 09:41:44.177
d255e1ee-83aa-43f7-9f62-889a1026d42d	bc540e78-b2af-4a7f-8434-e2549dfc9602	2026	1	5	\N	2026-01-05 09:41:50.517	2026-01-05 09:41:51.045
af195e28-1055-450c-ae2b-76437bd8449c	c1a0a783-925c-48a3-ba3d-10d7f54c19a8	2026	2	2	\N	2026-01-05 09:41:59.427	2026-01-05 09:42:07.612
95310b1a-50ba-4834-8cdf-33e55fdf54b6	ef1fa6bf-592d-4a72-91fa-4019693fbab5	2026	2	2	\N	2026-01-05 09:42:05.801	2026-01-05 09:42:09.081
7887a585-7d41-4cde-ba5e-76f247ad7c8b	943a53ae-d42d-4b73-a017-f55e5198de34	2026	1	1	\N	2026-01-05 09:42:13.045	2026-01-05 09:42:13.045
80b5606b-7bf9-4ff4-b7b2-897afedf5da1	d0149c07-5e4d-4c84-b731-4465e0076868	2026	7	8	\N	2026-01-05 09:48:29.011	2026-01-05 09:48:40.73
03591287-5ede-4b1d-bd4f-3d545f305f24	6b9df8d0-fbef-4fb3-b45c-626db50b5719	2026	9	11	\N	2026-01-05 09:48:20.814	2026-01-05 09:48:42.714
cfad3e44-cfaa-484b-8831-b278bb0c8b6c	5db4d4fd-f467-4727-984a-465ba62f4500	2026	0	2	\N	2026-01-05 09:22:18.66	2026-01-08 05:34:21.69
d8618408-4cca-4c25-af77-ef6d7fec1199	fe1e7110-98b3-49a4-a0f1-819b7d2ef8fa	2026	0	2	\N	2026-01-05 09:22:17.688	2026-01-08 05:37:24.362
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, color, created_at, updated_at) FROM stdin;
a3a92e62-17f9-4a5b-8095-5fac706ea836	Software	#3B82F6	2026-01-08 06:42:44.255	2026-01-08 06:42:44.255
e747813c-bb0e-4756-b344-10ca98003166	Infra	#0c2e64	2026-01-08 06:43:00.353	2026-01-08 06:43:00.353
4203e9b2-fab4-4c54-b625-aeda2736b342	IT Ops	#f51000	2026-01-08 06:43:25.127	2026-01-08 06:43:25.127
07794c83-87c8-413e-9b82-1dfb70f00083	Admin	#1cf80d	2026-01-08 06:43:38.562	2026-01-08 06:43:38.562
debfcfc7-0ccb-40b4-b1f1-f466bc5dce40	ERP	#f73bde	2026-01-08 06:43:55.85	2026-01-08 06:43:55.85
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: initiative_teams initiative_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_teams
    ADD CONSTRAINT initiative_teams_pkey PRIMARY KEY (id);


--
-- Name: initiatives initiatives_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_pkey PRIMARY KEY (id);


--
-- Name: perspectives perspectives_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perspectives
    ADD CONSTRAINT perspectives_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: initiative_teams_initiative_id_team_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX initiative_teams_initiative_id_team_id_key ON public.initiative_teams USING btree (initiative_id, team_id);


--
-- Name: initiatives_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX initiatives_code_key ON public.initiatives USING btree (code);


--
-- Name: perspectives_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX perspectives_name_key ON public.perspectives USING btree (name);


--
-- Name: schedules_initiative_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schedules_initiative_id_key ON public.schedules USING btree (initiative_id);


--
-- Name: teams_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX teams_name_key ON public.teams USING btree (name);


--
-- Name: initiative_teams initiative_teams_initiative_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_teams
    ADD CONSTRAINT initiative_teams_initiative_id_fkey FOREIGN KEY (initiative_id) REFERENCES public.initiatives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: initiative_teams initiative_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiative_teams
    ADD CONSTRAINT initiative_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: initiatives initiatives_perspective_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_perspective_id_fkey FOREIGN KEY (perspective_id) REFERENCES public.perspectives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedules schedules_initiative_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_initiative_id_fkey FOREIGN KEY (initiative_id) REFERENCES public.initiatives(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

