import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export function Layout({ children, showNavigation = true }: LayoutProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home first
    if (window.location.pathname !== '/') {
      navigate({
         to: '/',
         hash: `#${sectionId}`,
         });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const goHome = () => {
    navigate({ to: "/" });
    setMobileMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-white"
      style={{ 
        fontFamily: "Almarai, sans-serif",
        position: "relative",
        zIndex: 1
      }}
      dir="rtl"
    >
      {/* Header */}
      <header className="bg-white text-black py-3 px-6 border-1 border-black sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={goHome}
            className="text-2xl font-black hover:text-yellow-500 transition-colors"
          >
           صاكادو 
          </button>

          {showNavigation && (
            <nav className="hidden md:flex space-x-8 space-x-reverse gap-8 font-bold">
              <button
                onClick={() => scrollToSection("specs")}
                className="hover:text-yellow-500 transition-colors"
              >
                المواصفات
              </button>
              <button
                onClick={() => scrollToSection("buy")}
                className="hover:text-yellow-500 transition-colors"
              >
                اشتر الآن
              </button>
            </nav>
          )}

          {!showNavigation && (
            <Button
              variant="ghost"
              className="hidden md:block font-bold hover:text-yellow-500 transition-colors"
              onClick={goHome}
            >
              العودة للرئيسية
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-black">
            <div className="flex flex-col space-y-4 font-bold">
              {showNavigation ? (
                <>
                  <button
                    onClick={() => scrollToSection("specs")}
                    className="text-right hover:text-yellow-500 transition-colors"
                  >
                    المواصفات
                  </button>
                  <button
                    onClick={() => scrollToSection("buy")}
                    className="text-right hover:text-yellow-500 transition-colors"
                  >
                    اشتر الآن
                  </button>
                </>
              ) : (
                <button
                  onClick={goHome}
                  className="text-right hover:text-yellow-500 transition-colors"
                >
                  العودة للرئيسية
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      <div className="w-full border-b border-black flex-shrink-0"></div>

      {/* Main Content*/}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer*/}
      <footer className="bg-black text-white py-8 px-6 border-t-4 border-black flex-shrink-0 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-black mb-4">صاكادو</div>
          <div className="font-bold">
            © 2025 صاكادو. نثور على طريقة الحمل منذ اليوم.
          </div>
        </div>
      </footer>
    </div>
  );
}