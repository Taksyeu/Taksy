import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
