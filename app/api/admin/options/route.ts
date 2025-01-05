import { dbConnect } from "@/lib/dbConnect";
import { optionValidationSchema } from "@/types/schemas";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Option from "@/models/Option";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  await dbConnect();

  try {
    if (_id) {
      const data = await Option.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Option.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    //Get request values
    const body = await request.json();

    // Server side validation
    const validatedFields = optionValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }
    const option = await Option.findOne({ name: body.name });

    if (option) {
      return NextResponse.json(
        { message: `Option with name ${body.name} already exists.` },
        { status: 409 } // 409 Conflict este un status mai potrivit pentru acest scenariu
      );
    }
    // Save data to db
    const data = await new Option(body).save();

    revalidatePath("/admin/options", "page");

    return NextResponse.json(
      { message: "Option created.", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { searchParams } = new URL(req.url);

  try {
    const _id = searchParams.get("_id");

    if (!_id) {
      return NextResponse.json(
        { message: "Missing '_id' for update." },
        { status: 400 }
      );
    }

    const update = await Option.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/brands", "page"); //update the data cached for brand list
    revalidatePath("/admin/brands/" + update?.id, "page"); // update data cached for this brand/id

    return NextResponse.json(
      {
        message: "Updated successful.",
        update,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const method = searchParams.get("method");

  if (method === "deleteOne") {
    try {
      const _id = body._id;
      if (!_id) {
        return NextResponse.json(
          { message: "Missing '_id' parameter." },
          { status: 400 }
        );
      }

      const deletedBrand = await Option.findByIdAndDelete(_id);

      return NextResponse.json(
        { message: "Deleted successfully", deletedBrand },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting option:", error);
      return NextResponse.json({ error }, { status: 500 });
    }
  }

  if (method === "deleteMany") {
    try {
      const _ids = body._ids;

      if (!_ids || !_ids.length) {
        return NextResponse.json(
          { message: "Missing '_ids' for bulk update." },
          { status: 400 }
        );
      }

      const deleted = await Option.deleteMany({ _id: { $in: _ids } });

      return NextResponse.json(
        { message: "Deleted successfully", count: deleted.deletedCount },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting option:", error);
      return NextResponse.json({ error }, { status: 500 });
    }
  }
}
