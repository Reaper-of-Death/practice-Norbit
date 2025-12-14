import { useNavigate } from "react-router-dom";
import Logo from "@shared/image/Logo.png"

export const HeaderCart = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <div className="Header">
            {/* Центральная часть */}
            <div className="header-center">
                <button 
                    className="logo-button" 
                    onClick={handleLogoClick}
                    aria-label="Перейти на главную страницу"
                >
                    <img 
                        src={Logo} 
                        alt="Логотип сайта" 
                        className="logo-image"
                    />
                </button>
            </div>
            
        </div>
    )
}