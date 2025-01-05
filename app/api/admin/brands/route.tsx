import { dbConnect } from "@/lib/dbConnect";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";
import { brandValidationSchema } from "@/types/schemas";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");

  await dbConnect();

  try {
    if (_id) {
      const data = await Brand.findById(_id).lean();
      return NextResponse.json({ data }, { status: 200 });
    }
    const data = await Brand.find().sort({ createdAt: -1 }).lean();
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
    const validatedFields = brandValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    const brands = await Brand.findOne({ name: body.name });

    if (brands) {
      return NextResponse.json(
        { message: `Brand with name ${body.name} already exists.` },
        { status: 409 } // 409 Conflict este un status mai potrivit pentru acest scenariu
      );
    }
    // Save data to db
    const data = await new Brand(body).save();

    revalidatePath("/admin/brands", "page");

    return NextResponse.json(
      { message: "Brand created.", data },
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
  const method = searchParams.get("method");

  if (method) {
    const { _id, _ids, status } = body.data;
    switch (method) {
      case "activateMany": {
        if (!_ids || !_ids.length) {
          return NextResponse.json(
            { message: "Missing '_ids' for bulk update." },
            { status: 400 }
          );
        }

        if (!status) {
          return NextResponse.json(
            { message: "Missing 'status' for bulk update." },
            { status: 400 }
          );
        }

        const update = await Brand.updateMany(
          { _id: { $in: _ids } },
          { $set: { status } }
        );

        return NextResponse.json(
          {
            message: "Bulk update successful.",
            updatedCount: update.modifiedCount,
          },
          { status: 200 }
        );
      }
      case "deactivateMany": {
        if (!_ids || !_ids.length) {
          return NextResponse.json(
            { message: "Missing '_ids' for bulk update." },
            { status: 400 }
          );
        }

        if (!status) {
          return NextResponse.json(
            { message: "Missing 'status' for bulk update." },
            { status: 400 }
          );
        }

        const update = await Brand.updateMany(
          { _id: { $in: _ids } },
          { $set: { status } }
        );

        return NextResponse.json(
          {
            message: "Bulk update successful.",
            updatedCount: update.modifiedCount,
          },
          { status: 200 }
        );
      }
      case "activateOne": {
        if (!_id) {
          return NextResponse.json(
            { message: "Missing '_id' for update." },
            { status: 400 }
          );
        }

        if (!status) {
          return NextResponse.json(
            { message: "Missing 'status' for update." },
            { status: 400 }
          );
        }

        const update = await Brand.findByIdAndUpdate(_id, { status: status });

        return NextResponse.json(
          {
            message: "Updated successful.",
            update,
          },
          { status: 200 }
        );
      }

      default:
        return NextResponse.json(
          { message: "Invalid action specified." },
          { status: 400 }
        );
    }
  }

  try {
    const _idToUpdate = searchParams.get("_id");
    // Server side validation
    const validatedFields = brandValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    // Update data to db
    const data = await Brand.findByIdAndUpdate(_idToUpdate, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/brands", "page"); //update the data cached for brand list
    revalidatePath("/admin/brands/" + data?._id, "page"); // update data cached for this brand/id

    return NextResponse.json(
      { message: "Brand updated.", data },
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

  if (method === "deleteMany") {
    try {
      const _ids = body._ids;
      if (!_ids || !_ids.length) {
        return NextResponse.json(
          { message: "Missing '_ids' for bulk update." },
          { status: 400 }
        );
      }
      const deleted = await Brand.deleteMany({ _id: { $in: _ids } });

      return NextResponse.json(
        { message: "Deleted successfully", count: deleted.deletedCount },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  }

  if (method === "deleteOne") {
    try {
      const _id = body._id;
      if (!_id) {
        return NextResponse.json(
          { message: "Missing '_id' parameter." },
          { status: 400 }
        );
      }

      const deletedBrand = await Brand.findByIdAndDelete(_id);

      return NextResponse.json(
        { message: "Deleted successfully", deletedBrand },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  }
  
}
