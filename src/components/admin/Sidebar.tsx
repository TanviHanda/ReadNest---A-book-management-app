import React from "react";
import Image from "next/image";
const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <div>
        <div className="logo">
          <Image
            src="/icons/admin/logo.svg"
            alt="logo"
            height={37}
            width={37}
          />
          <h1>ReadNest</h1>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
