import { Proposal } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface ProposalItemProps {
  proposal: Proposal;
}

const ProposalItem = ({ proposal }: ProposalItemProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline" className="bg-warning-50 text-warning-700 hover:bg-warning-50">Draft</Badge>;
      case "sent":
        return <Badge variant="outline" className="bg-success-50 text-success-700 hover:bg-success-50">Sent</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-success-50 text-success-700 hover:bg-success-50">Accepted</Badge>;
      case "declined":
        return <Badge variant="outline" className="bg-destructive-50 text-destructive-700 hover:bg-destructive-50">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updatedTime = formatDistanceToNow(new Date(proposal.updatedAt), { addSuffix: true });

  return (
    <li>
      <Link href={`/proposals/${proposal.id}`}>
        <a className="block hover:bg-neutral-50">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-primary-50 text-primary-700">
                    <FileText className="h-5 w-5" />
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-900">{proposal.title}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-neutral-500">Created by {proposal.createdBy}</p>
                    <span className="mx-1 text-neutral-300">•</span>
                    <p className="text-xs text-neutral-500">Updated {updatedTime}</p>
                  </div>
                </div>
              </div>
              <div className="ml-2 flex flex-col items-end">
                {getStatusBadge(proposal.status)}
                <span className="mt-1 text-xs text-neutral-500">
                  {proposal.views > 0 ? `${proposal.views} views` : "Not sent"}
                </span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
};

export default ProposalItem;
