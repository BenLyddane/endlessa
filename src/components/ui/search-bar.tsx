import { Send } from "lucide-react";
import { cookies } from "next/headers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchBar: React.FC = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    "use server";
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inputValue = formData.get("input")?.toString() || "";

    cookies().set("lastSearch", inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 px-4 right-0 pb-4">
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex items-center max-w-4xl w-full"
        >
          <div className="w-full relative">
            <Input
              id="search"
              placeholder="Search your data..."
              type="text"
              className=""
            />
            <Button
              type="submit"
              className="absolute right-0 top-1/2 transform -translate-y-1/2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
