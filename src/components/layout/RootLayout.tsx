import type { ReactNode } from "react"
import { Navbar } from "./Navbar/Navbar"
import Footer from "./Footer"


type RootLayoutProps = {
    children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <Navbar />
                <main className='container mx-auto px-4 py-0 bg-background-ow'>{children}</main>
            <Footer />
        </>
    )
}