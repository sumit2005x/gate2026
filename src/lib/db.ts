import fs from "fs";
import path from "path";
import { DigitalProduct, Order, Coupon, Category, Creator, StoreSettings } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "byline_db.json");

interface DatabaseSchema {
  products: DigitalProduct[];
  orders: Order[];
  coupons: Coupon[];
  categories: Category[];
  creators: Creator[];
  settings: StoreSettings;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Byline",
  tagline: "Independent digital publishing",
  established: "Est. 2026 · India",
  currency: "INR",
  currencySymbol: "₹",
  adminPin: "1234",
  supportEmail: "lessgo.dsa@gmail.com",
  razorpayKeyId: "rzp_test_byline_demo",
};

const INITIAL_CREATORS: Creator[] = [
  {
    id: "creator-gatewala",
    handle: "gatewala",
    name: "Gatewala",
    bio: "Ranker & educator compiling rigorous, trap-tested GATE CSE, DA and ECE notes, PYQ workbooks, and mistake books.",
    avatar: "/avatars/gatewala.svg",
    titlesCount: 16,
    verified: true,
  },
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-gate",
    slug: "gate-preparation",
    name: "GATE Preparation",
    description: "Curated notes, PYQs, and NAT master sheets for GATE aspirants.",
    count: 12,
  },
  {
    id: "cat-cs",
    slug: "computer-science",
    name: "Computer Science",
    description: "Discrete math, algorithms, OS, DBMS and computer networks.",
    count: 4,
  },
  {
    id: "cat-da",
    slug: "data-analytics",
    name: "Data Analytics & AI",
    description: "Linear algebra, probability, machine learning, and python.",
    count: 3,
  },
  {
    id: "cat-ece",
    slug: "electronics",
    name: "Electronics & Comm.",
    description: "Signals, systems, analog circuits, and communications.",
    count: 4,
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "c-1",
    code: "GATE20",
    discountType: "percentage",
    discountValue: 20,
    minAmount: 50,
    active: true,
    usesCount: 34,
  },
  {
    id: "c-2",
    code: "FIRST10",
    discountType: "fixed",
    discountValue: 10,
    minAmount: 39,
    active: true,
    usesCount: 19,
  },
];

const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "prod-nat-master",
    slug: "gate-cse-2027-nat-master-book",
    title: "GATE CSE 2027 NAT Master Book",
    subtitle: "Every GATE CSE numerical-answer question, grouped by type, with the method, calculator steps and round-off traps (423-page PDF)",
    description: `GATE CSE 2027 · NAT Master Book
Every GATE CSE numerical-answer question, grouped by type, with the method, the calculator steps and the round-off traps (423-page PDF)

NAT questions have no options to check against. Most NAT marks are lost on the last line: rounding midway, ignoring "rounded off to 2 decimal places", or bytes vs bits.

We took all 446 NAT questions GATE CSE has set since NAT began in 2014 (up to 2026) and grouped them into 60 NAT types, ranked by how many different years each type was asked.

📌 THE MOST ASKED NAT TYPES
• Pipeline speedup, cycle time and throughput: 11 different years
• Graph counts (edges, degrees, colours, spanning trees): 10 years
• Eigenvalues and determinants: 9 years
• Query result counts (SQL and relational algebra): 9 years
• Effective memory access time (cache and TLB): 8 years
• …and 55 more

🧮 ON EVERY TYPE PAGE
• What GATE asks in this type, and every year it came
• The method as a step list, worked on a real PYQ
• The shortcut, only where it's genuinely shorter
• The keystrokes on the GATE virtual scientific calculator
• The round-off and unit traps for that type
• Every number on the type pages was recomputed by a script and checked against the official key

📖 THEN EVERY QUESTION OF THE TYPE
• Paper, year and marks, the official question with figures, and an answer box
• A "before you turn the page" check: answer as typed, rounded as asked, unit checked
• Answers on a later spread, never next to the questions: the official key or accepted range, a full solution, and where people go wrong

📚 FRONT AND BACK
• How to use it, with the three NAT mistakes and how the calculator is used in the book
• Contents and a "NAT types ranked" table
• An answer-range quick table for all 446 keys (49 of them are ranges)
• A tracker for every type

🎯 WHO IT'S FOR
• GATE CSE 2027 aspirants who lose marks on NAT arithmetic, rounding and units
• Anyone who wants to practise NAT by type instead of by year

ℹ️ GOOD TO KNOW
• 423 pages, A4, digital PDF: read on phone, tablet or laptop, or print it.
• Questions and answers are from the official GATE CSE papers; methods, calculator steps and solutions are our own.
• For personal use only. Please don't share, upload or resell.`,
    price: 79,
    compareAtPrice: 99,
    format: "1 PDF · 423 pages",
    pageCount: 423,
    fileSize: "7.6 MB",
    language: "English",
    delivery: "Download to your device, instantly after payment",
    access: "Lifetime — buy once, open any time",
    refunds: "7 days if the file is faulty or not as described",
    category: "GATE Preparation",
    creatorName: "Gatewala",
    creatorHandle: "gatewala",
    coverUrl: "/covers/nat-master.svg",
    jacketStyle: "swiss",
    jacketColor: "#344BB0",
    samplePages: [
      "/samples/sample-page-1.svg",
      "/samples/sample-page-2.svg",
      "/samples/sample-page-3.svg",
    ],
    digitalFileUrl: "/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf",
    samplePdfUrl: "/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf",
    salesCount: 8,
    featured: true,
    published: true,
    createdAt: "2026-11-18T10:00:00.000Z",
    updatedAt: "2026-11-18T10:00:00.000Z",
  },
  {
    id: "prod-da-rescue",
    slug: "gate-da-2027-90-day-rescue-plan",
    title: "GATE DA 2027 90-Day Rescue Plan",
    subtitle: "Day-by-day revision schedule, weightage breakdown, and high-yield question sets for Data Science & AI.",
    description: `A battle-tested 90-day execution framework for GATE Data Science & AI (DA). 
Includes topic-wise formula sheets, coding snippets for Machine Learning algorithms, and probability shortcut charts.

• Day 1-30: Linear Algebra & Calculus Foundation
• Day 31-60: Probability, Statistics & Machine Learning
• Day 61-90: Database Systems & AI Search Algorithms + 10 Full Mock Analyses`,
    price: 79,
    compareAtPrice: 99,
    format: "1 PDF · 186 pages",
    pageCount: 186,
    fileSize: "4.2 MB",
    language: "English",
    delivery: "Download to your device, instantly after payment",
    access: "Lifetime — buy once, open any time",
    refunds: "7 days if the file is faulty or not as described",
    category: "Data Analytics & AI",
    creatorName: "Gatewala",
    creatorHandle: "gatewala",
    coverUrl: "/covers/da-rescue.svg",
    jacketStyle: "modern",
    jacketColor: "#171717",
    samplePages: [
      "/samples/sample-page-1.svg",
      "/samples/sample-page-2.svg",
    ],
    digitalFileUrl: "/sample_downloads/GATE_DA_2027_90_Day_Rescue_Plan.pdf",
    samplePdfUrl: "/sample_downloads/GATE_DA_2027_90_Day_Rescue_Plan.pdf",
    salesCount: 14,
    featured: true,
    published: true,
    createdAt: "2026-11-17T09:00:00.000Z",
    updatedAt: "2026-11-17T09:00:00.000Z",
  },
  {
    id: "prod-pyq-workbook",
    slug: "gate-cse-2027-pyq-workbook-1999-2026",
    title: "GATE CSE 2027 PYQ Workbook (1999–2026)",
    subtitle: "28 years of solved questions classified topic-wise with verified step-by-step solutions and trap alerts.",
    description: `Every single question from 1999 through 2026 rigorously checked.
No vague steps. Contains alternate analytical methods and virtual calculator tips.

• High-yield questions marked with difficulty levels
• Common misconceptions analyzed
• Includes full indexing by subject and concept`,
    price: 129,
    compareAtPrice: 199,
    format: "1 PDF · 640 pages",
    pageCount: 640,
    fileSize: "14.8 MB",
    language: "English",
    delivery: "Download to your device, instantly after payment",
    access: "Lifetime — buy once, open any time",
    refunds: "7 days if the file is faulty or not as described",
    category: "GATE Preparation",
    creatorName: "Gatewala",
    creatorHandle: "gatewala",
    coverUrl: "/covers/pyq-workbook.svg",
    jacketStyle: "classic",
    jacketColor: "#2F5233",
    samplePages: [
      "/samples/sample-page-1.svg",
      "/samples/sample-page-3.svg",
    ],
    digitalFileUrl: "/sample_downloads/GATE_CSE_PYQ_Workbook_Sample.pdf",
    samplePdfUrl: "/sample_downloads/GATE_CSE_PYQ_Workbook_Sample.pdf",
    salesCount: 29,
    featured: true,
    published: true,
    createdAt: "2026-11-15T12:00:00.000Z",
    updatedAt: "2026-11-15T12:00:00.000Z",
  },
  {
    id: "prod-mistake-book",
    slug: "gate-cse-2027-the-mistake-book",
    title: "GATE-CSE-2027-The-Mistake-Book",
    subtitle: "The 100 most common traps in GATE CSE: why students pick the wrong option and how to avoid them.",
    description: `Analysis of over 10,000 student mock exam attempts. 
Pinpoints the exact psychological and conceptual traps set by IISc & IIT paper setters.

• Edge cases in Graph Theory & Pointers
• Paging vs Segmentation calculation traps
• Ambiguity in CFG & Chomsky hierarchy nuances`,
    price: 79,
    compareAtPrice: 99,
    format: "1 PDF · 198 pages",
    pageCount: 198,
    fileSize: "5.1 MB",
    language: "English",
    delivery: "Download to your device, instantly after payment",
    access: "Lifetime — buy once, open any time",
    refunds: "7 days if the file is faulty or not as described",
    category: "GATE Preparation",
    creatorName: "Gatewala",
    creatorHandle: "gatewala",
    coverUrl: "/covers/mistake-book.svg",
    jacketStyle: "minimal",
    jacketColor: "#8C271E",
    samplePages: [
      "/samples/sample-page-2.svg",
      "/samples/sample-page-3.svg",
    ],
    digitalFileUrl: "/sample_downloads/GATE_Mistake_Book_Sample.pdf",
    samplePdfUrl: "/sample_downloads/GATE_Mistake_Book_Sample.pdf",
    salesCount: 19,
    featured: true,
    published: true,
    createdAt: "2026-11-14T08:00:00.000Z",
    updatedAt: "2026-11-14T08:00:00.000Z",
  },
  {
    id: "prod-ece-bundle",
    slug: "gate-ece-2027-the-complete-pack",
    title: "GATE ECE 2027 · The Complete Pack",
    subtitle: "All-in-one bundle: 90-Day Plan, Top 10 Chapters, and Questions GATE Repeats.",
    description: `The complete preparation bundle for GATE ECE 2027.
Get all 3 essential study guides at a combined 26% discount.

Included in this bundle:
1. GATE ECE 2027 90-Day Rescue Plan (175 pages)
2. GATE ECE 2027 Top 10 High-Yield Chapters (120 pages)
3. GATE ECE Questions GATE Repeats (98 pages)`,
    price: 219,
    compareAtPrice: 296,
    format: "Bundle · 3 PDFs · 393 pages",
    pageCount: 393,
    fileSize: "18.2 MB",
    language: "English",
    delivery: "Download to your device, instantly after payment",
    access: "Lifetime — buy once, open any time",
    refunds: "7 days if the file is faulty or not as described",
    category: "Electronics & Comm.",
    creatorName: "Gatewala",
    creatorHandle: "gatewala",
    coverUrl: "/covers/ece-bundle.svg",
    jacketStyle: "swiss",
    jacketColor: "#344BB0",
    samplePages: [
      "/samples/sample-page-1.svg",
      "/samples/sample-page-2.svg",
    ],
    digitalFileUrl: "/sample_downloads/GATE_ECE_Complete_Pack_Sample.pdf",
    samplePdfUrl: "/sample_downloads/GATE_ECE_Complete_Pack_Sample.pdf",
    salesCount: 42,
    featured: true,
    published: true,
    createdAt: "2026-11-12T11:00:00.000Z",
    updatedAt: "2026-11-12T11:00:00.000Z",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "BD-904128",
    productId: "prod-nat-master",
    productTitle: "GATE CSE 2027 NAT Master Book",
    productSlug: "gate-cse-2027-nat-master-book",
    amount: 79,
    customerEmail: "student.gate@gmail.com",
    customerPhone: "+91 9876543210",
    customerName: "Aakash Sharma",
    discountAmount: 0,
    paymentId: "pay_Q108928392",
    paymentMethod: "UPI",
    paymentStatus: "completed",
    downloadToken: "tok-904128-abc",
    downloadCount: 3,
    createdAt: "2026-11-19T06:30:00.000Z",
  },
  {
    id: "BD-883102",
    productId: "prod-ece-bundle",
    productTitle: "GATE ECE 2027 · The Complete Pack",
    productSlug: "gate-ece-2027-the-complete-pack",
    amount: 219,
    customerEmail: "priya.ece@yahoo.com",
    customerPhone: "+91 9822334455",
    customerName: "Priya Nair",
    discountAmount: 0,
    paymentId: "pay_Q098371283",
    paymentMethod: "Card",
    paymentStatus: "completed",
    downloadToken: "tok-883102-def",
    downloadCount: 1,
    createdAt: "2026-11-18T18:15:00.000Z",
  },
];

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      coupons: INITIAL_COUPONS,
      categories: INITIAL_CATEGORIES,
      creators: INITIAL_CREATORS,
      settings: DEFAULT_SETTINGS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    const initialData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      coupons: INITIAL_COUPONS,
      categories: INITIAL_CATEGORIES,
      creators: INITIAL_CREATORS,
      settings: DEFAULT_SETTINGS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  // PRODUCTS
  getProducts(filters?: {
    category?: string;
    creator?: string;
    search?: string;
    sort?: string;
    includeUnpublished?: boolean;
  }): DigitalProduct[] {
    const data = ensureDbFile();
    let result = data.products;

    if (!filters?.includeUnpublished) {
      result = result.filter((p) => p.published);
    }

    if (filters?.category) {
      const c = filters.category.toLowerCase();
      result = result.filter(
        (p) =>
          p.category.toLowerCase().includes(c) ||
          p.category.toLowerCase().replace(/\s+/g, "-") === c
      );
    }

    if (filters?.creator) {
      const cr = filters.creator.toLowerCase();
      result = result.filter(
        (p) =>
          p.creatorHandle.toLowerCase() === cr ||
          p.creatorName.toLowerCase().includes(cr)
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters?.sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters?.sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters?.sort === "popular") {
      result.sort((a, b) => b.salesCount - a.salesCount);
    } else {
      // Default: newest
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  },

  getProductBySlug(slug: string): DigitalProduct | null {
    const data = ensureDbFile();
    return data.products.find((p) => p.slug === slug) || null;
  },

  getProductById(id: string): DigitalProduct | null {
    const data = ensureDbFile();
    return data.products.find((p) => p.id === id) || null;
  },

  createProduct(product: Omit<DigitalProduct, "id" | "createdAt" | "updatedAt">): DigitalProduct {
    const data = ensureDbFile();
    const newProduct: DigitalProduct = {
      ...product,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.products.unshift(newProduct);
    saveDb(data);
    return newProduct;
  },

  updateProduct(id: string, updates: Partial<DigitalProduct>): DigitalProduct | null {
    const data = ensureDbFile();
    const index = data.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    data.products[index] = {
      ...data.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveDb(data);
    return data.products[index];
  },

  deleteProduct(id: string): boolean {
    const data = ensureDbFile();
    const initialLen = data.products.length;
    data.products = data.products.filter((p) => p.id !== id);
    if (data.products.length !== initialLen) {
      saveDb(data);
      return true;
    }
    return false;
  },

  // ORDERS
  getOrders(): Order[] {
    const data = ensureDbFile();
    return data.orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getOrderById(id: string): Order | null {
    const data = ensureDbFile();
    return data.orders.find((o) => o.id === id) || null;
  },

  getOrderByToken(token: string): Order | null {
    const data = ensureDbFile();
    return data.orders.find((o) => o.downloadToken === token) || null;
  },

  lookupOrders(query: { email: string; orderOrPaymentId?: string }): Order[] {
    const data = ensureDbFile();
    const email = query.email.trim().toLowerCase();
    const id = query.orderOrPaymentId?.trim().toLowerCase();

    return data.orders.filter((o) => {
      const emailMatches = o.customerEmail.toLowerCase() === email;
      if (!id) return emailMatches;
      const idMatches =
        o.id.toLowerCase() === id ||
        o.paymentId.toLowerCase() === id ||
        o.downloadToken.toLowerCase() === id;
      return emailMatches && idMatches;
    });
  },

  createOrder(order: Omit<Order, "id" | "createdAt" | "downloadToken" | "downloadCount">): Order {
    const data = ensureDbFile();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `BD-${randomSuffix}`;
    const token = `tok-${randomSuffix}-${Math.random().toString(36).substring(2, 9)}`;

    const newOrder: Order = {
      ...order,
      id: orderId,
      downloadToken: token,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
    };

    data.orders.unshift(newOrder);

    // Increment product sales count
    const prod = data.products.find((p) => p.id === order.productId);
    if (prod) {
      prod.salesCount = (prod.salesCount || 0) + 1;
    }

    saveDb(data);
    return newOrder;
  },

  incrementDownload(token: string): { success: boolean; product?: DigitalProduct } {
    const data = ensureDbFile();
    const order = data.orders.find((o) => o.downloadToken === token);
    if (!order) return { success: false };

    order.downloadCount = (order.downloadCount || 0) + 1;
    saveDb(data);

    const product = data.products.find((p) => p.id === order.productId);
    return { success: true, product };
  },

  // COUPONS
  getCoupons(): Coupon[] {
    const data = ensureDbFile();
    return data.coupons;
  },

  validateCoupon(code: string, amount: number): { valid: boolean; discount: number; message: string } {
    const data = ensureDbFile();
    const cleanCode = code.trim().toUpperCase();
    const coupon = data.coupons.find((c) => c.code === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, discount: 0, message: "Invalid or expired coupon code" };
    }

    if (amount < coupon.minAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ₹${coupon.minAmount} required for this coupon`,
      };
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((amount * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, amount);
    return { valid: true, discount, message: `${coupon.code} applied (-₹${discount})` };
  },

  createCoupon(coupon: Omit<Coupon, "id" | "usesCount">): Coupon {
    const data = ensureDbFile();
    const newCoupon: Coupon = {
      ...coupon,
      id: `cp-${Date.now()}`,
      code: coupon.code.toUpperCase().trim(),
      usesCount: 0,
    };
    data.coupons.push(newCoupon);
    saveDb(data);
    return newCoupon;
  },

  deleteCoupon(id: string): boolean {
    const data = ensureDbFile();
    const len = data.coupons.length;
    data.coupons = data.coupons.filter((c) => c.id !== id);
    if (data.coupons.length !== len) {
      saveDb(data);
      return true;
    }
    return false;
  },

  // CATEGORIES & CREATORS
  getCategories(): Category[] {
    const data = ensureDbFile();
    return data.categories;
  },

  getCreators(): Creator[] {
    const data = ensureDbFile();
    return data.creators;
  },

  // STATS & SETTINGS
  getStats() {
    const data = ensureDbFile();
    const totalRevenue = data.orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const totalOrders = data.orders.length;
    const totalProducts = data.products.length;
    const totalDownloads = data.orders.reduce((sum, o) => sum + (o.downloadCount || 0), 0);

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalDownloads,
      recentOrders: data.orders.slice(0, 5),
    };
  },

  getSettings(): StoreSettings {
    const data = ensureDbFile();
    return data.settings || DEFAULT_SETTINGS;
  },

  updateSettings(settings: Partial<StoreSettings>): StoreSettings {
    const data = ensureDbFile();
    data.settings = { ...data.settings, ...settings };
    saveDb(data);
    return data.settings;
  },
};
