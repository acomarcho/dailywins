import Link from "next/link";
import { useUserWithFetch } from "@/lib/hooks/useUser";

export default function Navbar() {
  const { user } = useUserWithFetch();

  return (
    <div className="fixed top-0 left-0 w-full bg-maincontent drop-shadow-md">
      <div className="wrapper px-[2rem] h-[4rem] flex items-center justify-between">
        <Link href="/" className="heading font-bold">
          DailyWins
        </Link>
        {user.name && <button className="button">{user.name}</button>}
      </div>
    </div>
  );
}

export function NavMargin() {
  return <div className="mt-[4rem]" />;
}
