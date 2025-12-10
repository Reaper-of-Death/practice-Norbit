import { useState } from "react";
import { FilterContext } from "./filterContext"

export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        sortBy: 'default',
        minPrice: '',
        maxPrice: '',
        searchQuery: ''
    });

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    return (
        <FilterContext.Provider value={{ filters, updateFilters }}>
            {children}
        </FilterContext.Provider>
    );
};