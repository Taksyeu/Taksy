export function Footer() {
  return (
    <footer className="w-full border-t border-black/10 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-black/60 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-black/70">© {new Date().getFullYear()} TAKSY. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a className="transition-colors hover:text-black" href="#how-it-works">
              How it works
            </a>
            <a className="transition-colors hover:text-black" href="#sponsors">
              Sponsors
            </a>
            <a className="transition-colors hover:text-black" href="#cta">
              Get started
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
