import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Lernraum · Wissen, das bleibt',description:'Dein persönlicher Lernraum für Wirtschaftskommunikation.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg',apple:'/icon.png'},appleWebApp:{capable:true,title:'Lernraum',statusBarStyle:'default'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="de"><body>{children}</body></html>;}
