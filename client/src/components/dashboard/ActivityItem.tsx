import { Activity } from "@shared/schema";
import { 
  Check, 
  Edit, 
  Eye, 
  Layers,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItemProps {
  activity: Activity;
  isLast?: boolean;
}

const ActivityItem = ({ activity, isLast = false }: ActivityItemProps) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "sent":
        return (
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
            <Layers className="h-4 w-4 text-primary-600" />
          </div>
        );
      case "accepted":
        return (
          <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center ring-8 ring-white">
            <Check className="h-4 w-4 text-success-600" />
          </div>
        );
      case "created":
        return (
          <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center ring-8 ring-white">
            <Edit className="h-4 w-4 text-accent-600" />
          </div>
        );
      case "viewed":
        return (
          <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center ring-8 ring-white">
            <Eye className="h-4 w-4 text-neutral-600" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center ring-8 ring-white">
            <Clock className="h-4 w-4 text-neutral-600" />
          </div>
        );
    }
  };

  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });

  return (
    <li className={`relative ${!isLast ? 'pb-4' : ''}`}>
      <div className="relative flex items-start space-x-3">
        <div className="relative">
          {getActionIcon(activity.action)}
        </div>
        <div className="min-w-0 flex-1">
          <div>
            <div className="text-sm font-medium text-neutral-900">
              <a href="#" className="font-medium text-neutral-900">
                {activity.userId}
              </a>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500">
              {activity.description}
            </p>
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            {timeAgo}
          </div>
        </div>
      </div>
      {!isLast && <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-neutral-200"></div>}
    </li>
  );
};

export default ActivityItem;
