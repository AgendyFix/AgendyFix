import { Banknote, CreditCard, Landmark, type LucideProps } from "lucide-react";
import type { PaymentMethodCode } from "@/lib/academies";

const ICONS: Record<PaymentMethodCode, React.ComponentType<LucideProps>> = {
  cash: Banknote,
  transfer: Landmark,
  card: CreditCard,
};

export function PaymentMethodIcon({
  code,
  className = "h-5 w-5",
}: {
  code: PaymentMethodCode;
  className?: string;
}) {
  const Icon = ICONS[code];
  return <Icon className={className} aria-hidden />;
}
