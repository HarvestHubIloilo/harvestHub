import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/utils/supabase/server";
import { uploadImageToStorage } from "@/utils/uploadImageToStorage";

const STATUS_VALUES = new Set([
  "available",
  "out_of_stock",
  "coming_soon",
  "preorder",
  "discontinued",
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract fields
    const name = (formData.get("name") as string | null) ?? "";
    const description = (formData.get("description") as string | null) ?? "";
    const priceRaw = formData.get("price") as string | null;
    const product_type = (formData.get("product_type") as string | null) ?? "";
    const sku = (formData.get("sku") as string | null) ?? "";
    const imageBlob = formData.get("image_url") as Blob | null;
    const status = (formData.get("status") as string | null) ?? undefined;
    const status_message = (formData.get("status_message") as string | null) ?? null;

    // New boolean switches (default false)
    const is_featured = formData.get("is_featured") === "true";
    const is_recommended = formData.get("is_recommended") === "true";

    const price = priceRaw ? parseFloat(priceRaw) : NaN;

    // Validate required fields
    if (!name || !description || Number.isNaN(price) || !product_type || !sku) {
      return NextResponse.json(
        { error: "Required fields: name, description, price, product_type, sku." },
        { status: 400 }
      );
    }

    // Validate status
    if (status && !STATUS_VALUES.has(status)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
    }

    // Upload image if provided
    let image_url: string | null = null;
    if (imageBlob) {
      const fileName = `products/${Date.now()}_${sku}.jpg`;
      const bucketName = "product-images";
      image_url = await uploadImageToStorage(imageBlob, fileName, bucketName);
    }

    // Build insert payload
    const insertPayload = {
      name,
      description,
      price,
      image_url,
      product_type,
      sku,
      is_featured,
      is_recommended,
      stocks: 0,
      status,
      status_message,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from("products")
      .insert([insertPayload])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Product added successfully.", product: data },
      { status: 201 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}


export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();

    const product_id = formData.get("product_id") as string | null;
    if (!product_id) {
      return NextResponse.json({ error: "product_id is required." }, { status: 400 });
    }
    const idNum = Number(product_id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid product_id." }, { status: 400 });
    }

    const name = (formData.get("name") as string | null) ?? "";
    const description = (formData.get("description") as string | null) ?? "";
    const priceRaw = formData.get("price") as string | null;
    const product_type = (formData.get("product_type") as string | null) ?? "";
    const sku = (formData.get("sku") as string | null) ?? "";
    const imageBlob = formData.get("image_url") as Blob | null;

    // Read raw values for status/status_message so we can detect presence
    const statusValue = formData.get("status");
    const status = statusValue === null ? undefined : String(statusValue);
    const statusMessageValue = formData.get("status_message");
    const status_message = statusMessageValue === null ? null : String(statusMessageValue);

    // Handle is_featured and is_recommended boolean fields
    const isFeaturedValue = formData.get("is_featured");
    const isRecommendedValue = formData.get("is_recommended");

    const price = priceRaw ? parseFloat(priceRaw) : NaN;

    // If only updating toggles (no name/description/etc), skip validation
    const isToggleOnlyUpdate = 
      !formData.has("name") && 
      !formData.has("description") && 
      !formData.has("price");

    // Validate required fields only if not a toggle-only update
    if (!isToggleOnlyUpdate && (!name || !description || Number.isNaN(price) || !product_type || !sku)) {
      return NextResponse.json(
        { error: "Required fields: name, description, price, product_type, sku." },
        { status: 400 }
      );
    }

    // If caller included status field, validate it
    if (formData.has("status") && typeof status !== "undefined" && status !== "") {
      if (!STATUS_VALUES.has(status)) {
        return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
      }
    }

    let image_url: string | null = null;
    if (imageBlob) {
      const fileName = `products/${Date.now()}_${sku}.jpg`;
      const bucketName = "product-images";
      image_url = await uploadImageToStorage(imageBlob, fileName, bucketName);
    }

    // Build update payload. Only include fields that should change.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    // Only add these fields if they were provided in the request
    if (formData.has("name")) updatePayload.name = name;
    if (formData.has("description")) updatePayload.description = description;
    if (formData.has("price")) updatePayload.price = price;
    if (formData.has("product_type")) updatePayload.product_type = product_type;
    if (formData.has("sku")) updatePayload.sku = sku;

    if (image_url) updatePayload.image_url = image_url;

    // If the client sent the "status" key, include it in the update.
    // Allow empty string -> set to NULL in DB, otherwise set the provided enum value.
    if (formData.has("status")) {
      updatePayload.status = status === "" ? null : status;
    }

    // If the client sent the "status_message" key, include it.
    // Accept empty string (will store empty string) or null explicitly.
    if (formData.has("status_message")) {
      updatePayload.status_message = status_message; // null or string
    }

    // Handle boolean toggle fields
    if (isFeaturedValue !== null) {
      updatePayload.is_featured = isFeaturedValue === "true";
    }
    if (isRecommendedValue !== null) {
      updatePayload.is_recommended = isRecommendedValue === "true";
    }

    const { data, error } = await supabaseServer
      .from("products")
      .update(updatePayload)
      .eq("product_id", idNum)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Product updated successfully.", product: data },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const idNum = Number(product_id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid product_id." }, { status: 400 });
    }

    // Try hard delete first
    const { error: deleteError } = await supabaseServer
      .from("products")
      .delete()
      .eq("product_id", idNum);

    if (deleteError) {
      // If FK constraint error, fallback to soft delete
      if (deleteError.message.includes("violates foreign key constraint")) {
        const { error: updateError, data: updated } = await supabaseServer
          .from("products")
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
          })
          .eq("product_id", idNum);

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 400 });
        }

        return NextResponse.json(
          { message: "Product archived instead of deleted.", product: updated },
          { status: 200 }
        );
      }

      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully." },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
