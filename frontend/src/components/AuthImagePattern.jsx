const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:block w-1/2 min-h-screen relative overflow-hidden bg-gradient-to-br from-primary via-primary/50 to-base-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient-xy"></div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-3xl font-bold mb-4 text-white">{title}</h2>
          <p className="text-white/80">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
