import Link from "next/link";
import { useUser } from "@/lib/hooks/useUser";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="wrapper min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-[2rem] lg:flex-row">
        <div className="lg:w-[50%]">
          <h1 className="heading">DailyWins</h1>
          <p className="paragraph italic">
            {"Daily victories: celebrate life's little triumphs!"}
          </p>
          {user.email === "" ? (
            <>
              <div className="mt-[1rem]">
                <Link href="/register" className="button">
                  Get started
                </Link>
              </div>
              <div className="mt-[0.5rem]">
                <Link href="/login" className="paragraph">
                  Already have an account?{" "}
                  <span className="text-primary-600 font-bold">Log in</span>.
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-[1rem]">
              <Link href="/daily-wins" className="button">
                See my wins
              </Link>
            </div>
          )}
        </div>
        <div className="h-[12rem] lg:h-inherit lg:w-[50%] bg-[url('/images/win.jpg')] bg-cover bg-center" />
      </div>
      <div className="bg-maincontent p-[2rem] mt-[2rem] drop-shadow-xl">
        <h1 className="relative heading inline-block">
          <div className="absolute bg-primary h-[1rem] w-full bottom-[0]" />
          <span className="relative">Why DailyWins?</span>
        </h1>
        <p className="paragraph mt-[0.5rem]">
          In the book titled{" "}
          <span className="font-bold">The Gap and The Gain</span>, written by
          Dan Sullivan and Dr. Benjamin Hardy, it is said that what you do
          during the 60 minutes before bed has an enormous impact on your sleep
          quality, as well as the direction and quality of your next day.
        </p>
        <p className="paragraph mt-[0.5rem]">
          By writing your daily wins before bed, it will be a form of reflection
          of what you did in that day. As Pearson{"'s"} law states, when
          performance is measured, performance improves. When performance is
          measured and reported, the rate of improvement accelerates.{" "}
        </p>
      </div>
    </div>
  );
}
