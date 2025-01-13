import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ChatUI from "@/components/ChatUI";

export default async function Chat() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    return (
        <ChatUI userId={user.id} />
    );

}