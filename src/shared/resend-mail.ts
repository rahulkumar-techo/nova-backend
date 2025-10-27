import config_env from '@/configs/config-env';
import { Resend } from 'resend';

const resend = new Resend(config_env.resend_api_key||"");

type  IResendMailProvider={
    from:string;
    to:string;
    subject:string;
    html:string
}

export const resendMailProvider= async({from,to,subject,html}:IResendMailProvider):Promise<void> =>{
    
   await resend.emails.send({from,to,subject,html});
}