import { Gabarito, Shrikhand } from "next/font/google";
import "./globals.css";

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

const shrikhand = Shrikhand({
  variable: "--font-shrikhand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "BudgetGrub: takeaway for when you're a bit skint",
  description: "Enter your postcode and budget to find takeaway meals you can afford near you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body className={`${gabarito.variable} ${shrikhand.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
