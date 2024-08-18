import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const theProduct = await prisma.product.findMany();
    return NextResponse.json({ status: "Ok", data: theProduct });
  } catch (error) {
    console.log(error);
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const reqBody = await req.json();
  try {
    await prisma.product.create({
      data: {
        name: reqBody.name,
        image: reqBody.image,
        description: reqBody.description,
        type: reqBody.type,
      },
    });

    const theProduct = await prisma.product.findMany();

    return NextResponse.json({ data: theProduct });
  } catch (error) {
    console.log(error);
  }
}
