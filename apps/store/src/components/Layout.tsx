import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTheme } from "@/lib/theme";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function Layout({ children, showNavigation = true }: LayoutProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = getTheme();
  const isDark = theme.mode === 'dark';

  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      navigate({ to: "/", hash: `#${sectionId}` });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const goHome = () => {
    navigate({ to: "/" });
    setMobileMenuOpen(false);
  };

  // ── Brutalist (light) ─────────────────────────────────────────────────────
  if (!isDark) {
    return (
      <div
        className="min-h-screen flex flex-col bg-white"
        style={{ fontFamily: "Almarai, sans-serif", position: "relative", zIndex: 1 }}
        dir="rtl"
      >
        <header className="bg-white text-black py-3 px-6 border-1 border-black sticky top-0 z-50 flex-shrink-0">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button onClick={goHome} className="text-2xl font-black hover:text-yellow-500 transition-colors">
              <img src="/assets/logo/7aba_store_logo_i1.svg" alt="Logo" className="h-16 w-auto" />
            </button>

            {showNavigation && (
              <nav className="hidden md:flex space-x-8 space-x-reverse gap-8 font-bold">
                <button onClick={() => scrollToSection("specs")} className="hover:text-yellow-500 transition-colors">المواصفات</button>
                <button onClick={() => scrollToSection("buy")} className="hover:text-yellow-500 transition-colors">اشتر الآن</button>
              </nav>
            )}

            {!showNavigation && (
              <Button variant="ghost" className="hidden md:block font-bold hover:text-yellow-500 transition-colors" onClick={goHome}>
                العودة للرئيسية
              </Button>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-black">
              <div className="flex flex-col space-y-4 font-bold">
                {showNavigation ? (
                  <>
                    <button onClick={() => scrollToSection("specs")} className="text-right hover:text-yellow-500 transition-colors">المواصفات</button>
                    <button onClick={() => scrollToSection("buy")} className="text-right hover:text-yellow-500 transition-colors">اشتر الآن</button>
                  </>
                ) : (
                  <button onClick={goHome} className="text-right hover:text-yellow-500 transition-colors">العودة للرئيسية</button>
                )}
              </div>
            </nav>
          )}
        </header>

        <div className="w-full border-b border-black flex-shrink-0"></div>
        <main className="flex-1">{children}</main>

        <footer className="bg-black text-white py-8 px-6 border-t-4 border-black flex-shrink-0 mt-auto">
          <div className="max-w-6xl mx-auto text-center">
            <img src="/assets/logo/7aba_store_logo_i1.svg" alt="Logo" className="h-16 w-auto filter invert mx-auto" />
            <p className="font-bold">جميع الحقوق محفوظة لـ <a href="/">حبة ستور</a> © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    );
  }

  // ── Acquisition (dark) ────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: theme.typography.fontFamily, backgroundColor: theme.colors.background, color: theme.colors.foreground, position: "relative", zIndex: 1 }}
      dir={theme.direction}
    >
      <header
        className="py-3 px-6 sticky top-0 z-50 flex-shrink-0"
        style={{ backgroundColor: theme.colors.muted, borderBottom: `1px solid ${theme.colors.border}` }}
      >
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button onClick={goHome} className="text-2xl font-black transition-colors">
            <img src="/assets/logo/7aba_store_logo_i1.svg" alt="Logo" className="h-16 w-auto filter invert" />
          </button>

          {showNavigation && (
            <nav className="hidden md:flex gap-8 font-bold">
              <button onClick={() => scrollToSection("specs")} style={{ color: theme.colors.foreground }} className="transition-colors hover:opacity-70">المواصفات</button>
              <button
                onClick={() => scrollToSection("buy")}
                className="px-4 py-2 font-black transition-all"
                style={{ backgroundColor: theme.colors.accent, color: '#000', borderRadius: theme.effects.borderRadius }}
              >
                اشتر الآن
              </button>
            </nav>
          )}

          {!showNavigation && (
            <Button variant="ghost" className="hidden md:block font-bold" style={{ color: theme.colors.foreground }} onClick={goHome}>
              العودة للرئيسية
            </Button>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" style={{ color: theme.colors.foreground }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4" style={{ borderTop: `1px solid ${theme.colors.border}` }}>
            <div className="flex flex-col space-y-4 font-bold">
              {showNavigation ? (
                <>
                  <button onClick={() => scrollToSection("specs")} style={{ color: theme.colors.foreground }} className="text-right">المواصفات</button>
                  <button onClick={() => scrollToSection("buy")} style={{ color: theme.colors.accent }} className="text-right">اشتر الآن</button>
                </>
              ) : (
                <button onClick={goHome} style={{ color: theme.colors.foreground }} className="text-right">العودة للرئيسية</button>
              )}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="py-8 px-6 flex-shrink-0 mt-auto" style={{ backgroundColor: '#050505', borderTop: `1px solid ${theme.colors.border}` }}>
        <div className="max-w-6xl mx-auto text-center">
          <img src="/assets/logo/7aba_store_logo_i1.svg" alt="Logo" className="h-16 w-auto filter invert mx-auto" />
          <p className="font-bold" style={{ color: '#6b7280' }}>جميع الحقوق محفوظة لـ <a href="/" style={{ color: theme.colors.accent }}>حبة ستور</a> © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
