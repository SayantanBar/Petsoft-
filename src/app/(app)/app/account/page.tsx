import H1 from "@/components/H1";
import ContentBlock from "@/components/content-block";

const AccountPage = () => {
  return (
    <main>
      <H1 className="py-8 text-white">Your Account</H1>
      <ContentBlock className="h-[500px] flex justify-center items-center">
        Logged in as...
      </ContentBlock>
    </main>
  );
};

export default AccountPage;
