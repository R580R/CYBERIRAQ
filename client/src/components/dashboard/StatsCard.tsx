import { ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  changeValue?: string;
  changeDirection?: "up" | "down";
  changeText?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  changeValue,
  changeDirection = "up",
  changeText = "vs last month",
}: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            <div className={`h-5 w-5 ${iconColor}`}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-neutral-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        {changeValue && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className={`text-sm ${changeDirection === 'up' ? 'text-success-600' : 'text-destructive'} flex items-center`}>
                {changeDirection === 'up' ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowUp className="mr-1 h-3 w-3 transform rotate-180" />
                )}
                <span>{changeValue}</span>
              </div>
              <div className="text-sm text-neutral-500">{changeText}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
