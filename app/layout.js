import Navbar from '../components/Navbar';
import "./globals.css";
import { ThemeProvider } from "@/components/features/theme-provider"
import { NextAuthProvider } from './Provider'; 
import Footer from "../components/Footer"

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased block mx-auto">
      <NextAuthProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
          <Navbar/>
            {children}
          <Footer />
          </ThemeProvider>
      </NextAuthProvider>
      </body>
    </html>
  );
}
