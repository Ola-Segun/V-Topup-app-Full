import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { AdminTransactionsManager } from "@/components/admin/admin-transactions-manager"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminTransactionsPage() {
  // Only check auth if Supabase is configured
  if (isSupabaseConfigured) {
    const supabase = await createClient()
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        redirect("/auth/login")
      }
    }
  }

  return (
    <AdminLayout>
      <AdminTransactionsManager />
    </AdminLayout>
  )
}
