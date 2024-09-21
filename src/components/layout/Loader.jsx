const Loader = () => {
  return (
    <div className="flex size-full h-screen items-center justify-center gap-3 text-black">
      <img
        src="/icons/loader.svg"
        alt="loader"
        width={32}
        height={32}
        className="animate-spin"
      />
      Loading...
    </div>
  );
};

export default Loader;
