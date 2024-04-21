import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Error = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1>Error</h1>
      <Link href="/auth/login">
        <Button variant="default">Sign In</Button>
      </Link>
    </div>
  );
};

export default Error;
