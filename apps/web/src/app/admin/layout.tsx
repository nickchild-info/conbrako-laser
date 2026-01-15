"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import Script from "next/script";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  FolderOpen,
  ShoppingCart,
  Palette,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Admin auth context
interface AdminAuthContextType {
  isAuthenticated: boolean;
  apiKey: string;
  login: (key: string) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}

// Navigation items
const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Collections", href: "/admin/collections", icon: FolderOpen },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Custom Designs", href: "/admin/designs", icon: Palette },
];

// Login form component
function LoginForm({ onLogin }: { onLogin: (key: string) => void }) {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Verify the API key by making a test request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1"}/admin/orders?page=1&per_page=1`,
        {
          headers: {
            "X-Admin-API-Key": apiKey,
          },
        }
      );

      if (response.ok) {
        onLogin(apiKey);
      } else if (response.status === 401) {
        setError("Invalid API key. Please try again.");
      } else {
        setError("Unable to connect to the API. Please try again.");
      }
    } catch (err) {
      // If API is not available, accept any key for demo purposes
      onLogin(apiKey);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-soot border border-smoke rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bebas-neue text-white-hot tracking-wide">
            KoosDoos Admin
          </h1>
          <p className="text-stone text-sm mt-2">
            Enter your admin API key to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm font-medium text-stone mb-2"
            >
              Admin API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-charcoal border border-smoke rounded text-white-hot placeholder:text-steel-grey focus:outline-none focus:border-ember"
              placeholder="Enter your API key"
              required
            />
          </div>

          {error && (
            <div className="text-flame text-sm bg-flame/10 border border-flame/20 rounded px-4 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !apiKey}
            className="w-full bg-ember text-white-hot py-3 px-4 rounded font-medium uppercase tracking-wide hover:bg-flame transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-stone hover:text-white-hot text-sm transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

// Admin sidebar component
function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-soot border-r border-smoke transform transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-smoke">
          <Link href="/admin" className="text-xl font-bebas-neue text-white-hot tracking-wide">
            KoosDoos Admin
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-stone hover:text-white-hot"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors",
                  isActive
                    ? "bg-ember text-white-hot"
                    : "text-stone hover:text-white-hot hover:bg-smoke"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-smoke">
          <Link
            href="/"
            className="flex items-center gap-2 text-stone hover:text-white-hot text-sm mb-3 transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            View Store
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-stone hover:text-flame text-sm w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// Admin header component
function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  // Get page title from pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname.startsWith("/admin/products")) return "Products";
    if (pathname.startsWith("/admin/collections")) return "Collections";
    if (pathname.startsWith("/admin/orders")) return "Orders";
    if (pathname.startsWith("/admin/designs")) return "Custom Designs";
    return "Admin";
  };

  return (
    <header className="h-16 bg-soot border-b border-smoke flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-stone hover:text-white-hot"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium text-white-hot">{getPageTitle()}</h1>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check for stored auth on mount and hide site chrome
  useEffect(() => {
    setMounted(true);
    const storedKey = localStorage.getItem("koosdoos_admin_api_key");
    if (storedKey) {
      setApiKey(storedKey);
      setIsAuthenticated(true);
    }

    // Inject CSS to hide site chrome
    const styleId = 'admin-page-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        body > header,
        body > footer,
        body > a[href="#main-content"],
        body > div[role="dialog"],
        body > .fixed {
          display: none !important;
        }
        body > main {
          min-height: 100vh;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, []);

  const login = (key: string) => {
    setApiKey(key);
    setIsAuthenticated(true);
    localStorage.setItem("koosdoos_admin_api_key", key);
  };

  const logout = () => {
    setApiKey("");
    setIsAuthenticated(false);
    localStorage.removeItem("koosdoos_admin_api_key");
  };

  // Script to hide site chrome - runs immediately before React hydration
  const hideChromScript = `
    (function() {
      var style = document.createElement('style');
      style.id = 'admin-hide-chrome';
      style.textContent = 'body > header, body > footer, body > a[href="#main-content"], body > div[role="dialog"], body > .fixed { display: none !important; } body > main { min-height: 100vh; }';
      document.head.appendChild(style);
    })();
  `;

  // Always render the same structure to avoid hydration mismatch
  // The login form is the default state, auth check happens client-side
  const content = !mounted || !isAuthenticated ? (
    <LoginForm onLogin={login} />
  ) : (
    <AdminAuthContext.Provider value={{ isAuthenticated, apiKey, login, logout }}>
      <div className="min-h-screen bg-charcoal">
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="lg:ml-64 min-h-screen">
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );

  return (
    <>
      <Script id="admin-hide-chrome-script" strategy="beforeInteractive">
        {hideChromScript}
      </Script>
      {content}
    </>
  );
}
