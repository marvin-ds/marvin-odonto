import{z}from'zod';
const name=z.string().trim().min(2).max(150),email=z.string().trim().email().max(255),text=z.string().max(200).optional();
const member=z.object({nome:name,email,role:z.enum(['admin','dentista','recepcionista','auxiliar','financeiro'])});
const professional=z.object({nome:name,cro_numero:text,especialidade:z.string().max(100).optional()});
const procedure=z.object({nome:name,codigo_tuss:text,valor:z.coerce.number().min(0).max(1e6),duracao_minutos:z.coerce.number().int().min(10).max(480)});
const schema=z.object({nome:name,slug:z.string().regex(/^[a-z0-9-]{2,80}$/).optional(),cro_responsavel:text,telefone:text,cor_primaria:z.string().regex(/^#[0-9a-f]{6}$/i).optional(),endereco:z.record(z.string(),z.string().max(200)).optional(),membros:z.array(member).max(30).default([]),profissionais:z.array(professional).max(30).default([]),procedimentos:z.array(procedure).max(100).default([])});
const insert=(table:string,data:Record<string,any>)=>({sql:'INSERT INTO '+table+' ('+Object.keys(data).join(',')+') VALUES ('+Object.keys(data).map(()=>'?').join(',')+')',args:Object.values(data).map(v=>v!==null&&typeof v==='object'?JSON.stringify(v):v??null)});
export async function createClinic(ctx:any,input:any,master=false){
 if(!ctx.identity.userId)throw Error('Autenticação necessária');if(master&&!ctx.identity.master)throw Error('Apenas o administrador da plataforma pode cadastrar clínicas');
 if(!master&&ctx.identity.clinicaId)return{id:ctx.identity.clinicaId};
 const ownerEmail=master?email.parse(input.email_admin).toLowerCase():ctx.identity.email;
 const ownerName=master?name.parse(input.nome_admin):String(input.nome_admin||ctx.identity.email).slice(0,150);
 const d=schema.parse({...input,slug:input.slug||undefined,cor_primaria:input.cor_primaria||input.cor_principal,cro_responsavel:input.cro_responsavel||input.cro_clinica,membros:(input.membros||[]).filter((m:any)=>m.email),profissionais:(input.profissionais||[]).filter((p:any)=>p.nome),procedimentos:(input.procedimentos||[]).filter((p:any)=>p.nome)});
 const id=crypto.randomUUID(),slug=d.slug||d.nome.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)+'-'+id.slice(0,8);
 const plano=master?z.enum(['starter','pro','premium']).default('starter').parse(input.plano):'starter';const amount=master?z.coerce.number().min(0).max(99999).default(0).parse(input.valor_mensal):0;
 const ops=[insert('clinica',{id,nome:d.nome,slug,telefone:d.telefone,cor_primaria:d.cor_primaria||'#06B6D4',cro_responsavel:d.cro_responsavel,endereco:d.endereco||{},owner_email:ownerEmail,owner_nome:ownerName,plano,valor_mensal:amount,mrr:amount,status:'trial',status_cobranca:'ativo',trial_ate:new Date(Date.now()+14*86400000).toISOString().slice(0,10)}),insert('membro_equipe',{id:crypto.randomUUID(),clinica_id:id,nome:ownerName,email:ownerEmail,role:'owner',user_id:ownerEmail===ctx.identity.email?ctx.identity.userId:null})];
 for(const m of d.membros)ops.push(insert('membro_equipe',{...m,email:m.email.toLowerCase(),id:crypto.randomUUID(),clinica_id:id}));
 for(const p of d.profissionais)ops.push(insert('profissional',{...p,id:crypto.randomUUID(),clinica_id:id}));
 for(const p of d.procedimentos)ops.push(insert('procedimento',{...p,id:crypto.randomUUID(),clinica_id:id}));
 await ctx.sql.batch(ops,'write');return{id,slug,clinica:d.nome,email:ownerEmail,nome_admin:ownerName,telefone:d.telefone};
}
