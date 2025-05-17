import { Link } from 'react-router-dom';
import "@/index.css"

type NavbarLinkProps = {
    to : string
    children : React.ReactNode
    className? : string
}

export const NavbarLink = ({to, children, className = ''} : NavbarLinkProps) => (
    <Link
        to={to}
        className = 'link text-[14px]'
    >
        {children}
    </Link>
)