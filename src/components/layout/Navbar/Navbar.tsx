import { Link, useNavigate } from "react-router-dom";
import { NavbarLink } from "./NavbarLink";
import logo from '@assets/logo.png'
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { CalendarCheck, HandHelping, LifeBuoy, MessageCircle, Settings2, User, UserCircle } from "lucide-react";
import { TbLogout2 } from "react-icons/tb";
import { logout } from "../../../services/authService";

export const Navbar = () => {

    const { isAuthenticated, setIsAuthenticated } = useAuth()

    const navigate = useNavigate();

    // State pour gérer l'ouverture du menu utilisateur
    const [ dropDownOpen, setDropDownOpen] = useState(false);

    // Ref pour fermer le menu au clic en dehors
    const dropDownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setDropDownOpen(false);
        logout();
        navigate("/");
    }

    // Gestion fermeture du fropdown au clic en dehors
    useEffect (() => {
        
        const handleClickOutside = (event: MouseEvent) =>{
            if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)){
                setDropDownOpen(false)
            }
        };

        if(dropDownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [dropDownOpen]);


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
                        <NavbarLink to="/" className="">
                            {isAuthenticated ? (
                                <>
                                </>
                            ) : (<></>)}
                            Accueil
                        </NavbarLink>

                        {
                            isAuthenticated 
                            ? (
                                <>
                                    <Link
                                        to="/ask-help"
                                        className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-primary-darkblue font-semibold overflow-hidden"
                                    >
                                        {/* Fond doux au survol */}
                                        <span className="absolute inset-0 bg-primary-light opacity-0 group-hover:opacity-100 transition duration-300 rounded-xl z-0"></span>

                                        {/* Icône */}
                                        <HandHelping className="w-5 h-5 z-10" />

                                        {/* Texte avec soulignement animé */}
                                        <span className="z-10 relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary-darkblue after:transition-all after:duration-300 group-hover:after:w-full">
                                            Besoin d’un coup de pouce ?
                                        </span>
                                    </Link>
                                    <NavbarLink to="/events">
                                        <CalendarCheck className="inline-block mr-1 h-5 w-5"/>
                                        Évents
                                    </NavbarLink>
                                    <NavbarLink to="/discussions">
                                        <MessageCircle className="inline-block mr-1 h-5 w-5"/>
                                        Messages
                                    </NavbarLink>
                                </>
                            )
                            : (
                                <>
                                    <NavbarLink to="/about" className="">À propos</NavbarLink>
                                    <NavbarLink to="/register" className="">S'inscrire</NavbarLink>
                                </>
                            )
                        }                        
                    </nav>

                    {/* Salutaion et Menu Utilisateur */}
                    {
                        isAuthenticated 
                        ? (
                            <>
                                {/* Message de bienvenue */}
                                <span className="hidden mr-4 text-sm font-medium text-secondary-lightgray ">
                                    Bonjour {/*user.username*/}... !
                                </span>


                                {/* Menu utilisateur */}
                                <div className="relative" ref={dropDownRef}>
                                    <button
                                        onClick = {() => setDropDownOpen(!dropDownOpen)}
                                        className="group flex items-center rounded-full hover:bg-hover-green p-2 focus:outline-none "
                                        aria-haspopup="true"
                                        aria-expanded={dropDownOpen}
                                    >
                                        <User className="h-6 w-6 text-primary-green  group-hover:text-background-ow"/>
                                    </button>

                                    {
                                        dropDownOpen && (
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-primary-darkblue rounded-lg shadow-lg py-1 z-50">

                                                <Link 
                                                    to="/profile" 
                                                    //{/*className="link"*/}
                                                    className="link"
                                                    onClick = {() => setDropDownOpen(false)}
                                                > 
                                                    <UserCircle className="mr-2 h-4 w-4"/>
                                                    Mon profil
                                                </Link>
                                                <Link 
                                                    to="/myHelpRequests"
                                                    className="link"
                                                    onClick = {() => setDropDownOpen(false)}
                                                >
                                                    <LifeBuoy className="mr-2 h-5 w-5" />
                                                    Mes demandes d'aides
                                                </Link>
                                                <Link 
                                                    to="/settings" 
                                                    className="link"
                                                    onClick = {() => setDropDownOpen(false)}
                                                > 
                                                    <Settings2 className="mr-2 h-4 w-4"/>
                                                    Paramètres
                                                </Link>
                                                <button 
                                                    className="link"
                                                    onClick = {handleLogout}
                                                >
                                                    <TbLogout2 className="mr-2 h-4 w-4"/>
                                                    Se déconnecter
                                                </button>

                                            </div>
                                        )
                                    }

                                </div>
                            </>
                        )

                        : (
                            <>
                                <Link to="/login" className="btn btn-base">
                                    Se connecter
                                </Link>
                            </>
                        )
                    }

                </div>

            </div>
        </header>
    )

};