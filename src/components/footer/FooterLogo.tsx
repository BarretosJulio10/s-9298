const FooterLogo = () => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-medium">Antimetal</span>
    </div>
  );
};

export default FooterLogo;