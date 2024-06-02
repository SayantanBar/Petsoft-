import H1 from "@/components/H1";
import ContentBlock from "@/components/content-block";
import SignOutBtn from "@/components/sign-out-btn";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
const AccountPage = async () => {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  return (
    <main>
      <H1 className="py-8 text-white">Your Account</H1>
      <ContentBlock className="h-[500px] flex flex-col gap-y-3 justify-center items-center">
        Logged in as {session.user.email}
        <SignOutBtn />
      </ContentBlock>
    </main>
  );
};

export default AccountPage;
