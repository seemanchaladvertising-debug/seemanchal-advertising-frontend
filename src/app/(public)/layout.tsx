import Footer from "@/components/public/Footer";
import Header from "@/components/public/Header";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import EnquiryPopup from "@/components/public/EnquiryPopup";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <EnquiryPopup />
    </div>
  );
}
