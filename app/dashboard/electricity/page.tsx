import { PremiumElectricityTopup } from "@/components/services/premium-electricity-topup"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"

export default function ElectricityPage() {
  return (
    <div className="bg-background text-foreground">
      <PremiumElectricityTopup />
      {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}
