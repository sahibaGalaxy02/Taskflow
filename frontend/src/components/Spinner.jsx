const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-12 h-12 border-3',
  };
  return (
    <div
      className={`${sizes[size]} ${className} rounded-full border-slate-700 border-t-indigo-500 animate-spin`}
    />
  );
};

export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-slate-500 text-sm font-body">Loading…</p>
    </div>
  </div>
);

export default Spinner;
