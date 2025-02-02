const HeroTag = () => {
  return (
    <div className="flex items-center gap-2 justify-center">
      <div className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center">
        <span className="text-sm">$</span>
      </div>
      <span className="text-sm text-secondary">Pagamentos Recorrentes</span>
    </div>
  );
};

export default HeroTag;