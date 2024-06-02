import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { logIn, signUp } from "@/actions/actions";

type AuthFormProps = {
  type: "signup" | "login";
};

const AuthForm = ({ type }: AuthFormProps) => {
  return (
    <form action={type === "login" ? logIn : signUp}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" />
      </div>
      <div className="space-y-1 mt-2 mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" />
      </div>
      <Button>{type === "login" ? "Log in" : "Sign up"}</Button>
    </form>
  );
};

export default AuthForm;
