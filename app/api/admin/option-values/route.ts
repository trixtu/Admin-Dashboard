import { dbConnect } from "@/lib/dbConnect";
import Value from "@/models/Value";
import { valueOptionValidationSchema } from "@/types/schemas";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const optionId = searchParams.get("optionId"); // Obține `optionId` din query

  await dbConnect();

  try {
    // Dacă este specificat `_id`, căutăm doar acel document
    if (_id) {
      const data = await Value.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    // Dacă este specificat `optionId`, filtrăm după acesta
    if (optionId) {
      const data = await Value.find({ optionId }).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    // Dacă nu sunt specificați parametri, returnăm toate documentele
    const data = await Value.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error(err); // Log pentru debugging
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    //Get request values
    const body = await request.json();
    
    // Server side validation
    const validatedFields = valueOptionValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // const value = await Value.findOne({ name: body.name });

    // if (value) {
    //   return NextResponse.json(
    //     { message: `Option with name ${body.name} already exists.` },
    //     { status: 409 } // 409 Conflict este un status mai potrivit pentru acest scenariu
    //   );
    // }
    // Save data to db
    const data = await new Value(body).save();

    revalidatePath("/admin/option-values", "page");

    return NextResponse.json(
      { message: "Option created.", data },
      { status: 200 }
    );
  } catch (error) {
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

      const deletedBrand = await Value.findByIdAndDelete(_id);

      return NextResponse.json(
        { message: "Deleted successfully", deletedBrand },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting value:", error);
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

      const deleted = await Value.deleteMany({ _id: { $in: _ids } });

      return NextResponse.json(
        { message: "Deleted successfully", count: deleted.deletedCount },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting value:", error);
      return NextResponse.json({ error }, { status: 500 });
    }
  }
}
