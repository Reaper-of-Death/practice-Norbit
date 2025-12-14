import { useFilters } from "@/shared/filterContext/filterContext";
import { useNavigate } from "react-router-dom";
import Logo from "@/shared/image/Logo.png"

export const Header = () => {
    const { filters, updateFilters } = useFilters();
    const navigate = useNavigate();

    const handleSortChange = (e) => {
        updateFilters({ sortBy: e.target.value });
    };

    const handleMinPriceChange = (e) => {
        updateFilters({ minPrice: e.target.value });
    };

    const handleMaxPriceChange = (e) => {
        updateFilters({ maxPrice: e.target.value });
    };

    const handleSearchChange = (e) => {
        updateFilters({ searchQuery: e.target.value });
    };

    const handleCartClick = () => {
        navigate("/cart")
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <div className="Header">
            {/* Левая часть */}
            <div className="header-left">
                <div className="sort-dropdown">
                    <select 
                        className="sort-select"
                        value={filters.sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="default">Сортировка</option>
                        <option value="price_asc">По возрастанию цены</option>
                        <option value="price_desc">По убыванию цены</option>
                        <option value="discount">Со скидкой</option>
                        <option value="name_asc">По названию (А-Я)</option>
                        <option value="name_desc">По названию (Я-А)</option>
                    </select>
                </div>
                
                <div className="price-range">
                    <span>от </span>
                    <input 
                        type="number" 
                        placeholder="0" 
                        className="price-input" 
                        value={filters.minPrice}
                        onChange={handleMinPriceChange}
                    />
                    <span> до </span>
                    <input 
                        type="number" 
                        placeholder="10000" 
                        className="price-input" 
                        value={filters.maxPrice}
                        onChange={handleMaxPriceChange}
                    />
                    <span> ₽</span>
                </div>
            </div>

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
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="Поиск" 
                        className="search-input" 
                        value={filters.searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                
                <button className="cart-button" onClick={handleCartClick}>
                    Корзина
                </button>
            </div>
        </div>
    )
}