// import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import Header from "@/components/Header";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen max-w-full px-5">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by JankiKumari
      </div>
    </div>
  );
};

export default AppLayout;
