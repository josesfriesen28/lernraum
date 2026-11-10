import {getChatGPTUser} from './chatgpt-auth';
import Lernraum from '../components/lernraum';
export const dynamic="force-dynamic";
export default async function Home(){const user=await getChatGPTUser();return <Lernraum user={user?{id:user.userId,name:user.fullName||'Dein Lernraum'}:null}/>;}
