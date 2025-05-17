import { CheckCircle, UserPlus, HelpCircle, Handshake, MessageCircle, Users, Leaf } from "lucide-react"

export default function Infocards() {
    return (

        <section className="bg-background-ow px-0 md:px-12 py-3">
            <div className="grid md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">

                {/*Carte 1: Commen ça marche?*/}
                
                <div className="card">
                    <h3 className="text-xl font-bold text-primary-darkblue mb-2">
                        Comment ça marche?
                    </h3>

                    <div className="flex items-center gap-3">
                        <UserPlus className="text-primary-green w-10 h-10mt-1" />
                        <div>
                            <h4 className="font-semibold text-primary-darkblue">Créer un compte</h4>
                            <p className="text-secondary-lightgray text-sm">En quelques clics, rejoignez votre communauté locale et commencez à participer.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <HelpCircle className="text-primary-green w-10 h-10 mt-1" />
                        <div>
                            <h4 className="font-semibold text-primary-darkblue">Demandez de l’aide</h4>
                            <p className="text-text-secondary-lightgray text-sm">Publiez vos besoins précis, visibles par les membres proches de chez vous.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Handshake className="text-primary-green w-10 h-10 mt-1" />
                        <div>
                            <h4 className="font-semibold text-primary-darkblue">Proposez de l’aide</h4>
                            <p className="text-text-secondary-lightgray text-sm">Échangez avec vos voisins et apportez votre aide en fonction de vos disponibilités.</p>
                        </div>
                    </div>
                </div>


                {/* Carte 2 : Une entraide de confiance */}
                <div className="card">
                    <h3 className="text-xl font-bold text-primary-darkblue mb-4">Une entraide de confiance</h3>

                    <p className="text-secondary-lightgray text-sm mb-4">
                        Sur Solidarix, tout est pensé pour créer un climat de confiance entre voisins.
                    </p>

                    <ul className="space-y-3">
                        {[
                        "Profils vérifiés",
                        "Messagerie sécurisée",
                        "Signalement et modération",
                        "Système d’évaluation"
                        ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="text-primary-green w-7 h-7 mt-1" />
                            <span className="text-secondary-lightgray text-sm">{item}</span>
                        </li>
                        ))}
                    </ul>
                </div>


                {/* Carte 3 : Un impact local */}
                <div className="card">
                    <h3 className="text-xl font-bold text-primary-darkblue mb-4">Un impact local, visible</h3>

                    <p className="text-secondary-lightgray text-sm">
                        {/*Grâce à Solidarix, développez des liens de proximité et participez à renforcer la solidarité dans votre communauté.*/}
                        Chaque échange renforce les liens entre voisins. Solidarix favorise un réseau d’entraide durable et de proximité.
                    </p>

                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <MessageCircle className="text-primary-green w-7 h-7 mt-1" />
                            <span className="text-secondary-lightgray text-sm">
                                +1200 aides échangées dans votre quartier
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Users className="text-primary-green w-7 h-7 mt-1" />
                            <span className="text-secondary-lightgray text-sm">
                                Des rencontres qui créent du lien durable
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Leaf className="text-primary-green w-7 h-7 mt-1" />
                            <span className="text-secondary-lightgray text-sm">
                                Initiatives solidaires valorisées dans votre profil
                            </span>
                        </li>
                    </ul>    

                </div>

            </div>
        </section>

    )
}