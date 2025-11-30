import { Header } from '@widgets/'
import { Footer } from '@widgets/'
import { ProductList } from '@shared/products'

export const HomePage = () => {
  return (
    <div className='HomePage'>
      <Header/>
      <div className='HomePageContent'>
        <ProductList/>
      </div>      
      <Footer/>
    </div>
  )
}