import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata = {
  title: "BudgetGrub: takeaway that fits your budget",
  description: "Enter your postcode and budget to find takeaway meals you can afford near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body className={`${archivo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
