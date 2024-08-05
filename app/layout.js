import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../app/component/template/Navbar"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pevesindo AI",
  description: "AI App Develop by Pevesindo to make your interior design better and faster",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <div>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
