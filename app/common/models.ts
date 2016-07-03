export namespace models {

    export interface Product {
        _id: string,
        index: number,
        picture: string,
        name: string
        about: string,
        price: number
    }

    export interface CheckoutData {
        name: string,
        email: string,
        card: string
    }

    export interface CartItem extends Product {
        amount: number
    }
}
