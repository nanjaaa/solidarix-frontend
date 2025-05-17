import heroImage from '@assets/hero2.png'

export default function HeroSection(){
    return (

        <section className='relative bg-background-ow px-6 md:px-12 py-0 flex flex-col md:flex-row items-center justify-between overflow-visible'>

            {/* Texte à gauche */}
            <div className='max-w-2xl z-10 space-y-6'>
                <h1 className='text-4xl md:text-5xl text-primary-darkblue font-bold'>
                    Besoin d'un coup de main?<br/>Ou prêt à aider?
                </h1>

                <p className='text-secondary-lightgray text-lg'>
                    Solidarix met en relation les habitants d’un même quariter pour s’entraider au quotidien : aide aux courses, soutien scolaire, petit travaux, garde d’animaux, et plus encore.
                </p>

                <button className="btn btn-large">Démarrer</button>
            </div>

            {/* Image à droite */}
            <div className='relative mt-12 md:mt-0 mb-1'>
                <img
                    src={heroImage}
                    alt='Illustration solidarix'
                    className='w-[300px] md:w-[-500px] object-contain relative z-0 md:translate-y12'
                />
            </div>

        </section>

    );
}