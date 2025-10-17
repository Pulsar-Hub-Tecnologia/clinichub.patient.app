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
  },
  isLoading: boolean;
}

export default function StatsCard({ card, isLoading }: StatsCardProps) {
  const Icon = card.icon
  return (

    <Card key={card.title} className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <p className="text-2xl font-bold">{card.value}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", card.bgColor)}>
            <Icon className={cn("h-6 w-6", card.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}