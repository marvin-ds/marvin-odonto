CREATE TABLE IF NOT EXISTS "app_config" (
 "app_name" TEXT DEFAULT 'OdontoControl AI',
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "super_admin_emails" TEXT DEFAULT '[]',
 "system_settings" TEXT DEFAULT '{}',
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "clinica" (
 "cnpj" TEXT,
 "cor_primaria" TEXT,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "cro_responsavel" TEXT,
 "email" TEXT,
 "endereco" TEXT DEFAULT '{}',
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "logo_url" TEXT,
 "mrr" REAL NOT NULL DEFAULT 0 CHECK("mrr" IS NULL OR "mrr">=0),
 "nome" TEXT NOT NULL,
 "owner_email" TEXT,
 "owner_nome" TEXT,
 "owner_telefone" TEXT,
 "plano" TEXT NOT NULL DEFAULT 'starter',
 "slug" TEXT UNIQUE,
 "status" TEXT NOT NULL DEFAULT 'trial',
 "status_cobranca" TEXT NOT NULL DEFAULT 'ativo',
 "telefone" TEXT,
 "trial_ate" TEXT,
 "ultimo_acesso" TEXT,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "valor_mensal" REAL NOT NULL DEFAULT 0 CHECK("valor_mensal" IS NULL OR "valor_mensal">=0)
);
CREATE TABLE IF NOT EXISTS "consulta" (
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "data" TEXT NOT NULL,
 "duracao_minutos" REAL NOT NULL DEFAULT '60' CHECK("duracao_minutos">0),
 "hora" TEXT NOT NULL,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "observacoes" TEXT,
 "paciente_id" TEXT NOT NULL REFERENCES paciente(id),
 "paciente_nome" TEXT,
 "procedimentos" TEXT DEFAULT '[]',
 "profissional_id" TEXT NOT NULL REFERENCES profissional(id),
 "profissional_nome" TEXT,
 "prontuario" TEXT,
 "status" TEXT NOT NULL DEFAULT 'agendada',
 "tipo" TEXT NOT NULL DEFAULT 'consulta',
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "valor_total" REAL DEFAULT 0 CHECK("valor_total" IS NULL OR "valor_total">=0)
);
CREATE INDEX IF NOT EXISTS idx_consulta_clinica_id ON consulta(clinica_id);
CREATE INDEX IF NOT EXISTS idx_consulta_paciente_id ON consulta(paciente_id);
CREATE INDEX IF NOT EXISTS idx_consulta_data ON consulta(data);
CREATE TABLE IF NOT EXISTS "financeiro" (
 "categoria" TEXT,
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "consulta_id" TEXT REFERENCES consulta(id),
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "data" TEXT NOT NULL,
 "descricao" TEXT NOT NULL,
 "forma_pagamento" TEXT,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "orcamento_id" TEXT REFERENCES orcamento(id),
 "paciente_id" TEXT REFERENCES paciente(id),
 "parcela_atual" REAL NOT NULL DEFAULT '1' CHECK("parcela_atual">0),
 "status" TEXT NOT NULL DEFAULT 'pendente',
 "tipo" TEXT NOT NULL DEFAULT 'receita',
 "total_parcelas" REAL NOT NULL DEFAULT '1' CHECK("total_parcelas">0),
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "valor" REAL NOT NULL CHECK("valor" IS NULL OR "valor">=0),
 "vencimento" TEXT
);
CREATE INDEX IF NOT EXISTS idx_financeiro_clinica_id ON financeiro(clinica_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_paciente_id ON financeiro(paciente_id);
CREATE INDEX IF NOT EXISTS idx_financeiro_data ON financeiro(data);
CREATE TABLE IF NOT EXISTS "historico_clinica" (
 "anexos" TEXT DEFAULT '[]',
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "data" TEXT NOT NULL,
 "descricao" TEXT NOT NULL,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "paciente_id" TEXT NOT NULL REFERENCES paciente(id),
 "profissional_id" TEXT REFERENCES profissional(id),
 "profissional_nome" TEXT,
 "tipo" TEXT NOT NULL DEFAULT 'observacao',
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_historico_clinica_clinica_id ON historico_clinica(clinica_id);
CREATE INDEX IF NOT EXISTS idx_historico_clinica_paciente_id ON historico_clinica(paciente_id);
CREATE INDEX IF NOT EXISTS idx_historico_clinica_data ON historico_clinica(data);
CREATE TABLE IF NOT EXISTS "membro_equipe" (
 "ativo" BOOLEAN NOT NULL DEFAULT 1,
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "email" TEXT NOT NULL,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "must_change_password" BOOLEAN NOT NULL DEFAULT '0',
 "nome" TEXT NOT NULL,
 "role" TEXT NOT NULL DEFAULT 'recepcionista',
 "ultimo_login" TEXT,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "user_id" TEXT
);
CREATE INDEX IF NOT EXISTS idx_membro_equipe_clinica_id ON membro_equipe(clinica_id);
CREATE INDEX IF NOT EXISTS idx_membro_equipe_user_id ON membro_equipe(user_id);
CREATE TABLE IF NOT EXISTS "orcamento" (
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "data" TEXT NOT NULL,
 "desconto_pct" REAL NOT NULL DEFAULT 0 CHECK("desconto_pct" BETWEEN 0 AND 100),
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "itens" TEXT DEFAULT '[]',
 "numero" TEXT,
 "observacoes" TEXT,
 "paciente_id" TEXT NOT NULL REFERENCES paciente(id),
 "paciente_nome" TEXT,
 "parcelas" REAL NOT NULL DEFAULT '1' CHECK("parcelas">0),
 "profissional_id" TEXT REFERENCES profissional(id),
 "status" TEXT NOT NULL DEFAULT 'pendente',
 "total" REAL DEFAULT 0 CHECK("total" IS NULL OR "total">=0),
 "total_com_desconto" REAL DEFAULT 0 CHECK("total_com_desconto" IS NULL OR "total_com_desconto">=0),
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "validade" TEXT
);
CREATE INDEX IF NOT EXISTS idx_orcamento_clinica_id ON orcamento(clinica_id);
CREATE INDEX IF NOT EXISTS idx_orcamento_paciente_id ON orcamento(paciente_id);
CREATE INDEX IF NOT EXISTS idx_orcamento_data ON orcamento(data);
CREATE TABLE IF NOT EXISTS "paciente" (
 "alergias" TEXT DEFAULT '[]',
 "ativo" BOOLEAN NOT NULL DEFAULT 1,
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "convenio" TEXT,
 "cpf" TEXT,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "data_nascimento" TEXT,
 "doencas_preexistentes" TEXT,
 "email" TEXT,
 "endereco" TEXT DEFAULT '{}',
 "foto_url" TEXT,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "medicamentos_uso" TEXT DEFAULT '[]',
 "nome" TEXT NOT NULL,
 "numero_convenio" TEXT,
 "observacoes_anamnese" TEXT,
 "profissao" TEXT,
 "rg" TEXT,
 "telefone" TEXT,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_paciente_clinica_id ON paciente(clinica_id);
CREATE TABLE IF NOT EXISTS "procedimento" (
 "ativo" BOOLEAN NOT NULL DEFAULT 1,
 "categoria" TEXT,
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "codigo_tuss" TEXT,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "descricao" TEXT,
 "duracao_minutos" REAL NOT NULL DEFAULT '60' CHECK("duracao_minutos">0),
 "especialidade" TEXT,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "nome" TEXT NOT NULL,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "valor" REAL NOT NULL CHECK("valor" IS NULL OR "valor">=0)
);
CREATE INDEX IF NOT EXISTS idx_procedimento_clinica_id ON procedimento(clinica_id);
CREATE TABLE IF NOT EXISTS "profissional" (
 "ativo" BOOLEAN NOT NULL DEFAULT 1,
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "cro_numero" TEXT,
 "cro_uf" TEXT,
 "email" TEXT,
 "especialidade" TEXT,
 "foto_url" TEXT,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "nome" TEXT NOT NULL,
 "percentual_repasse" REAL NOT NULL DEFAULT 0 CHECK("percentual_repasse" BETWEEN 0 AND 100),
 "telefone" TEXT,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_profissional_clinica_id ON profissional(clinica_id);
CREATE TABLE IF NOT EXISTS "tratamento" (
 "clinica_id" TEXT NOT NULL REFERENCES clinica(id),
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "data_conclusao" TEXT,
 "data_inicio" TEXT,
 "dente" TEXT,
 "descricao" TEXT NOT NULL,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "observacoes" TEXT,
 "paciente_id" TEXT NOT NULL REFERENCES paciente(id),
 "paciente_nome" TEXT,
 "profissional_id" TEXT REFERENCES profissional(id),
 "profissional_nome" TEXT,
 "status" TEXT NOT NULL DEFAULT 'planejado',
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "valor_total" REAL DEFAULT 0 CHECK("valor_total" IS NULL OR "valor_total">=0)
);
CREATE INDEX IF NOT EXISTS idx_tratamento_clinica_id ON tratamento(clinica_id);
CREATE INDEX IF NOT EXISTS idx_tratamento_paciente_id ON tratamento(paciente_id);
CREATE TABLE IF NOT EXISTS profiles(user_id TEXT PRIMARY KEY,email TEXT);
CREATE TABLE IF NOT EXISTS user_roles(id TEXT PRIMARY KEY,user_id TEXT NOT NULL,role TEXT NOT NULL,UNIQUE(user_id,role));
CREATE TABLE IF NOT EXISTS template_owner(id TEXT PRIMARY KEY,user_id TEXT NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS membro_email_clinica ON membro_equipe(clinica_id,lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS financeiro_orcamento ON financeiro(orcamento_id) WHERE orcamento_id IS NOT NULL;
