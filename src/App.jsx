import { createElement } from "react";
import { FiCodepen, FiCoffee, FiFacebook, FiGithub, FiGlobe, FiHeart, FiLinkedin, FiMail, FiStar, FiYoutube } from "react-icons/fi";
import TabsPro from "./tabsPro";

const socialLinks = [
    { label: "Portfolio", href: "https://www.ashishranjan.net/", icon: FiGlobe },
    { label: "GitHub", href: "https://github.com/a2rp", icon: FiGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: FiCodepen },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: FiLinkedin },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: FiFacebook },
    { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FiYoutube },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: FiMail },
];
const supportLinks = [
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: FiHeart },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/a2rp", icon: FiCoffee },
    { label: "Patreon", href: "https://www.patreon.com/a2rp", icon: FiStar },
];

function Header() {
    return <header className="site-header">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Tabs Pro home">
            <img src={import.meta.env.BASE_URL + "logo.png"} alt="Ashish Ranjan logo" />
            <span><small>React component</small><strong>Tabs Pro</strong></span>
        </a>
        <a className="header-link" href="https://github.com/a2rp/tabs-pro" target="_blank" rel="noopener noreferrer">
            <FiGithub aria-hidden="true" /><span>View source</span>
        </a>
    </header>;
}
function LinkGroup({ links }) {
    return <div className="footer-links" aria-label="External links">
        {links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            aria-label={link.label} title={link.label}>
            {createElement(link.icon, { "aria-hidden": true })}
        </a>)}
    </div>;
}
function Footer() {
    return <footer className="site-footer"><div className="footer-inner">
        <p>Copyright &copy; {new Date().getFullYear()}{" "}
            <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a>
        </p>
        <div className="footer-groups"><LinkGroup links={socialLinks} /><LinkGroup links={supportLinks} /></div>
    </div></footer>;
}
const App = () => <div className="app-shell">
    <Header />
    <main className="page-content"><TabsPro /></main>
    <Footer />
</div>;
export default App;
