import { getSupabaseAdmin, getSupabaseClient, isSupabaseConfigured } from "./supabase";
import { DigitalProduct, Order, Coupon, Category, Creator, StoreSettings } from "./types";
import { db } from "./db";

// Helper: map DB product row to DigitalProduct
function mapProduct(row: any): DigitalProduct {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle || "",
    description: row.description || "",
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    format: row.format || "PDF Document",
    pageCount: Number(row.page_count || 0),
    fileSize: row.file_size || "0 MB",
    language: row.language || "English",
    delivery: row.delivery || "Instant Digital Download",
    access: row.access || "Lifetime access",
    refunds: row.refunds || "7-day money back guarantee",
    category: row.category,
    creatorName: row.creator_name || "Gatewala",
    creatorHandle: row.creator_handle || "gatewala",
    creatorAvatar: row.creator_avatar || "/avatars/gatewala.svg",
    coverUrl: row.cover_url,
    jacketStyle: row.jacket_style || "swiss",
    jacketColor: row.jacket_color || "#E7E5DE",
    samplePages: Array.isArray(row.sample_pages) ? row.sample_pages : [],
    digitalFileUrl: row.digital_file_url,
    samplePdfUrl: row.sample_pdf_url || undefined,
    paymentLinkUrl: row.payment_link_url || undefined,
    salesCount: Number(row.sales_count || 0),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

// Helper: map DB order row to Order
function mapOrder(row: any): Order {
  return {
    id: row.id,
    productId: row.product_id,
    productTitle: row.product_title,
    productSlug: row.product_slug,
    amount: Number(row.amount),
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone || "",
    customerName: row.customer_name || undefined,
    couponCode: row.coupon_code || null,
    discountAmount: Number(row.discount_amount || 0),
    paymentId: row.payment_id,
    paymentMethod: row.payment_method || "UPI",
    paymentStatus: row.payment_status || "completed",
    downloadToken: row.download_token,
    downloadCount: Number(row.download_count || 0),
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Helper: map DB coupon row to Coupon
function mapCoupon(row: any): Coupon {
  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type || "percentage",
    discountValue: Number(row.discount_value),
    minAmount: Number(row.min_amount || 0),
    active: Boolean(row.active),
    usesCount: Number(row.uses_count || 0),
  };
}

export const supabaseDb = {
  // PRODUCTS
  async getProducts(options?: {
    category?: string;
    creator?: string;
    search?: string;
    sort?: string;
    includeUnpublished?: boolean;
  }): Promise<DigitalProduct[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    let query = supabase.from("products").select("*");

    if (!options?.includeUnpublished) {
      query = query.eq("published", true);
    }

    if (options?.category) {
      query = query.eq("category", options.category);
    }

    if (options?.creator) {
      query = query.eq("creator_handle", options.creator);
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    if (options?.sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (options?.sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else if (options?.sort === "popular") {
      query = query.order("sales_count", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query;
    const supabaseProducts = (!error && data) ? data.map(mapProduct) : [];
    const localProducts = db.getProducts(options);

    // Merge: Supabase products override local products with the same ID or slug
    const finalProducts: DigitalProduct[] = [];
    const seenSlugs = new Set<string>();
    const seenIds = new Set<string>();

    // 1. Supabase products are authoritative
    for (const p of supabaseProducts) {
      seenIds.add(p.id);
      seenSlugs.add(p.slug);
      finalProducts.push(p);
    }

    // 2. Include any local products that aren't already represented in Supabase
    for (const p of localProducts) {
      if (!seenIds.has(p.id) && !seenSlugs.has(p.slug)) {
        seenIds.add(p.id);
        seenSlugs.add(p.slug);
        finalProducts.push(p);
      }
    }

    return finalProducts;
  },

  async getProductById(id: string): Promise<DigitalProduct | null> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return db.getProductById(id);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (error || !data) {
      return db.getProductById(id) || db.getProductBySlug(id);
    }
    return mapProduct(data);
  },

  async getProductBySlug(slug: string): Promise<DigitalProduct | null> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return db.getProductBySlug(slug);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (error || !data) {
      return db.getProductBySlug(slug) || db.getProductById(slug);
    }
    return mapProduct(data);
  },

  async createProduct(product: Omit<DigitalProduct, "id" | "createdAt" | "updatedAt" | "salesCount">): Promise<DigitalProduct> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Supabase admin client not initialized");

    const id = `prod-${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date().toISOString();

    const insertData: any = {
      id,
      slug: product.slug,
      title: product.title,
      subtitle: product.subtitle || "",
      description: product.description || "",
      price: product.price,
      compare_at_price: product.compareAtPrice,
      format: product.format,
      page_count: product.pageCount,
      file_size: product.fileSize,
      language: product.language,
      delivery: product.delivery,
      access: product.access,
      refunds: product.refunds,
      category: product.category,
      creator_name: product.creatorName,
      creator_handle: product.creatorHandle,
      creator_avatar: product.creatorAvatar,
      cover_url: product.coverUrl,
      jacket_style: product.jacketStyle,
      jacket_color: product.jacketColor,
      sample_pages: product.samplePages,
      digital_file_url: product.digitalFileUrl,
      sample_pdf_url: product.samplePdfUrl,
      payment_link_url: product.paymentLinkUrl || null,
      sales_count: 0,
      featured: product.featured,
      published: product.published,
      created_at: now,
      updated_at: now,
    };

    let { data, error } = await supabase
      .from("products")
      .insert(insertData)
      .select()
      .single();

    if (error && (error.message.includes("payment_link_url") || error.code === "PGRST204")) {
      delete insertData.payment_link_url;
      const retry = await supabase
        .from("products")
        .insert(insertData)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return mapProduct(data);
  },

  async updateProduct(id: string, updates: Partial<DigitalProduct>): Promise<DigitalProduct | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const updateData: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.slug !== undefined) updateData.slug = updates.slug;
    if (updates.subtitle !== undefined) updateData.subtitle = updates.subtitle;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category !== undefined) updateData.category = updates.category;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.compareAtPrice !== undefined) updateData.compare_at_price = updates.compareAtPrice;
    if (updates.format !== undefined) updateData.format = updates.format;
    if (updates.pageCount !== undefined) updateData.page_count = updates.pageCount;
    if (updates.fileSize !== undefined) updateData.file_size = updates.fileSize;
    if (updates.coverUrl !== undefined) updateData.cover_url = updates.coverUrl;
    if (updates.digitalFileUrl !== undefined) updateData.digital_file_url = updates.digitalFileUrl;
    if (updates.samplePdfUrl !== undefined) updateData.sample_pdf_url = updates.samplePdfUrl;
    if (updates.salesCount !== undefined) updateData.sales_count = updates.salesCount;
    if (updates.published !== undefined) updateData.published = updates.published;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.jacketStyle !== undefined) updateData.jacket_style = updates.jacketStyle;
    if (updates.paymentLinkUrl !== undefined) updateData.payment_link_url = updates.paymentLinkUrl;

    let { data, error } = await supabase
      .from("products")
      .update(updateData)
      .or(`id.eq.${id},slug.eq.${id}`)
      .select();

    // If update failed due to payment_link_url column not existing in Supabase yet, retry without it
    if (error && (error.message.includes("payment_link_url") || error.code === "PGRST204")) {
      delete updateData.payment_link_url;
      const retry = await supabase
        .from("products")
        .update(updateData)
        .or(`id.eq.${id},slug.eq.${id}`)
        .select();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.warn("Supabase updateProduct warning:", error.message);
    }

    if (data && data.length > 0) {
      return mapProduct(data[0]);
    }

    // If product was not in Supabase, upsert it from local DB so changes are permanently stored in Supabase
    const localProd = db.getProductById(id) || db.getProductBySlug(id);
    if (localProd) {
      const fullProductToUpsert: any = {
        id: localProd.id,
        slug: updates.slug || localProd.slug,
        title: updates.title || localProd.title,
        subtitle: updates.subtitle !== undefined ? updates.subtitle : localProd.subtitle,
        description: updates.description !== undefined ? updates.description : localProd.description,
        price: updates.price !== undefined ? updates.price : localProd.price,
        compare_at_price: updates.compareAtPrice !== undefined ? updates.compareAtPrice : localProd.compareAtPrice,
        format: updates.format || localProd.format,
        page_count: updates.pageCount !== undefined ? updates.pageCount : localProd.pageCount,
        file_size: updates.fileSize || localProd.fileSize,
        language: updates.language || localProd.language,
        delivery: updates.delivery || localProd.delivery,
        access: updates.access || localProd.access,
        refunds: updates.refunds || localProd.refunds,
        category: updates.category || localProd.category,
        creator_name: updates.creatorName || localProd.creatorName,
        creator_handle: updates.creatorHandle || localProd.creatorHandle,
        creator_avatar: updates.creatorAvatar || localProd.creatorAvatar,
        cover_url: updates.coverUrl || localProd.coverUrl,
        jacket_style: updates.jacketStyle || localProd.jacketStyle,
        jacket_color: updates.jacketColor || localProd.jacketColor,
        sample_pages: updates.samplePages || localProd.samplePages,
        digital_file_url: updates.digitalFileUrl || localProd.digitalFileUrl,
        sample_pdf_url: updates.samplePdfUrl || localProd.samplePdfUrl,
        sales_count: updates.salesCount !== undefined ? updates.salesCount : localProd.salesCount,
        featured: updates.featured !== undefined ? updates.featured : localProd.featured,
        published: updates.published !== undefined ? updates.published : localProd.published,
        created_at: localProd.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (updates.paymentLinkUrl !== undefined) {
        fullProductToUpsert.payment_link_url = updates.paymentLinkUrl;
      }

      let { data: upsertData, error: upsertErr } = await supabase
        .from("products")
        .upsert(fullProductToUpsert)
        .select();

      if (upsertErr && (upsertErr.message.includes("payment_link_url") || upsertErr.code === "PGRST204")) {
        delete fullProductToUpsert.payment_link_url;
        const retryUpsert = await supabase
          .from("products")
          .upsert(fullProductToUpsert)
          .select();
        upsertData = retryUpsert.data;
        upsertErr = retryUpsert.error;
      }

      if (!upsertErr && upsertData && upsertData.length > 0) {
        return mapProduct(upsertData[0]);
      }
    }

    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return false;

    const { error } = await supabase.from("products").delete().eq("id", id);
    return !error;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map(mapOrder);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapOrder(data);
  },

  async getOrderByToken(token: string): Promise<Order | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("download_token", token)
      .single();

    if (error || !data) return null;
    return mapOrder(data);
  },

  async lookupOrders(query: { email: string; orderOrPaymentId?: string }): Promise<Order[]> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    let q = supabase
      .from("orders")
      .select("*")
      .ilike("customer_email", query.email.trim());

    const { data, error } = await q;
    if (error || !data) return [];

    let orders = data.map(mapOrder);
    if (query.orderOrPaymentId) {
      const matchId = query.orderOrPaymentId.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase() === matchId ||
          o.paymentId.toLowerCase() === matchId ||
          o.downloadToken.toLowerCase() === matchId
      );
    }

    return orders;
  },

  async createOrder(order: Omit<Order, "id" | "createdAt" | "downloadToken" | "downloadCount">): Promise<Order> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Supabase admin client not initialized");

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `BD-${randomSuffix}`;
    const token = `tok-${randomSuffix}-${Math.random().toString(36).substring(2, 9)}`;

    const insertData: any = {
      id: orderId,
      product_id: order.productId,
      product_title: order.productTitle,
      product_slug: order.productSlug,
      amount: order.amount,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone || "",
      customer_name: order.customerName || "",
      coupon_code: order.couponCode || null,
      discount_amount: order.discountAmount || 0,
      payment_id: order.paymentId,
      payment_method: order.paymentMethod || "UPI",
      payment_status: order.paymentStatus || "completed",
      download_token: token,
      download_count: 0,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("orders")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.warn("Supabase order insert warning (e.g. RLS policy), falling back to persistent store:", error.message);
      return db.createOrder(order);
    }

    // Increment sales count on product
    try {
      await supabase.rpc("increment_sales_count", { p_id: order.productId });
    } catch {
      // Fallback update
      const { data: prod } = await supabase.from("products").select("sales_count").eq("id", order.productId).single();
      if (prod) {
        await supabase.from("products").update({ sales_count: (prod.sales_count || 0) + 1 }).eq("id", order.productId);
      }
    }

    return mapOrder(data);
  },

  async incrementDownload(token: string): Promise<{ success: boolean; product?: DigitalProduct }> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return { success: false };

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("download_token", token)
      .single();

    if (orderErr || !order) return { success: false };

    // Increment download count
    await supabase
      .from("orders")
      .update({ download_count: (order.download_count || 0) + 1 })
      .eq("id", order.id);

    const { data: prod, error: prodErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", order.product_id)
      .single();

    if (prodErr || !prod) return { success: false };
    return { success: true, product: mapProduct(prod) };
  },

  // COUPONS
  async getCoupons(): Promise<Coupon[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase.from("coupons").select("*");
    if (error || !data) return [];
    return data.map(mapCoupon);
  },

  async validateCoupon(code: string, amount: number): Promise<{ valid: boolean; discount: number; message: string }> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return { valid: false, discount: 0, message: "Database offline" };

    const cleanCode = code.trim().toUpperCase();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", cleanCode)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) {
      return { valid: false, discount: 0, message: "Invalid or expired coupon code" };
    }

    if (amount < (data.min_amount || 0)) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ₹${data.min_amount} required for this coupon`,
      };
    }

    let discount = 0;
    if (data.discount_type === "percentage") {
      discount = Math.round((amount * data.discount_value) / 100);
    } else {
      discount = data.discount_value;
    }

    discount = Math.min(discount, amount);
    return { valid: true, discount, message: `${data.code} applied (-₹${discount})` };
  },

  async createCoupon(coupon: Omit<Coupon, "id" | "usesCount">): Promise<Coupon> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Supabase admin client not initialized");

    const id = `cp-${Date.now()}`;
    const insertData: any = {
      id,
      code: coupon.code.toUpperCase().trim(),
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
      min_amount: coupon.minAmount,
      active: coupon.active,
      uses_count: 0,
    };

    const { data, error } = await supabase
      .from("coupons")
      .insert(insertData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create coupon: ${error.message}`);
    return mapCoupon(data);
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return false;

    const { error } = await supabase.from("coupons").delete().eq("id", id);
    return !error;
  },

  // CATEGORIES & CREATORS
  async getCategories(): Promise<Category[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase.from("categories").select("*");
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description || "",
      count: Number(r.count || 0),
    }));
  },

  async getCreators(): Promise<Creator[]> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase.from("creators").select("*");
    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      handle: r.handle,
      name: r.name,
      bio: r.bio || "",
      avatar: r.avatar || "/avatars/gatewala.svg",
      titlesCount: Number(r.titles_count || 0),
      verified: Boolean(r.verified),
    }));
  },

  // STATS & SETTINGS
  async getStats() {
    const supabase = getSupabaseAdmin();
    if (!supabase) return { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalDownloads: 0, recentOrders: [] };

    const [ordersRes, prodsRes] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("id", { count: "exact", head: true }),
    ]);

    const orders = (ordersRes.data || []).map(mapOrder);
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = prodsRes.count || 0;
    const totalDownloads = orders.reduce((sum, o) => sum + (o.downloadCount || 0), 0);

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalDownloads,
      recentOrders: orders.slice(0, 5),
    };
  },

  async getSettings(): Promise<StoreSettings> {
    const supabase = getSupabaseClient() || getSupabaseAdmin();
    if (!supabase) {
      return {
        storeName: "gate2026",
        tagline: "Independent digital publishing",
        established: "Est. 2026 · India",
        currency: "INR",
        currencySymbol: "₹",
        adminPin: "1234",
        supportEmail: "lessgo.dsa@gmail.com",
        razorpayKeyId: "rzp_test_byline_demo",
      };
    }

    const { data } = await supabase.from("store_settings").select("*").eq("id", "default").maybeSingle();
    if (!data) {
      return {
        storeName: "gate2026",
        tagline: "Independent digital publishing",
        established: "Est. 2026 · India",
        currency: "INR",
        currencySymbol: "₹",
        adminPin: "1234",
        supportEmail: "lessgo.dsa@gmail.com",
        razorpayKeyId: "rzp_test_byline_demo",
      };
    }

    return {
      storeName: data.store_name || "gate2026",
      tagline: data.tagline || "Independent digital publishing",
      established: data.established || "Est. 2026 · India",
      currency: data.currency || "INR",
      currencySymbol: data.currency_symbol || "₹",
      adminPin: data.admin_pin || "1234",
      supportEmail: data.support_email || "lessgo.dsa@gmail.com",
      razorpayKeyId: data.razorpay_key_id || "rzp_test_byline_demo",
    };
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Supabase admin client not initialized");

    const updateData: any = { updated_at: new Date().toISOString() };
    if (settings.storeName) updateData.store_name = settings.storeName;
    if (settings.tagline) updateData.tagline = settings.tagline;
    if (settings.established) updateData.established = settings.established;
    if (settings.currency) updateData.currency = settings.currency;
    if (settings.currencySymbol) updateData.currency_symbol = settings.currencySymbol;
    if (settings.adminPin) updateData.admin_pin = settings.adminPin;
    if (settings.supportEmail) updateData.support_email = settings.supportEmail;
    if (settings.razorpayKeyId) updateData.razorpay_key_id = settings.razorpayKeyId;

    const { data, error } = await supabase
      .from("store_settings")
      .upsert({ id: "default", ...updateData })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update store settings: ${error?.message}`);
    }

    return {
      storeName: data.store_name,
      tagline: data.tagline,
      established: data.established,
      currency: data.currency,
      currencySymbol: data.currency_symbol,
      adminPin: data.admin_pin,
      supportEmail: data.support_email,
      razorpayKeyId: data.razorpay_key_id,
    };
  },
};
