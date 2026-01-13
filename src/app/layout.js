import "./globals.css";

export const metadata = {
    title: "Whiteboard",
    description: "A simple whiteboard app",
    manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
