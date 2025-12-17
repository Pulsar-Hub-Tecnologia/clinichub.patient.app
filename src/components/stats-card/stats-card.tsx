import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, LucideProps } from "lucide-react";

interface StatsCardProps {
  card: {
    title: string;
    value: string | number;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    bgColor: string;
    iconColor: string;
    change?: string;
  },
  isLoading: boolean;
}

export default function StatsCard({ card, isLoading }: StatsCardProps) {
  const Icon = card.icon;

  const getChangeBadgeColor = (change?: string) => {
    if (!change) return "";
    if (change.startsWith("+")) return "text-green-600 bg-green-50";
    if (change.startsWith("-")) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <Card key={card.title} className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className={cn("p-3 rounded-full", card.bgColor)}>
            <Icon className={cn("h-6 w-6", card.iconColor)} />
          </div>
          {card.change && (
            <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", getChangeBadgeColor(card.change))}>
              {card.change}
            </span>
          )}
        </div>
        <div className="mt-4">
          {isLoading ? (
            <Loader2 className="animate-spin h-8 w-8" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">{card.title}</p>
        </div>
      </CardContent>
    </Card>
  );
}
