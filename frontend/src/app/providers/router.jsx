import { Routes, Route } from 'react-router-dom'
import { HomePage, CartPage, DescriptionPage } from '@pages'

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/description/:id" element={<DescriptionPage />} />

    </Routes>
  )
}