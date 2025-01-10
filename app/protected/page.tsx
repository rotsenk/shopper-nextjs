import OrderList from '@/components/OrderList';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data } = await supabase.from('order').select('*');

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <OrderList orders={data as any[]} />
    </div>
  );
}
