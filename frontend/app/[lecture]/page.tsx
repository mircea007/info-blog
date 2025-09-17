import Image from "next/image";
import fs from "fs";
import path from "path";
import { scopeCss } from "@/scopeCss";

export function generateStaticParams(): { lecture: string }[] {
  const meta_path = path.join(process.cwd(), "public", "meta.json");
  const meta = JSON.parse(fs.readFileSync(meta_path, "utf-8"));

  const ret = Object.keys(meta).map((code) => ({ lecture: code }));
  console.log(ret);
  return ret;
}

function get_meta(lecture: string): { 'date': string, 'title': string } {
  const meta_path = path.join(process.cwd(), "public", "meta.json");
  const meta = JSON.parse(fs.readFileSync(meta_path, "utf-8"));
  return meta[lecture];
}

export async function generateMetadata({ params }: { params: { lecture: string } }) {
  const { lecture } = await params;
  const { title } = get_meta(lecture) ?? { title: "Lecture not found" };

  return {
    title, // <title> in head
    description: `Lecture notes for ${title}`,
  };
}

export default async function Lecture({ params }: { params: { lecture: string } }) {
  const { lecture } = await params;
  //const svg_path = path.join(process.cwd(), "public", "lectures", `${lecture}.svg`);
  const doc_path = path.join(process.cwd(), "public", "lectures", `${lecture}.html`);

  if( !fs.existsSync(doc_path) ){
    return (
      <div className="w-full h-full flex flex-row justify-center">
        <div className="doc-container w-full px-8 lg:w-2/3">
          lecture not found.
        </div>
      </div>
    );
  }

  const { title, date } = get_meta(lecture);

  const doc = fs.readFileSync(doc_path, "utf-8");
  const body = doc.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "";
  const raw_stylesheet = doc.match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
  const stylesheet = await scopeCss(raw_stylesheet, ".doc-container");

  return (
    <div>
      <div className="w-full h-full flex flex-row justify-center">
        {/*
        <iframe
          srcDoc={doc}
          style={{ width: "100%", height: "85vh", border: "1px solid #ccc" }}
          sandbox="allow-scripts allow-same-origin"
        />
        */}

        {/*
        <iframe
          srcDoc={`<html><head><style>${stylesheet}</style></head><body class="doc-container">${body}</body></html>`}
          style={{ width: "100%", height: "85vh", border: "1px solid #ccc" }}
          sandbox="allow-scripts allow-same-origin"
        />
        */}
        
        <style dangerouslySetInnerHTML={{ __html: stylesheet }}/>
        <div
          className="doc-container w-full px-8"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </div>
  );
}
