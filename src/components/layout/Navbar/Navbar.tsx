import { Link } from "react-router-dom";
import { NavbarLink } from "./NavbarLink";
import logo from '@assets/logo.png'

export const Navbar = () => {

    return (
        <header className="top-0 z-50">
            <div className="container mx-auto m-3 mb-0 px-6 flex items-center justify-between">

                {/*partie gauche - Logo - Texte*/}
                <div className="flex items-center space-x-4 flex-shrink-0">
                    <img
                        src={logo}
                        alt="Logo Solidarix"
                        className="h-15 object-contain self-center"
                    />
                    <div className="flex flex-col">
                        <span className="text-primary-darkblue text-4xl font-bold">Solidarix</span>
                        <span className="text-primary-darkblue text-sm font-semibold">La solidarité au coeur de votre quartier</span>
                    </div>
                </div>

                {/* partie droite - liens*/}
                <div className="flex items-center gap-6">
                    <nav className="flex gap-6">
                        <NavbarLink to="/" className="">Accueil</NavbarLink>
                        <NavbarLink to="/about" className="">À propos</NavbarLink>
                        <NavbarLink to="/register" className="">S'inscrire</NavbarLink>
                    </nav>
                    <Link to="/login" className="btn btn-base">
                        Se connecter
                    </Link>
                </div>

            </div>
        </header>
    )

};