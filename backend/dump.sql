create table "funcao" (
	id serial primary key,
  descricao varchar(50)
);

create table "gestor" (
	id serial primary key,
  descricao varchar(50)
);

create table "usuarios" (
	id serial primary key,
  nome varchar(255) not null,
  email varchar(255) unique not null,
  senha varchar(100) not null,
  telefone varchar(100) not null,
  matricula varchar(50) not null,
  id_funcao integer not null,
  id_gestor integer not null,
  ativo boolean not null,
  foreign key (id_funcao) references funcao (id),
  foreign key (id_gestor) references gestor (id)
);

create table "locais" (
	id serial primary key,
  descricao varchar(100)
);

create table "agendamentos" (
	id serial primary key,
  hora_inicio time not null,
  hora_fim time not null,
  data_agendamento date not null,
  dia_semana varchar(50),
  situacao varchar(50) not null,
  id_usuario integer not null,
  nome_usuario varchar(100) not null,
  nome_gestor varchar(100),
  id_gestor integer,
  id_local integer not null,
  foreign key (id_usuario) references usuarios (id),
  foreign key (id_local) references locais (id)
);

create table "reservas" (
  id serial primary key,
  nome_usuario varchar(100) not null,
  id_usuario integer not null,
  id_local integer not null,
  dia_semana varchar(50),
  hora_inicio time not null,
  hora_fim time not null,
  situacao varchar(50) not null,
  data_inicio date not null,
  data_fim date not null,
  foreign key (id_usuario) references usuarios (id),
  foreign key (id_local) references locais (id)
);

