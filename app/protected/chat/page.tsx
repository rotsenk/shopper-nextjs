import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Chat from '@/components/Chat';

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <Chat userId={user.id} email={user.email} />
  )
}