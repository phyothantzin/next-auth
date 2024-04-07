import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Link href="/auth/register">
      <Button variant="default">Sign Up</Button>
    </Link>
  );
}
