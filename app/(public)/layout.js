import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { ToastContainer } from "react-toastify";

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      <Footer />
    </div>
  );
}
