import { Query,type QuerySpec } from '../../shared/query'
import {schema,jsonFields} from './schema'
export type Identity={userId:string;email?:string;master:boolean;clinicaId?:string;role?:string}
export type SQL={sql:(q:string,args?:any[])=>Promise<{rows:any[]}>;batch:(s:{sql:string,args?:any[]}[],mode?:'read'|'write')=>Promise<any>}
const q=(s:string)=>'"'+s+'"';const val=(v:any)=>typeof v==='boolean'?Number(v):v!==null&&typeof v==='object'?JSON.stringify(v):v??null
const roles=['owner','admin','dentista','recepcionista','auxiliar','financeiro']
const writeRoles:Record<string,string[]>= {clinica:['owner','admin'],membro_equipe:['owner'],profissional:['owner','admin'],procedimento:['owner','admin'],paciente:['owner','admin','dentista','recepcionista','auxiliar'],consulta:['owner','admin','dentista','recepcionista'],historico_clinica:['owner','admin','dentista'],tratamento:['owner','admin','dentista'],orcamento:['owner','admin','dentista','recepcionista'],financeiro:['owner','admin','financeiro']}
export function decode(table:string,row:any){return Object.fromEntries(Object.entries(row).map(([k,v])=>{if(schema[table]?.[k]==='BOOLEAN')return[k,v===true||v===1||v==='1'];if(schema[table]?.[k]==='REAL'&&v!==null)return[k,Number(v)];if(jsonFields.has(k)&&typeof v==='string'){try{return[k,JSON.parse(v)]}catch{}}return[k,v]}))}
export function budgetTotals(items:any,discount:any){
 if(!Array.isArray(items)||!items.length||items.length>100)throw Error('Adicione de 1 a 100 itens ao orçamento')
 const pct=Number(discount??0);if(!Number.isFinite(pct)||pct<0||pct>100)throw Error('Desconto inválido')
 let cents=0;const clean=items.map(it=>{const price=Number(it.valor),qty=Number(it.qtd);if(typeof it.nome!=='string'||!it.nome.trim()||it.nome.length>200||!Number.isFinite(price)||price<0||price>1e6||!Number.isInteger(qty)||qty<1||qty>1000)throw Error('Item inválido');cents+=Math.round(price*100)*qty;return{nome:it.nome.trim(),valor:Math.round(price*100)/100,qtd:qty}})
 if(cents>1e10)throw Error('Valor do orçamento excede o limite');return{itens:clean,desconto_pct:pct,total:cents/100,total_com_desconto:Math.round(cents*(1-pct/100))/100}
}
export class Database{
 constructor(public sql:SQL,public identity:Identity){}
 from(table:string){return new Query(table,s=>this.execute(s))}
 async scope(table:string,write:boolean){
  const u=this.identity;if(!schema[table]||['profiles','user_roles','template_owner'].includes(table))throw Error('Tabela indisponível')
  if(!u.userId)throw Error('Autenticação necessária')
  if(table==='app_config'){if(!u.master)throw Error('Acesso restrito');return{clause:'1=1',args:[]}}
  if(u.master)return{clause:'1=1',args:[]}
  if(!u.clinicaId){if(table==='membro_equipe'&&!write)return{clause:'user_id=?',args:[u.userId]};throw Error('Clínica não encontrada')}
  const c=(await this.sql.sql('SELECT status,status_cobranca,trial_ate FROM clinica WHERE id=?',[u.clinicaId])).rows[0]
  if(table!=='clinica'&&table!=='membro_equipe'&&(!c||c.status==='bloqueado'||c.status_cobranca==='suspenso'||c.status==='trial'&&c.trial_ate&&c.trial_ate<new Date().toISOString().slice(0,10)))throw Error('Acesso à clínica suspenso; contate o administrador')
  if(write&&!writeRoles[table]?.includes(u.role||''))throw Error('Permissão insuficiente')
  return{clause:(table==='clinica'?'id':'clinica_id')+'=?',args:[u.clinicaId]}
 }
 async execute(input:QuerySpec):Promise<any>{try{
  const s=structuredClone(input),t=s.table,write=s.action!=='select';if(!['select','insert','update','delete'].includes(s.action))throw Error('Operação inválida')
  const col=(k:string)=>{if(!schema[t]?.[k])throw Error('Coluna inválida: '+k);return q(k)}
  const scope=await this.scope(t,write),args:any[]=[...scope.args],where=[scope.clause];
  if(!Array.isArray(s.filters)||s.filters.length>30)throw Error('Filtros inválidos')
  for(const f of s.filters){const k=col(f.key);if(f.op==='in'){if(!Array.isArray(f.value)||f.value.length>1000)throw Error('Filtro inválido');where.push(f.value.length?k+' IN ('+f.value.map(()=>'?').join(',')+')':'0=1');args.push(...f.value.map(val));continue}if(f.op==='notnull'){where.push(k+' IS NOT NULL');continue}const op:Record<string,string>={eq:'=',neq:'!=',gt:'>',gte:'>=',lt:'<',lte:'<=',is:'IS',ilike:'LIKE'};if(!op[f.op])throw Error('Operador inválido');where.push(k+' '+op[f.op]+' ?');args.push(val(f.value))}
  const clause=where.join(' AND ');const limit=Math.min(5000,Math.max(0,Number(s.limit??1000))),offset=Math.max(0,Number(s.offset??0));if(!Number.isInteger(limit)||!Number.isInteger(offset))throw Error('Paginação inválida')
  const selected=s.columns==='*'||!s.columns?null:s.columns.split(',').map(x=>x.trim());selected?.forEach(col)
  let rows:any[]=[],count=0
  if(!write){count=Number((await this.sql.sql('SELECT COUNT(*) AS total FROM '+q(t)+' WHERE '+clause,args)).rows[0]?.total||0);if(!s.head)rows=(await this.sql.sql('SELECT * FROM '+q(t)+' WHERE '+clause+(s.orders?.length?' ORDER BY '+s.orders.map(o=>col(o.key)+(o.ascending?' ASC':' DESC')).join(','):'')+' LIMIT ? OFFSET ?',[...args,limit,offset])).rows}
  else{
   if(s.action!=='insert'&&!s.filters.length)throw Error('Alteração exige filtro explícito')
   if(t==='app_config'&&s.action!=='update')throw Error('Configuração protegida')
   if(t==='clinica'&&s.action==='insert')throw Error('Use o cadastro de clínica')
   if(s.action==='delete'){
    if(t==='membro_equipe'&&(await this.sql.sql('SELECT 1 FROM membro_equipe WHERE '+clause+" AND role='owner'",args)).rows.length)throw Error('Não é permitido excluir o proprietário')
    rows=(await this.sql.sql('DELETE FROM '+q(t)+' WHERE '+clause+' RETURNING *',args)).rows
   }else{
    const payloads=Array.isArray(s.payload)?s.payload:[s.payload];if(payloads.length!==1)throw Error('Salve um registro por vez')
    const raw=payloads[0];if(!raw||typeof raw!=='object')throw Error('Dados inválidos');const row={...raw};Object.keys(row).forEach(col)
    if(s.action==='update'){delete row.id;delete row.created_at;delete row.clinica_id;row.updated_at=new Date().toISOString()}
    if(!this.identity.master){
     if(t==='clinica'&&Object.keys(row).some(k=>!['nome','slug','cnpj','cro_responsavel','telefone','email','endereco','cor_primaria','logo_url','updated_at'].includes(k)))throw Error('Campo da clínica protegido')
     if(t!=='clinica'&&s.action==='insert'){if(row.clinica_id&&row.clinica_id!==this.identity.clinicaId)throw Error('Clínica inválida');row.clinica_id=this.identity.clinicaId}
    }
    if(t==='app_config'&&('super_admin_emails'in row))throw Error('O administrador é definido no backend desta cópia')
    if(t==='membro_equipe'){
     if('user_id'in row||'must_change_password'in row)throw Error('Acesso deve ser confirmado pelo titular do email')
     if(row.role&&(!roles.includes(row.role)||row.role==='owner'))throw Error('Perfil inválido')
     if(s.action==='update'&&(await this.sql.sql('SELECT 1 FROM membro_equipe WHERE '+clause+" AND role='owner'",args)).rows.length)throw Error('Cadastro do proprietário protegido')
     if(row.email){row.email=String(row.email).trim().toLowerCase();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email))throw Error('Email inválido');if(s.action==='update')row.user_id=null}
    }
    if(t==='orcamento'){
     const old=s.action==='update'?(await this.sql.sql('SELECT * FROM orcamento WHERE '+clause,args)).rows:[];
     if(old.length>1)throw Error('Atualize um orçamento por vez')
     const merged={...(old[0]?decode(t,old[0]):{}),...row};Object.assign(row,budgetTotals(merged.itens,merged.desconto_pct));
     if(!['pendente','aprovado','recusado','em_negociacao'].includes(merged.status||'pendente'))throw Error('Status inválido')
    }
    for(const k of ['valor','valor_total','total','total_com_desconto','valor_mensal','mrr','desconto_pct','percentual_repasse','parcelas','total_parcelas','parcela_atual','duracao_minutos'])if(row[k]!=null&&(!Number.isFinite(Number(row[k]))||Number(row[k])<0))throw Error('Valor inválido: '+k)
    if(t==='consulta'){const merged={...(s.action==='update'?(await this.sql.sql('SELECT * FROM consulta WHERE '+clause,args)).rows[0]:{}),...row};if(!/^\d{4}-\d{2}-\d{2}$/.test(merged.data)||!/^([01]\d|2[0-3]):[0-5]\d(:00)?$/.test(merged.hora)||Number(merged.duracao_minutos??60)<=0||Number(merged.duracao_minutos??60)>720)throw Error('Data ou duração inválida')}
    if(s.action==='insert'&&!row.id)row.id=crypto.randomUUID();const keys=Object.keys(row);const params=keys.map(k=>val(row[k]));const statement=s.action==='update'?'UPDATE '+q(t)+' SET '+keys.map(k=>col(k)+'=?').join(',')+' WHERE '+clause+' RETURNING *':'INSERT INTO '+q(t)+' ('+keys.map(col).join(',')+') VALUES ('+keys.map(()=>'?').join(',')+') RETURNING *';
    rows=(await this.sql.sql(statement,s.action==='update'?[...params,...args]:params)).rows
   }count=rows.length
  }
  const data=rows.map(row=>{const d=decode(t,row);return selected?Object.fromEntries(selected.map(k=>[k,d[k]])):d});if(s.cardinality==='one'&&data.length!==1)throw Error('Registro não encontrado');if(s.cardinality==='maybe'&&data.length>1)throw Error('Mais de um registro encontrado');return{data:s.head?null:s.cardinality?data[0]??null:data,error:null,count}
 }catch(e:any){return{data:null,error:{message:e.message},count:0}}}
}
