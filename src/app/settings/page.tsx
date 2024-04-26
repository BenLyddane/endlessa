import { createClient } from "@/utils/supabase/server";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface UserData {
  user: {
    user_metadata: {
      username: string;
    };
    email: string;
  };
}

const Settings = async () => {
  const supabase = createClient();
  const { data, error }: { data: UserData | null; error: any } =
    await supabase.auth.getUser();

  const updateUsername = async (formData: FormData) => {
    "use server";
    const username = formData.get("username")?.toString() || "";
    const { data, error } = await supabase.auth.updateUser({
      data: { username },
    });
  };

  const updateEmail = async (formData: FormData) => {
    "use server";
    const email = formData.get("email")?.toString() || "";
    const { data, error } = await supabase.auth.updateUser({
      email,
    });
  };

  const updatePassword = async (formData: FormData) => {
    "use server";
    const password = formData.get("password")?.toString() || "";
    const newPassword = formData.get("newPassword")?.toString() || "";
    const { data, error } = await supabase.auth.updateUser({
      password,
      newPassword,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col gap-4">
          <form action={updateUsername} className="flex flex-col gap-2">
            <div className="flex flex-col py-4 ">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                defaultValue={data?.user.user_metadata.username || ""}
              />
            </div>
            <button type="submit" className="self-center">
              Update Username
            </button>
          </form>
          <form action={updateEmail} className="flex flex-col gap-2">
            <div className="flex flex-col">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                defaultValue={data?.user.email || ""}
              />
            </div>
            <button type="submit" className="self-center">
              Update Email
            </button>
          </form>
          <form action={updatePassword} className="flex flex-col gap-2">
            <div className="flex flex-col">
              <Label htmlFor="password">Current Password</Label>
              <Input id="password" name="password" type="password" />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" />
            </div>
            <button type="submit" className="self-center">
              Update Password
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
