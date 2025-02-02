import NavLogo from "./navbar/NavLogo";
import NavLinks from "./navbar/NavLinks";
import NavActions from "./navbar/NavActions";

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 px-6 py-4 bg-white/80 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <NavLogo />
        <NavLinks />
        <NavActions />
      </div>
    </nav>
  );
};

export default Navbar;