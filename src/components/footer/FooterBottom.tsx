const FooterBottom = () => {
  return (
    <div className="border-t border-white/10 mt-16 pt-8 text-accent text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2024 Antimetal. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Termos de Serviço
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;