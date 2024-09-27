import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  const type = reqBody;
  try {
    const theProduct = await prisma.product.findMany({
      where: {
        type: reqBody.type,
      },
    });
    console.log(theProduct);
    console.log(reqBody);

    // const theProduct = await prisma.product.findMany();

    return NextResponse.json({ data: theProduct });
  } catch (error) {
    console.log(error);
  }
}
