const Spinner = () => {
  return (
    <div className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 shadow-sm">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-transparent"></div>
    </div>
  );
};

export default Spinner;
