import "./globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
    title: "Whiteboard",
    description: "A simple whiteboard app",
    manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={nunito.className}>{children}</body>
        </html>
    );
}
