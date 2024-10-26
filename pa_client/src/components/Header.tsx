import { useEffect, useRef } from "react";
import HeaderRoutes from "./HeaderRoutes";

function Header() {
  const scrollThreshold = 20;

  const lastScrollY = useRef<number>(0);
  const headerRef = useRef<HTMLElement>(null);

  function handleScroll(this: Window) {
    const currentScrollY = this.scrollY;

    if (headerRef.current) {
      if (currentScrollY > lastScrollY.current && currentScrollY >= scrollThreshold)
        headerRef.current.classList.add("hide");

      if (currentScrollY < scrollThreshold) {
        headerRef.current.classList.remove("hide");
      }
    }

    lastScrollY.current = currentScrollY;
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header ref={headerRef}>
      <nav>
        <HeaderRoutes />
      </nav>
    </header>
  );
}

export default Header;