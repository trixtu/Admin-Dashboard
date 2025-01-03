import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const aggregate = searchParams.get("aggregate");

  await dbConnect();
  try {
    if (_id) {
      const data = await Category.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    if (aggregate && _id) {
      const data = await Category.aggregate([
        {
          $lookup: {
            from: "subcategories",
            localField: "_id",
            foreignField: "category",
            as: "inventory_docs",
          },
        },
      ]);
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Category.find()
    .lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
