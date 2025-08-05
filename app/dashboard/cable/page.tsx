import { PremiumCableTopup } from "@/components/services/premium-cable-topup"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"

export default function CablePage() {
  return (
    <div className="bg-background text-foreground">
      <PremiumCableTopup />
                  {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}
