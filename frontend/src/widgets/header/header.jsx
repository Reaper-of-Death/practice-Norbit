export const Header = () => {
    return (
        <div className="Header">
            {/* Левая часть */}
            <div className="header-left">
                <div className="sort-dropdown">
                    <select className="sort-select">
                        <option value="">Сортировка</option>
                        <option value="asc">По возрастанию цены</option>
                        <option value="desc">По убыванию цены</option>
                    </select>
                </div>
                
                <div className="price-range">
                    <span>от </span>
                    <input type="number" placeholder="0" className="price-input" />
                    <span> до </span>
                    <input type="number" placeholder="10000" className="price-input" />
                    <span> ₽</span>
                </div>
            </div>

            {/* Правая часть */}
            <div className="header-right">
                <div className="search-box">
                    <input type="text" placeholder="Поиск" className="search-input" />
                </div>
                
                <button className="cart-button">
                    Корзина
                </button>
            </div>
        </div>
    )
}