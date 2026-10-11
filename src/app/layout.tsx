import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={
 title:"Ojewande Abdulfatai Ayoye | Software Engineer",
 description:"Portfolio of Ojewande Abdulfatai Ayoye — software engineer building full-stack, mobile, and health technology experiences.",
 openGraph:{title:"Ojewande Abdulfatai Ayoye — Software Engineer",description:"Designing and building meaningful digital experiences.",type:"website"},
 robots:{index:true,follow:true},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
