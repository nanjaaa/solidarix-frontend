import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
    return (

        <footer className="bg-background-ow text-primary-darkblue shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0)]">
            <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm pt-4 pb-10">

                {/* Copyright */}
                <div className="text-center md:text-left">
                    © 2025 Solidarix
                </div>

                {/* Liens légaux */}
                <div className="flex gap-6 flex-wrap justify-center">
                    <a href="/legalNotices" className="transition-transform hover:scale-110">Mentions légales</a>
                    <a href="/privacy" className="transition-transform hover:scale-110">Confidentialités</a>
                    <a href="/termsOfuse" className="transition-transform hover:scale-110">CGU</a>
                </div>

                {/* Social Media Links */}
                <div className="flex gap-6 justify-center">
                    <a href="#"><FaFacebook className="w-5 h-5 transition-transform hover:scale-110"/></a>
                    <a href="#"><FaInstagram className="w-5 h-5 transition-transform hover:scale-110"/></a>
                    <a href="#"><FaTwitter className="w-5 h-5 transition-transform hover:scale-110"/></a>
                    <a href="#"><FaLinkedin className="w-5 h-5 transition-transform hover:scale-110"/></a>
                </div>

            </div>
        </footer>

    );
}