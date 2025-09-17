import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link'
import "./globals.css";
import fs from "fs";
import path from "path";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lecture Notes",
  description: "Lecture Notes",
};

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(".").map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}

function get_pages(): { 'code': string, 'date': string, 'title': string }[] {
  const meta_path = path.join(process.cwd(), "public", "meta.json");
  const meta = JSON.parse(fs.readFileSync(meta_path, "utf-8"));

  const ret = [];
  for( const code in meta )
    ret.push({
      'code': code,
      'date': meta[code]['date'],
      'title': meta[code]['title'],
    })

  // cea mai recenta postare apare prima
  ret.sort((a, b) => ((+parseDate(b['date'])) - (+parseDate(a['date']))));
  return ret;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pages = get_pages();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="h-16 items-center bg-indigo-700 text-white mb-8 fixed z-1 top-0 left-0 right-0 w-full flex flex-row justify-center">
          <Link className="text-3xl font-semibold w-full xl:max-w-[80rem] px-4" href="/"> Lecture Notes </Link>
        </div>
        <div className="w-full flex flex-col items-center mt-16 py-8">
          <div className="w-full xl:max-w-[80rem] flex flex-col md:flex-row justify-between">
            <div className="flex-grow">
              {children}
            </div>
            <div className="w-full md:w-72 md:min-w-72 bg-gray-100 border-l-2 border-indigo-300 p-4">
              <div className="md:sticky md:top-24">
                <h1 className="text-md font-semibold underline decoration-2 decoration-indigo-300"> Lecture Notes </h1>
                <ul role="list" className="ml-4 list-disc marker:text-indigo-400 ..."> 
                  {pages.map((meta, index) => (
                    <li key={index}>
                      <Link className="flex gap-2" href={`/${meta.code}`}>
                        <span className="text-gray-400">[{meta.date}]</span>
                        <span className="hover:underline decoration-1">{meta.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
