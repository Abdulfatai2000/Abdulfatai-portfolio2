import type { Metadata } from "next";
export const metadata:Metadata={title:"Abdulfatai — Software Engineer",description:"Ojewande Abdulfatai Ayoye | Software engineer building purposeful full-stack and mobile experiences."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
