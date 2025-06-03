import HelpRequestCard from "../components/HelpRequestCard";
import helpRequestsMock from "../data/mockPosts";


export default function FeedPage() {
    return (
      <div className="min-h-screen flex flex-row items-center  justify-center">

        return (
          <div className="space-y-6">
            {helpRequestsMock.map(helpRequestPost => (
              <HelpRequestCard 
                key={helpRequestPost.id} 
                helpRequest={helpRequestPost} 
                onAddComment={(content, parentCommentId) => {
                  // Implémenter la logique d’ajout de commentaire ici
                  console.log("Commentaire ajouté :", content, parentCommentId);
                }}
              />
            ))}
          </div>
        );

      </div>
    );
}