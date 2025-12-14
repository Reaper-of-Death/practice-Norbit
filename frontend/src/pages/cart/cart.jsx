import { HeaderCart, Footer } from "@widgets/";
import { Cart } from "../../widgets/cart/cart";

export const CartPage = () => {
    return(
        <div className="CartPage">
            <HeaderCart/>

            <div className="CartPageContent">
                <Cart/>
            </div>

            <Footer/>
        </div>
    )
}