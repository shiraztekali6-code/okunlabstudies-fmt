import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "מחקר הריון ותסמונת דאון | אוניברסיטת בר-אילן",
  description:
    "במעבדתו של פרופ' איתן אוקון באוניברסיטת בר-אילן מגייסים אימהות לילדים עם תסמונת דאון למחקר תרומת דם בנושא הריון, תסמונת דאון ובריאות המוח.",
  keywords: [
    "Down syndrome research",
    "maternal blood donation study",
    "pregnancy biology research",
    "maternal health research",
    "research participation",
    "Bar-Ilan University study"
  ],
  openGraph: {
    title: "כל אמא נושאת איתה סיפור. חלק מהסיפורים יכולים לשנות את המדע.",
    description:
      "מחקר תרומת דם באוניברסיטת בר-אילן עבור אימהות לילדים עם תסמונת דאון.",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
