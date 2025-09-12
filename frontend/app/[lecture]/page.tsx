import Image from "next/image";
import fs from "fs";
import path from "path";

export default async function Lecture({ params }: { params: { lecture: string } }) {
  const { lecture } = await params;
  const filePath = path.join(process.cwd(), "public", "lectures", `${lecture}.svg`);

  let content = "";

  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    content = "Lecture not found.";
  }

  return (
    <div className="w-full h-full flex flex-row justify-center">
      <div
        className="doc-container w-full px-8 lg:w-2/3"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
