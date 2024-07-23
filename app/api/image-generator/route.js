// app/api/image-generator/route.ts
import { NextRequest, NextResponse } from "next/server";
import { client, Status, VariationStyle } from "imaginesdk";
import { writeFile } from "fs/promises";
import { join } from "path";

const imagine = client(process.env.IMAGINE_API_KEY);

export async function POST(req) {
  const { prompt, imagePath } = await req.json();

  try {
    const response = await imagine.variations(prompt, imagePath, {
      style: VariationStyle.ANIME,
    });

    if (response.status() === Status.OK) {
      const image = response.getOrThrow();
      const file = await image.asFile("output.png");

      // Read the file as an array buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save the buffer to the file system
      const savePath = join(process.cwd(), "public", "images", "output.png");
      await writeFile(savePath, buffer);

      return NextResponse.json({
        success: true,
        imagePath: "/images/output.png",
      });
    } else {
      return NextResponse.json({
        success: false,
        error: response.errorOrThrow(),
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
