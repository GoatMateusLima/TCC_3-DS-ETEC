create table public.ong (
  ong_id integer not null default nextval('ong_ong_id_seq'::regclass),
  nome character varying(250) not null,
  email character varying(250) not null,
  cnpj character varying(18) not null,
  rua character varying(250) not null,
  whatsapp character varying(20) not null,
  data_criacao date not null,
  cep character varying(9) not null,
  bairro character varying(150) not null,
  numero character varying(10) not null,
  membro_id integer null,
  status_registro boolean null default true,
  senha character varying(250) null,
  uf character varying null,
  constraint ong_pkey primary key (ong_id),
  constraint ong_cnpj_key unique (cnpj),
  constraint ong_email_key unique (email),
  constraint ong_nome_key unique (nome),
  constraint ong_membro_id_fkey foreign KEY (membro_id) references membros_ong (membro_id)
) TABLESPACE pg_default;


create table public.membros_ong (
  membro_id integer not null default nextval('membros_ong_membro_id_seq'::regclass),
  nome character varying(250) not null,
  cpf character varying(18) not null,
  email character varying(250) not null,
  whatsapp character varying(20) not null,
  data_entrada date not null,
  funcao character varying(100) not null,
  ong_id integer null,
  senha character varying(250) not null,
  constraint membros_ong_pkey primary key (membro_id),
  constraint membros_ong_cpf_key unique (cpf),
  constraint membros_ong_email_key unique (email),
  constraint membros_ong_ong_id_fkey foreign KEY (ong_id) references ong (ong_id)
) TABLESPACE pg_default;


create table public.animal (
  animal_id integer not null default nextval('animal_animal_id_seq'::regclass),
  nome character varying(100) not null,
  especie character varying(50) not null,
  raca character varying(100) not null,
  sexo character varying(10) not null,
  descricao character varying(300) null,
  data_entrada date null,
  data_saida date null,
  link_img text null,
  ong_id integer not null,
  status character varying(20) not null default 'disponivel'::character varying,
  idade smallint null,
  constraint animal_pkey primary key (animal_id),
  constraint animal_ong_id_fkey foreign KEY (ong_id) references ong (ong_id) on delete CASCADE
) TABLESPACE pg_default;


create table public.adocao (
  adocao_id integer not null default nextval('adocao_adocao_id_seq'::regclass),
  data_adocao date not null,
  status character varying(30) not null,
  adotante_id integer not null,
  animal_id integer not null,
  ong_id integer not null,
  constraint adocao_pkey primary key (adocao_id),
  constraint adocao_animal_id_key unique (animal_id),
  constraint adocao_adotante_id_fkey foreign KEY (adotante_id) references adotante (adotante_id),
  constraint adocao_animal_id_fkey foreign KEY (animal_id) references animal (animal_id),
  constraint fk_adocao_ong foreign KEY (ong_id) references ong (ong_id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;


create table public.adotante (
  adotante_id integer not null default nextval('adotante_adotante_id_seq'::regclass),
  nome character varying(250) not null,
  email character varying(250) not null,
  whatsapp character varying(20) not null,
  data_cadastro date not null,
  data_nascimento date null,
  cpf character varying(18) not null,
  senha character varying null,
  constraint adotante_pkey primary key (adotante_id),
  constraint adotante_cpf_key unique (cpf),
  constraint adotante_email_key unique (email),
  constraint unique_email_adotante unique (email)
) TABLESPACE pg_default;





E outro banco storage para imagens no mesmo projeto do supabase