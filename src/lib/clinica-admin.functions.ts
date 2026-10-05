import{callBackend}from'@/blink/backend';
export const createClinicaWithOwner=async({data}:any)=>callBackend('/api/master/clinic',data);
export const resetarSenhaAdmin=async(_args:any):Promise<any>=>{throw Error('O titular recupera o acesso na tela de login. Nenhuma senha é gerada pelo administrador.')};
export const enviarEmail=async(_args:any)=>({sent:false,message:'Envio automático não configurado; compartilhe o link de acesso.'});
