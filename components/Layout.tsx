import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({
  children,
  title,
  hideFooter = false,
  hideHeader = false,
}: {
  children: React.ReactNode;
  title: string;
  hideFooter?: boolean;
  hideHeader?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-row min-h-screen bg-gray-100 text-gray-800">
        <Sidebar />
        <main className="main flex flex-col flex-grow -ml-64 md:ml-0 transition-all duration-150 ease-in">
          {!hideHeader && <Header title={title} />}
          <div className="main-content flex flex-col flex-grow p-4">
            {children}
          </div>
          {!hideFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}
