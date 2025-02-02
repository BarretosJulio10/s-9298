const NavLinks = () => {
  return (
    <div className="hidden md:flex items-center gap-8">
      <a href="#enterprise" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Empresas</a>
      <a href="#pricing" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Preços</a>
      <a href="#docs" className="text-[#141413] hover:text-[#141413]/80 transition-colors">Documentação</a>
      <a href="#faq" className="text-[#141413] hover:text-[#141413]/80 transition-colors">FAQ</a>
    </div>
  );
};

export default NavLinks;