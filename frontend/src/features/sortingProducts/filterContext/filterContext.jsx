import React, { createContext, useContext } from 'react';

export const FilterContext = createContext();

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilters must be used within FilterProvider');
    }
    return context;
};