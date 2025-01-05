import { dbConnect } from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { categoryValidationSchema } from "@/types/schemas";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("_id");
  const aggregate = searchParams.get("aggregate");
  const parentId = searchParams.get("parentId");

  try {
    // Dacă există parentId în query, validăm valoarea înainte de a o folosi
    if (parentId) {
      let query;
      if (parentId === "null" || parentId === null) {
        query = { parentId: null };
      } else {
        // Asigură-te că parentId este un ObjectId valid
        if (!mongoose.Types.ObjectId.isValid(parentId)) {
          return NextResponse.json(
            { message: "Invalid parentId format" },
            { status: 400 }
          );
        }
        query = { parentId: new mongoose.Types.ObjectId(parentId) };
      }
      
      const data = await Category.find(query).lean();
      return NextResponse.json({ data }, { status: 200 });
    }

    if (_id) {
      if (aggregate) {
        const data = await Category.aggregate([
          {
            $lookup: {
              from: "subcategories", // Schimbă cu colecția corectă dacă este altceva
              localField: "_id",
              foreignField: "category",
              as: "subcategories",
            },
          },
          { $match: { _id: new mongoose.Types.ObjectId(_id) } },
        ]);
        return NextResponse.json({ data }, { status: 200 });
      } else {
        const data = await Category.findById(_id).lean();
        if (!data) {
          return NextResponse.json(
            { message: "Category not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ data }, { status: 200 });
      }
    }

    const data = await Category.find()
      .populate({
        path: "parentId",
        model: "Category",
      })
      .lean();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const validatedFields = categoryValidationSchema.safeParse(body);

    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    let newSlug = body.slug;
    const existingCategory = await Category.findOne({ slug: newSlug });

    if (existingCategory) {
      let suffix = 1;
      newSlug = `${body.slug}-${suffix}`;

      while (await Category.findOne({ slug: newSlug })) {
        suffix++;
        newSlug = `${body.slug}-${suffix}`;
      }
    }

    body.slug = newSlug;

    // Save the new category data to db
    const data = await new Category(body).save();

    revalidatePath("/admin/categories", "page");

    return NextResponse.json(
      { message: "Category created.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const body = await req.json();

  const { searchParams } = new URL(req.url);
  const _id = searchParams.get("_id");
  const action = searchParams.get("action");
  const method = searchParams.get("method");

  if (method === "activateOne") {
    try {
      const { _id, status } = body.data;
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

      const update = await Category.findByIdAndUpdate(_id, { status: status });

      return NextResponse.json(
        {
          message: "Updated successful.",
          update,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }

  try {
    //check if _id exist
    if (!_id) {
      return NextResponse.json({ message: "_id is missing" }, { status: 200 });
    }

    //Add subs categories
    if (action && action === "categoryAddSub") {
      await Category.findByIdAndUpdate(_id, {
        subCategory: body.subCategory,
      });

      return NextResponse.json(
        { message: "Category updated." },
        { status: 200 }
      );
    }

    // Server side validation
    const validatedFields = categoryValidationSchema.safeParse(body);
    if (!validatedFields.success) {
      return Response.json(
        {
          message: "validation error",
          errors: validatedFields.error.flatten().fieldErrors,
        },
        { status: 200 }
      );
    }

    let newSlug = body.slug;
    const existingCategory = await Category.findOne({ slug: newSlug });

    if (existingCategory) {
      let suffix = 1;
      newSlug = `${body.slug}-${suffix}`;

      while (await Category.findOne({ slug: newSlug })) {
        suffix++;
        newSlug = `${body.slug}-${suffix}`;
      }
    }

    body.slug = newSlug;

    // Update data to db
    const data = await Category.findByIdAndUpdate(_id, body);

    //delete the last data cached for this specific url and add this data
    revalidatePath("/admin/categories", "page");
    revalidatePath("/admin/categories/" + data?._id, "page");

    return NextResponse.json(
      { message: "Category updated.", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ err }, { status: 500 });
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

      const deleteCategory = await Category.findByIdAndDelete(_id);

      return NextResponse.json(
        { message: "Deleted successfully", deleteCategory },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting brand:", error);
      return NextResponse.json({ error }, { status: 500 });
    }
  }

  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return Response.json({ message: "missing info" }, { status: 500 });
    }

    // await Category.findByIdAndUpdate(_id, {
    //   status: "draft",
    // });

    await Category.findByIdAndDelete(_id);

    return Response.json(
      {
        message: "Your Category has been deleted ✔️",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
