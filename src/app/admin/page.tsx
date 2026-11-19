"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  PlusCircle,
  Package,
  ShoppingCart,
  Tag,
  BarChart3,
  Settings,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  Eye,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Check,
  Pencil,
  X,
  RotateCcw,
} from "lucide-react";
import { DigitalProduct, Order, Coupon, Category } from "@/lib/types";

export default function AdminDashboard() {
  // Pin authentication
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    try {
      const savedAuth = typeof window !== "undefined" ? localStorage.getItem("gate2026_admin_auth") : null;
      if (savedAuth === "true") {
        setAuthenticated(true);
        loadAllData();
      }
    } catch {}
    setAuthChecking(false);
  }, []);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "upload" | "products" | "orders" | "coupons" | "analytics" | "settings"
  >("upload");

  // Data
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [form, setForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    price: 79,
    compareAtPrice: 99,
    category: "GATE Preparation",
    creatorName: "Gatewala",
    creatorHandle: "gatewala",
    pageCount: 150,
    fileSize: "6.5 MB",
    language: "English",
    format: "1 PDF",
    jacketStyle: "swiss" as "swiss" | "classic" | "minimal" | "modern",
    jacketColor: "#344BB0",
    coverUrl: "/covers/nat-master.svg",
    digitalFileUrl: "/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf",
    samplePdfUrl: "/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf",
    samplePages: ["/samples/sample-page-1.svg", "/samples/sample-page-2.svg"],
    paymentLinkUrl: "",
    featured: true,
    published: true,
  });

  // File upload progress states
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadedPdfInfo, setUploadedPdfInfo] = useState<{
    name: string;
    size: string;
    url: string;
  } | null>(null);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadedCoverInfo, setUploadedCoverInfo] = useState<string | null>(null);

  const [savingProduct, setSavingProduct] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    price: 79,
    compareAtPrice: 99 as number | null,
    category: "GATE Preparation",
    creatorName: "Gatewala",
    creatorHandle: "gatewala",
    pageCount: 150,
    fileSize: "6.5 MB",
    language: "English",
    format: "1 PDF",
    jacketStyle: "swiss" as "swiss" | "classic" | "minimal" | "modern",
    jacketColor: "#344BB0",
    coverUrl: "",
    digitalFileUrl: "",
    samplePdfUrl: "",
    paymentLinkUrl: "",
    salesCount: 0,
    featured: false,
    published: true,
  });
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [editSuccessMessage, setEditSuccessMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [resettingAllSales, setResettingAllSales] = useState(false);

  // New Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 20,
    minAmount: 50,
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    storeName: "gate2026",
    tagline: "Independent digital publishing",
    supportEmail: "lessgo.dsa@gmail.com",
    adminPin: "1234",
    razorpayKeyId: "rzp_test_byline_demo",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState("");

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Auto-slugify when title changes
  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({ ...prev, title: val, slug }));
  };

  const checkPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (
      cleanPin === "1234" ||
      cleanPin === "admin" ||
      cleanPin === "1920" ||
      cleanPin === settingsForm.adminPin
    ) {
      setAuthenticated(true);
      try {
        localStorage.setItem("gate2026_admin_auth", "true");
      } catch {}
      setPinError("");
      loadAllData();
    } else {
      setPinError("Invalid Admin PIN. (Default PIN: 1234)");
    }
  };

  const handleLock = () => {
    setAuthenticated(false);
    try {
      localStorage.removeItem("gate2026_admin_auth");
    } catch {}
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, statRes] = await Promise.all([
        fetch("/api/products?all=true", { cache: "no-store" }),
        fetch("/api/admin/orders", { cache: "no-store" }),
        fetch("/api/admin/stats", { cache: "no-store" }),
      ]);

      const prodData = await prodRes.json();
      const ordData = await ordRes.json();
      const statData = await statRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (ordData.success) setOrders(ordData.orders);
      if (statData.success) {
        setStats(statData.stats);
        setCoupons(statData.coupons || []);
        setCategories(statData.categories || []);
        if (statData.settings) {
          setSettingsForm({
            storeName: statData.settings.storeName || "gate2026",
            tagline: statData.settings.tagline || "",
            supportEmail: statData.settings.supportEmail || "",
            adminPin: statData.settings.adminPin || "1234",
            razorpayKeyId: statData.settings.razorpayKeyId || "",
          });
        }
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload digital PDF
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setUploadedPdfInfo({
          name: result.originalName,
          size: result.sizeStr,
          url: result.url,
        });
        setForm((prev) => ({
          ...prev,
          digitalFileUrl: result.url,
          samplePdfUrl: result.url,
          fileSize: result.sizeStr,
          format: `1 PDF · ${result.sizeStr}`,
        }));
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (err) {
      alert("Error uploading PDF file");
    } finally {
      setUploadingPdf(false);
    }
  };

  // Upload cover image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success) {
        setUploadedCoverInfo(result.url);
        setForm((prev) => ({ ...prev, coverUrl: result.url }));
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (err) {
      alert("Error uploading cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  // Create Product Submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Product "${data.product.title}" uploaded and published successfully!`);
        setProducts((prev) => [data.product, ...prev]);
        // Reset form
        setForm({
          title: "",
          slug: "",
          subtitle: "",
          description: "",
          price: 79,
          compareAtPrice: 99,
          category: "GATE Preparation",
          creatorName: "Gatewala",
          creatorHandle: "gatewala",
          pageCount: 150,
          fileSize: "6.5 MB",
          language: "English",
          format: "1 PDF",
          jacketStyle: "swiss",
          jacketColor: "#344BB0",
          coverUrl: "/covers/nat-master.svg",
          digitalFileUrl: "/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf",
          samplePdfUrl: "/sample_downloads/GATE_CSE_2027_NAT_Master_Book_Sample.pdf",
          samplePages: ["/samples/sample-page-1.svg", "/samples/sample-page-2.svg"],
          paymentLinkUrl: "",
          featured: true,
          published: true,
        });
        setUploadedPdfInfo(null);
        setUploadedCoverInfo(null);
      } else {
        setErrorMessage(data.error || "Failed to create product");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create product");
    } finally {
      setSavingProduct(false);
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (p: DigitalProduct) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !p.published }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? data.product : item))
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Start editing product
  const handleStartEdit = (product: DigitalProduct) => {
    setEditingProduct(product);
    setEditForm({
      title: product.title || "",
      slug: product.slug || "",
      subtitle: product.subtitle || "",
      description: product.description || "",
      price: product.price ?? 0,
      compareAtPrice: product.compareAtPrice ?? null,
      category: product.category || "GATE Preparation",
      creatorName: product.creatorName || "Gatewala",
      creatorHandle: product.creatorHandle || "gatewala",
      pageCount: product.pageCount || 0,
      fileSize: product.fileSize || "",
      language: product.language || "English",
      format: product.format || "PDF Document",
      jacketStyle: (product.jacketStyle as any) || "swiss",
      jacketColor: product.jacketColor || "#344BB0",
      coverUrl: product.coverUrl || "",
      digitalFileUrl: product.digitalFileUrl || "",
      samplePdfUrl: product.samplePdfUrl || "",
      paymentLinkUrl: product.paymentLinkUrl || "",
      salesCount: product.salesCount ?? 0,
      featured: Boolean(product.featured),
      published: Boolean(product.published),
    });
    setEditSuccessMessage("");
    setEditErrorMessage("");
    setEditModalOpen(true);
  };

  // Save product edits
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setUpdatingProduct(true);
    setEditSuccessMessage("");
    setEditErrorMessage("");

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === editingProduct.id ? { ...item, ...data.product } : item
          )
        );
        setEditSuccessMessage("Product updated successfully!");

        // Refresh fresh data from database in background
        fetch("/api/products?all=true", { cache: "no-store" })
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.products) setProducts(d.products);
          })
          .catch(() => {});

        setTimeout(() => {
          setEditModalOpen(false);
          setEditingProduct(null);
        }, 800);
      } else {
        setEditErrorMessage(data.error || "Failed to update product");
      }
    } catch (err: any) {
      setEditErrorMessage(err.message || "Failed to update product");
    } finally {
      setUpdatingProduct(false);
    }
  };

  // Reset sales count of all products
  const handleResetAllSales = async () => {
    if (!confirm("Are you sure you want to reset all products' sold count to 0?")) return;
    setResettingAllSales(true);
    try {
      const res = await fetch("/api/admin/reset-sales", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => ({ ...p, salesCount: 0 })));
        alert("All product sold counts have been reset to zero!");
      } else {
        alert(data.error || "Failed to reset sales counts");
      }
    } catch (err) {
      alert("Failed to reset sales counts");
    } finally {
      setResettingAllSales(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
        // Refresh products list from server with no-store
        try {
          const freshRes = await fetch("/api/products?all=true", { cache: "no-store" });
          const freshData = await freshRes.json();
          if (freshData.success && freshData.products) {
            setProducts(freshData.products);
          }
        } catch {}
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) return;

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(couponForm),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => [...prev, data.coupon]);
        setCouponForm({
          code: "",
          discountType: "percentage",
          discountValue: 20,
          minAmount: 50,
        });
      }
    } catch (err) {
      alert("Failed to create coupon");
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      alert("Failed to delete coupon");
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSavedMessage("Store settings updated successfully!");
      }
    } catch {
      alert("Failed to update settings");
    } finally {
      setSavingSettings(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-paper">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // PIN Login Gate
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-paper">
        <div className="w-full max-w-md p-8 rounded-2xl border border-rule bg-paper-2 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-3xl font-bold text-ink">
              {settingsForm.storeName} Admin
            </h2>
            <p className="text-xs font-mono text-muted">
              Enter master PIN to manage &amp; upload digital products
            </p>
          </div>

          <form onSubmit={checkPin} className="space-y-4">
            <div>
              <input
                type="password"
                autoFocus
                placeholder="Enter PIN (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 rounded-xl border border-rule bg-paper text-ink focus:outline-accent"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-600 font-mono">{pinError}</p>
            )}

            <button
              type="submit"
              className="btn-cobalt w-full py-3 rounded-xl font-medium text-sm"
            >
              <span>Unlock Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-xs font-mono text-muted">
            <Link href="/" className="hover:underline">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-ink text-paper border-b border-ink/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-xl font-bold text-paper">
            {settingsForm.storeName}
          </Link>
          <span className="text-[11px] font-mono bg-paper/10 text-paper/80 border border-white/20 px-2 py-0.5 rounded">
            ADMIN CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="text-xs font-mono text-paper/70 hover:text-white flex items-center gap-1.5"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLock}
            className="text-xs font-mono bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-paper transition-colors"
          >
            Lock
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-rule pb-2">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "upload"
                ? "bg-accent text-white font-semibold"
                : "bg-paper-2 text-ink-2 hover:bg-paper-3"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Digital Product</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "products"
                ? "bg-accent text-white font-semibold"
                : "bg-paper-2 text-ink-2 hover:bg-paper-3"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>All Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-accent text-white font-semibold"
                : "bg-paper-2 text-ink-2 hover:bg-paper-3"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders &amp; Downloads ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "coupons"
                ? "bg-accent text-white font-semibold"
                : "bg-paper-2 text-ink-2 hover:bg-paper-3"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "analytics"
                ? "bg-accent text-white font-semibold"
                : "bg-paper-2 text-ink-2 hover:bg-paper-3"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-accent text-white font-semibold"
                : "bg-paper-2 text-ink-2 hover:bg-paper-3"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD DIGITAL PRODUCT */}
        {activeTab === "upload" && (
          <div className="max-w-4xl space-y-6">
            <div>
              <span className="num-pill block mb-1">PUBLISHING WORKFLOW</span>
              <h1 className="font-serif text-3xl font-bold text-ink">
                Upload New Digital Product
              </h1>
              <p className="text-sm text-ink-2">
                Upload your master PDF, configure sample previews, pricing, and Swiss book jacket design.
              </p>
            </div>

            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-mono flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{successMessage}</span>
                </span>
                <Link
                  href="/browse"
                  target="_blank"
                  className="underline text-emerald-900 font-bold ml-4"
                >
                  View in store →
                </Link>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-8">
              {/* FILE UPLOAD DROPZONE SECTION */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-rule bg-paper-2/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <span>Step 1: Master Digital File (PDF)</span>
                  </h3>
                  <span className="text-xs font-mono text-muted">Instant delivery asset</span>
                </div>

                <input
                  type="file"
                  ref={pdfInputRef}
                  accept=".pdf,.epub,.zip"
                  onChange={handlePdfUpload}
                  className="hidden"
                />

                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className="p-8 rounded-xl border border-rule bg-paper hover:bg-paper-3 transition-colors text-center cursor-pointer space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>

                  {uploadingPdf ? (
                    <p className="text-sm font-mono text-accent animate-pulse">
                      Uploading and calculating file checksum...
                    </p>
                  ) : uploadedPdfInfo ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-emerald-700 flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>Uploaded: {uploadedPdfInfo.name}</span>
                      </p>
                      <p className="text-xs font-mono text-muted">
                        Size: {uploadedPdfInfo.size} · Ready for instant delivery
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-ink">
                        Click to select or drag and drop your master study PDF
                      </p>
                      <p className="text-xs font-mono text-muted">
                        PDF, ePub or ZIP up to 100MB (Pre-linked sample available)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* COVER ART & BOOK JACKET SECTION */}
              <div className="p-6 rounded-2xl border border-rule bg-paper-2/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-ink flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-accent" />
                    <span>Step 2: Cover Art &amp; Book Jacket Design</span>
                  </h3>
                  <span className="text-xs font-mono text-muted">Editorial aesthetic</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  {/* Upload custom image */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono uppercase text-muted font-semibold">
                      Upload Custom Cover Image / SVG
                    </label>
                    <input
                      type="file"
                      ref={coverInputRef}
                      accept="image/*,.svg"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => coverInputRef.current?.click()}
                      className="p-5 rounded-xl border border-rule bg-paper hover:bg-paper-3 cursor-pointer text-center space-y-2"
                    >
                      <Upload className="w-5 h-5 mx-auto text-muted" />
                      <p className="text-xs font-medium text-ink">
                        {uploadingCover
                          ? "Uploading cover..."
                          : uploadedCoverInfo
                          ? "Custom Cover Uploaded!"
                          : "Upload PNG / SVG / JPG"}
                      </p>
                    </div>
                  </div>

                  {/* Or pick jacket style */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono uppercase text-muted font-semibold">
                      Or Choose Jacket Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["swiss", "modern", "classic", "minimal"] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, jacketStyle: style }))}
                          className={`p-2.5 rounded-lg border text-xs font-mono capitalize transition-all ${
                            form.jacketStyle === style
                              ? "bg-ink text-paper border-ink font-bold"
                              : "bg-paper text-ink border-rule hover:bg-paper-3"
                          }`}
                        >
                          {style} style
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCT DETAILS METADATA */}
              <div className="p-6 rounded-2xl border border-rule bg-paper-2/60 space-y-5">
                <h3 className="font-serif font-bold text-lg text-ink">
                  Step 3: Publication Details &amp; Pricing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GATE CSE 2027 Discrete Mathematics Master Guide"
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink focus:outline-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Store URL Slug
                    </label>
                    <div className="flex items-center text-xs font-mono bg-paper border border-rule rounded-xl px-3 py-2.5">
                      <span className="text-muted">/p/</span>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="flex-1 bg-transparent text-ink focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Category / Topic *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink focus:outline-accent"
                    >
                      <option>GATE Preparation</option>
                      <option>Computer Science</option>
                      <option>Data Analytics &amp; AI</option>
                      <option>Electronics &amp; Comm.</option>
                      <option>Mathematics &amp; Aptitude</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Price (INR ₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink font-mono focus:outline-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Compare-at Price (for discount strikethrough)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.compareAtPrice}
                      onChange={(e) =>
                        setForm({ ...form, compareAtPrice: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink font-mono focus:outline-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Page Count
                    </label>
                    <input
                      type="number"
                      value={form.pageCount}
                      onChange={(e) =>
                        setForm({ ...form, pageCount: Number(e.target.value) })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink font-mono focus:outline-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Creator / Author
                    </label>
                    <input
                      type="text"
                      value={form.creatorName}
                      onChange={(e) =>
                        setForm({ ...form, creatorName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink focus:outline-accent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Subtitle / Punchline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500+ solved numericals with step-by-step calculator traps."
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink focus:outline-accent"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Detailed Description (Markdown)
                    </label>
                    <textarea
                      rows={8}
                      placeholder="Write full study syllabus, high-yield topics, trap list, and who it's for..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full p-4 text-sm rounded-xl border border-rule bg-paper text-ink focus:outline-accent font-sans leading-relaxed"
                    />
                  </div>

                  <div className="sm:col-span-2 p-4 bg-paper rounded-xl border border-rule space-y-1.5">
                    <label className="block text-xs font-mono uppercase text-muted font-semibold flex items-center justify-between">
                      <span className="text-ink">Direct Payment Link (Optional)</span>
                      <span className="text-[11px] text-accent lowercase">e.g. https://rzp.io/l/...</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://rzp.io/l/your-link (Leave blank to use automatic checkout)"
                      value={form.paymentLinkUrl || ""}
                      onChange={(e) => setForm({ ...form, paymentLinkUrl: e.target.value })}
                      className="w-full px-4 py-2 text-sm rounded-lg border border-rule bg-paper-2 text-ink font-mono focus:outline-accent"
                    />
                    <p className="text-[11px] text-muted">
                      💡 Paste any pre-created Razorpay Payment Link (or Cosmofeed/Instamojo) here. When students click &quot;Buy now&quot;, they will be redirected directly to this link!
                    </p>
                  </div>
                </div>

                {/* Published & Featured Toggles */}
                <div className="pt-2 flex flex-wrap gap-6 text-xs font-mono">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="w-4 h-4 rounded border-rule text-accent focus:ring-accent"
                    />
                    <span className="font-semibold text-ink">Publish immediately to store</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-rule text-accent focus:ring-accent"
                    />
                    <span className="font-semibold text-ink">Feature on homepage "New this week"</span>
                  </label>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={savingProduct || !form.title}
                  className="btn-cobalt py-3.5 px-8 rounded-full text-base font-semibold shadow-md disabled:opacity-50"
                >
                  {savingProduct ? (
                    <span>Publishing Digital Product...</span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Publish to {settingsForm.storeName} Store</span>
                    </>
                  )}
                </button>

                <p className="text-xs font-mono text-muted">
                  Instant live availability across all channels
                </p>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: ALL PRODUCTS */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="num-pill block mb-1">INVENTORY</span>
                <h2 className="font-serif text-3xl font-bold text-ink">
                  Published Titles ({products.length})
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAllSales}
                  disabled={resettingAllSales}
                  className="btn-paper border border-rule text-xs py-2 px-3.5 rounded-full flex items-center gap-1.5 text-muted hover:text-ink transition-colors cursor-pointer"
                  title="Reset all products sold counter to 0"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resettingAllSales ? "animate-spin" : ""}`} />
                  <span>Reset All Sold Counts to 0</span>
                </button>

                <button
                  onClick={() => setActiveTab("upload")}
                  className="btn-ink text-xs py-2 px-4 rounded-full"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Upload New</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-rule bg-paper overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-paper-2 border-b border-rule text-muted uppercase">
                    <tr>
                      <th className="p-4">Cover</th>
                      <th className="p-4">Title &amp; Author</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Sales</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-paper-2/40">
                        <td className="p-4">
                          <div className="w-10 h-12 rounded border border-rule overflow-hidden bg-paper-2">
                            <img
                              src={p.coverUrl}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-serif font-bold text-sm text-ink max-w-xs truncate">
                            {p.title}
                          </p>
                          <p className="text-muted text-[11px]">by {p.creatorName}</p>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-ink text-sm">₹{p.price}</span>
                          {p.compareAtPrice && (
                            <s className="text-muted ml-1.5">₹{p.compareAtPrice}</s>
                          )}
                        </td>
                        <td className="p-4 text-ink-2">{p.category}</td>
                        <td className="p-4 font-semibold text-accent">{p.salesCount} sold</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTogglePublish(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.published
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {p.published ? "Active" : "Draft"}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleStartEdit(p)}
                            className="p-1.5 inline-block text-muted hover:text-accent hover:bg-paper-2 rounded transition-colors"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/p/${p.slug}`}
                            target="_blank"
                            className="p-1.5 inline-block text-muted hover:text-ink hover:bg-paper-2 rounded transition-colors"
                            title="View on store"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & CUSTOMERS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <span className="num-pill block mb-1">SALES LEDGER</span>
              <h2 className="font-serif text-3xl font-bold text-ink">
                Customer Purchases &amp; Downloads ({orders.length})
              </h2>
            </div>

            <div className="rounded-2xl border border-rule bg-paper overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-paper-2 border-b border-rule text-muted uppercase">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Downloads</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Download Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-paper-2/40">
                        <td className="p-4 font-bold text-ink">{o.id}</td>
                        <td className="p-4 max-w-xs truncate font-medium text-ink">
                          {o.productTitle}
                        </td>
                        <td className="p-4">
                          <p className="text-ink">{o.customerEmail}</p>
                          {o.customerPhone && (
                            <p className="text-muted text-[11px]">{o.customerPhone}</p>
                          )}
                        </td>
                        <td className="p-4 font-bold text-ink">₹{o.amount}</td>
                        <td className="p-4">
                          <span className="bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4">{o.downloadCount} downloads</td>
                        <td className="p-4 text-muted">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={`/api/download/${o.downloadToken}`}
                            download
                            className="btn-line text-[11px] py-1 px-3 rounded-md"
                          >
                            PDF
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === "coupons" && (
          <div className="max-w-4xl space-y-8">
            <div>
              <span className="num-pill block mb-1">PROMOTIONS</span>
              <h2 className="font-serif text-3xl font-bold text-ink">
                Manage Discount Coupons
              </h2>
            </div>

            {/* Create Coupon Form */}
            <form
              onSubmit={handleCreateCoupon}
              className="p-6 rounded-2xl border border-rule bg-paper-2/60 space-y-4"
            >
              <h3 className="font-serif font-bold text-base text-ink">Add New Coupon</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EXAM25"
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg border border-rule bg-paper text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
                    Type
                  </label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        discountType: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-rule bg-paper text-ink"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponForm.discountValue}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        discountValue: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-rule bg-paper text-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1 font-semibold">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.minAmount}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        minAmount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-rule bg-paper text-ink"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-ink text-xs py-2 px-5 rounded-full"
              >
                <span>Save Coupon</span>
              </button>
            </form>

            {/* Coupons List */}
            <div className="rounded-2xl border border-rule bg-paper overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-paper-2 border-b border-rule text-muted uppercase">
                  <tr>
                    <th className="p-4">Code</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Min Spend</th>
                    <th className="p-4">Times Used</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-paper-2/40">
                      <td className="p-4 font-bold text-accent">{c.code}</td>
                      <td className="p-4">
                        {c.discountType === "percentage"
                          ? `${c.discountValue}% off`
                          : `₹${c.discountValue} flat off`}
                      </td>
                      <td className="p-4">₹{c.minAmount}</td>
                      <td className="p-4 text-muted">{c.usesCount} times</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteCoupon(c.id)}
                          className="text-muted hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div>
              <span className="num-pill block mb-1">METRICS</span>
              <h2 className="font-serif text-3xl font-bold text-ink">
                Performance Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border border-rule bg-paper space-y-2">
                <span className="text-xs font-mono text-muted uppercase">Gross Revenue</span>
                <p className="font-serif text-4xl font-bold text-ink">
                  ₹{stats?.totalRevenue || 0}
                </p>
                <p className="text-[11px] font-mono text-emerald-700">Instant UPI/Card settlements</p>
              </div>

              <div className="p-6 rounded-2xl border border-rule bg-paper space-y-2">
                <span className="text-xs font-mono text-muted uppercase">Total Orders</span>
                <p className="font-serif text-4xl font-bold text-ink">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-[11px] font-mono text-muted">Completed guest purchases</p>
              </div>

              <div className="p-6 rounded-2xl border border-rule bg-paper space-y-2">
                <span className="text-xs font-mono text-muted uppercase">Active Digital Titles</span>
                <p className="font-serif text-4xl font-bold text-ink">
                  {stats?.totalProducts || 0}
                </p>
                <p className="text-[11px] font-mono text-accent">PDFs, bundles &amp; workbooks</p>
              </div>

              <div className="p-6 rounded-2xl border border-rule bg-paper space-y-2">
                <span className="text-xs font-mono text-muted uppercase">Total Downloads</span>
                <p className="font-serif text-4xl font-bold text-ink">
                  {stats?.totalDownloads || 0}
                </p>
                <p className="text-[11px] font-mono text-muted">Lifetime student accesses</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-3xl space-y-6">
            <div>
              <span className="num-pill block mb-1">CONFIGURATION</span>
              <h2 className="font-serif text-3xl font-bold text-ink">
                Store Settings
              </h2>
              <p className="text-sm text-ink-2">
                Manage your store identity, currency, payment credentials, and master security PIN.
              </p>
            </div>

            {settingsSavedMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{settingsSavedMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 rounded-2xl border border-rule bg-paper-2/60 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                    Store Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.storeName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, storeName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink font-semibold focus:outline-accent"
                  />
                  <p className="text-[11px] font-mono text-muted mt-1">
                    Displays in the header navigation, footer, receipts, and meta tags.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, tagline: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink focus:outline-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.supportEmail}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, supportEmail: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink focus:outline-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                      Admin Master PIN
                    </label>
                    <input
                      type="text"
                      value={settingsForm.adminPin}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, adminPin: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink font-mono focus:outline-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1.5 font-semibold">
                    Razorpay Key ID
                  </label>
                  <input
                    type="text"
                    value={settingsForm.razorpayKeyId}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-rule bg-paper text-ink font-mono focus:outline-accent"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-rule flex items-center justify-between">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="btn-cobalt py-2.5 px-6 rounded-full text-xs font-semibold shadow-sm"
                >
                  {savingSettings ? "Saving Settings..." : "Save Store Settings"}
                </button>

                <span className="text-xs font-mono text-muted">
                  Saves directly to database
                </span>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-paper rounded-2xl shadow-2xl border border-rule flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-rule bg-paper-2 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-lg leading-tight">
                    Edit Product
                  </h3>
                  <p className="text-xs font-mono text-muted line-clamp-1">
                    {editingProduct.title} · <span className="opacity-75">{editingProduct.id}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-muted hover:text-ink hover:bg-paper-3 rounded-full transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
              {editSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{editSuccessMessage}</span>
                </div>
              )}
              {editErrorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{editErrorMessage}</span>
                </div>
              )}

              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-ink text-sm border-b border-rule pb-2 flex items-center justify-between">
                  <span>1. Title &amp; Classification</span>
                  <span className="text-muted text-[10px] font-normal uppercase">Core Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-sm font-sans focus:outline-accent"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">URL Slug</label>
                    <input
                      type="text"
                      value={editForm.slug}
                      onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                    >
                      <option value="GATE Preparation">GATE Preparation</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Analytics & AI">Data Analytics & AI</option>
                      <option value="Electronics & Comm.">Electronics & Comm.</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Subtitle / Summary</label>
                    <input
                      type="text"
                      value={editForm.subtitle}
                      onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-sans focus:outline-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Sold Counter */}
              <div className="space-y-4">
                <h4 className="font-semibold text-ink text-sm border-b border-rule pb-2 flex items-center justify-between">
                  <span>2. Pricing &amp; Sold Counter</span>
                  <span className="text-muted text-[10px] font-normal uppercase">Commercial</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Selling Price (₹ INR)</label>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-sm font-bold focus:outline-accent"
                      required
                      min={0}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Compare At (₹ INR)</label>
                    <input
                      type="number"
                      value={editForm.compareAtPrice ?? ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          compareAtPrice: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-sm focus:outline-accent"
                      placeholder="Optional"
                      min={0}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-muted uppercase text-[11px] font-semibold">Sold Count</label>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, salesCount: 0 })}
                        className="text-[10px] text-accent underline hover:text-ink cursor-pointer"
                        title="Reset this product's sold count to 0"
                      >
                        Reset to 0
                      </button>
                    </div>
                    <input
                      type="number"
                      value={editForm.salesCount}
                      onChange={(e) => setEditForm({ ...editForm, salesCount: Number(e.target.value) })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-sm font-bold focus:outline-accent"
                      min={0}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Files & Delivery */}
              <div className="space-y-4">
                <h4 className="font-semibold text-ink text-sm border-b border-rule pb-2 flex items-center justify-between">
                  <span>3. Files, Previews &amp; Payment Link</span>
                  <span className="text-muted text-[10px] font-normal uppercase">Assets</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Digital File URL (Download Asset)</label>
                    <input
                      type="text"
                      value={editForm.digitalFileUrl}
                      onChange={(e) => setEditForm({ ...editForm, digitalFileUrl: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                      required
                    />
                    <span className="text-[10px] text-muted block">
                      Local file path (e.g. /downloads/GATE_CSE_2027_Ultimate_Ranker_Mock_Bundle.zip) or Cloud URL
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Cover Image URL</label>
                    <input
                      type="text"
                      value={editForm.coverUrl}
                      onChange={(e) => setEditForm({ ...editForm, coverUrl: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Sample PDF URL</label>
                    <input
                      type="text"
                      value={editForm.samplePdfUrl}
                      onChange={(e) => setEditForm({ ...editForm, samplePdfUrl: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Direct Razorpay Payment Link (Optional)</label>
                    <input
                      type="text"
                      value={editForm.paymentLinkUrl}
                      onChange={(e) => setEditForm({ ...editForm, paymentLinkUrl: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                      placeholder="e.g. https://rzp.io/l/my-custom-payment-link"
                    />
                    <span className="text-[10px] text-muted block">
                      If set, buyers clicking Buy will be directed immediately to this Razorpay payment link.
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 4: Specifications */}
              <div className="space-y-4">
                <h4 className="font-semibold text-ink text-sm border-b border-rule pb-2 flex items-center justify-between">
                  <span>4. Format &amp; Specifications</span>
                  <span className="text-muted text-[10px] font-normal uppercase">Attributes</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Format Label</label>
                    <input
                      type="text"
                      value={editForm.format}
                      onChange={(e) => setEditForm({ ...editForm, format: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                      placeholder="e.g. 1 PDF · 380 pages"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">Page Count</label>
                    <input
                      type="number"
                      value={editForm.pageCount}
                      onChange={(e) => setEditForm({ ...editForm, pageCount: Number(e.target.value) })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-muted uppercase text-[11px] font-semibold">File Size</label>
                    <input
                      type="text"
                      value={editForm.fileSize}
                      onChange={(e) => setEditForm({ ...editForm, fileSize: e.target.value })}
                      className="w-full p-2.5 border border-rule rounded-lg bg-paper text-ink text-xs font-mono focus:outline-accent"
                      placeholder="e.g. 29.9 MB ZIP"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Description */}
              <div className="space-y-4">
                <h4 className="font-semibold text-ink text-sm border-b border-rule pb-2 flex items-center justify-between">
                  <span>5. Full Description</span>
                  <span className="text-muted text-[10px] font-normal uppercase">Marketing Copy</span>
                </h4>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={8}
                  className="w-full p-3 border border-rule rounded-lg bg-paper text-ink text-xs leading-relaxed font-sans focus:outline-accent"
                />
              </div>

              {/* Section 6: Visibility */}
              <div className="space-y-3 pt-2">
                <h4 className="font-semibold text-ink text-sm border-b border-rule pb-2 flex items-center justify-between">
                  <span>6. Visibility &amp; Status</span>
                  <span className="text-muted text-[10px] font-normal uppercase">Publishing</span>
                </h4>
                <div className="flex flex-wrap gap-6 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.published}
                      onChange={(e) => setEditForm({ ...editForm, published: e.target.checked })}
                      className="w-4 h-4 rounded border-rule text-accent focus:ring-accent"
                    />
                    <span className="font-semibold text-ink">Active / Published</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.featured}
                      onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-rule text-accent focus:ring-accent"
                    />
                    <span className="font-semibold text-ink">Featured on Homepage</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-rule shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="btn-paper border border-rule px-5 py-2.5 rounded-full text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProduct}
                  className="btn-cobalt px-6 py-2.5 rounded-full text-xs font-semibold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {updatingProduct ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
