import Footer from "@/components/website/footer";
import Navbar from "@/components/website/navbar";
import React from "react";

const WebsiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
