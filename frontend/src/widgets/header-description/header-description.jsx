import { useNavigate } from "react-router-dom";
import Logo from "@shared/image/Logo.png"

export const HeaderDescription = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleCartClick = () => {
        navigate("/cart")
    };

    return (
        <div className="Header">
            <div className="header-left"></div>

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

            {/* Правая часть */}
            <div className="header-right">                
                <button className="cart-button" onClick={handleCartClick}>
                    Корзина
                </button>
            </div>
            
        </div>
    )
}