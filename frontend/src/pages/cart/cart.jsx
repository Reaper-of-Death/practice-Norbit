import { HeaderCart, Footer } from "@widgets/";

export const CartPage = () => {
    return(
        <div className="CartPage">
            <HeaderCart/>

            <div className="CartPageContent">
                Content
            </div>

            <Footer/>
        </div>
    )
}