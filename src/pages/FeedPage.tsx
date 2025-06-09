import { useEffect, useState } from "react";
import HelpRequestCard from "../components/HelpRequestCard";
import type { PublicHelpRequestDto } from "../types/helpRequest";
import { fetchHelpRequestsFeed } from "../services/helpRequest";

export default function FeedPage() {
  const [helpRequests, setHelpRequests] = useState<PublicHelpRequestDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHelpRequestsFeed();
        setHelpRequests(data);
      } catch (error) {
        console.error("Erreur lors du chargement du fil d'aide :", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex flex-row items-center justify-center">
      <div className="space-y-6">
        {helpRequests.map(helpRequestPost => (
          <HelpRequestCard 
            key={helpRequestPost.id} 
            helpRequest={helpRequestPost} 
            onAddComment={(content, parentCommentId) => {
              console.log("Commentaire ajouté :", content, parentCommentId);
            }}
          />
        ))}
      </div>
    </div>
  );
}
