import { Header } from '@widgets/'
import { Footer } from '@widgets/'
import { ProductList } from '@shared/products'
import { FilterProvider } from '@/shared/filterContext/filterProvader'

export const HomePage = () => {
  return (
    <FilterProvider>
      <div className='HomePage'>
        <Header/>
        <div className='HomePageContent'>
          <ProductList/>
        </div>      
        <Footer/>
      </div>
    </FilterProvider>
  )
}