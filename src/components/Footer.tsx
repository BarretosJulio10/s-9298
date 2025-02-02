import FooterLogo from "./footer/FooterLogo";
import FooterLinks from "./footer/FooterLinks";
import FooterBottom from "./footer/FooterBottom";

const productLinks = [
  { label: "Recursos", href: "#" },
  { label: "Empresas", href: "#" },
  { label: "Segurança", href: "#" },
  { label: "Preços", href: "#" },
];

const resourceLinks = [
  { label: "Documentação", href: "#" },
  { label: "API", href: "#" },
  { label: "Blog", href: "#" },
  { label: "FAQ", href: "#" },
];

const companyLinks = [
  { label: "Sobre", href: "#" },
  { label: "Carreiras", href: "#" },
  { label: "Contato", href: "#" },
  { label: "Legal", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-24 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <FooterLogo />
            <p className="text-accent text-sm">
              Economize tempo e dinheiro na AWS. Plataforma automatizada de otimização de custos na nuvem.
            </p>
          </div>
          
          <FooterLinks title="Produto" links={productLinks} />
          <FooterLinks title="Recursos" links={resourceLinks} />
          <FooterLinks title="Empresa" links={companyLinks} />
        </div>
        
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;