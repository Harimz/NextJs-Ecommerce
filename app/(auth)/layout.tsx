import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-lg w-[90%] mx-auto mt-10">{children}</div>;
};

export default AuthLayout;
