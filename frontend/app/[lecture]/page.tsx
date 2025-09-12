import Image from "next/image";
import fs from "fs";
import path from "path";

function get_meta(lecture) {
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
  const svg_path = path.join(process.cwd(), "public", "lectures", `${lecture}.svg`);

  if( !fs.existsSync(svg_path) ){
    return (
      <div className="w-full h-full flex flex-row justify-center">
        <div className="doc-container w-full px-8 lg:w-2/3">
          lecture not found.
        </div>
      </div>
    );
  }

  const svg_page = fs.readFileSync(svg_path, "utf-8");
  const { title, date } = get_meta(lecture);

  return (
    <div>
      <div className="w-full h-full flex flex-row justify-center">
        <div
          className="doc-container w-full px-8"
          dangerouslySetInnerHTML={{ __html: svg_page }}
        />
      </div>
    </div>
  );
}
