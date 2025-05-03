
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "./landing-page";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <LandingPage session={session}/>;
}