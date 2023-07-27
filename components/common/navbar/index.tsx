import Link from "next/link";
import { useUserWithFetch } from "@/lib/hooks/useUser";
import { Menu } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user, setUser } = useUserWithFetch();

  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 w-full bg-maincontent drop-shadow-md">
      <div className="wrapper px-[2rem] h-[4rem] flex items-center justify-between">
        <Link href="/" className="heading font-bold">
          DailyWins
        </Link>
        {user.name && (
          <Menu>
            <Menu.Target>
              <button className="button">{user.name}</button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  notifications.show({
                    message: "See you in another time!",
                    color: "green",
                    withCloseButton: false,
                  });
                }}
              >
                <button className="paragraph">Log out</button>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </div>
  );
}

export function NavMargin() {
  return <div className="mt-[4rem]" />;
}
