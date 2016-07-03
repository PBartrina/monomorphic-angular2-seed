import {Component, ViewChild, ElementRef} from "@angular/core";
import {RouterConfig, ActivatedRoute, ROUTER_DIRECTIVES, Router} from '@angular/router';
import {MarketService} from "../../services/market.service";
import {models} from "../../../common/models";

@Component({
    moduleId: module.id,
    selector: "CartPage",
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'cart.tns.html'
})
export class CartPage {

    private cart: models.CartItem[];
    private total: string = "";

    public constructor(private _marketService: MarketService, private _router: Router){
        _marketService.getCart()
            .subscribe(cart => {
                this.cart = cart
                console.log("cart fetching task complete!")
                this.total = this.getTotal();
            });
    }

    public getProduct(id){
        let product = this._marketService.getProduct(id);
        return product;
    }

    public getItemTotal(item): string{
        let total: string;
        let price: number = item.q * this.getProduct(item._id).price;
        total = "Product total: " + price.toFixed(2) + "€";
        return total;
    }

    public getTotal(): string{
        let total: string;
        let price: number = 0;
        this.cart.forEach((item)=>{
            price = price + (item.amount * item.price);
        })
        total = "TOTAL: " +  price.toFixed(2) + "€";
        return total;
    }

    public increase(id){
        this._marketService.increase(id);
    }

    public decrease(id){
        this._marketService.decrease(id);
    }

    public remove(itemRow: ElementRef, id){
         if (!global.web && global.android) {
            let explosion = require('nativescript-explosionfield');
            explosion.explode(itemRow.nativeElement);
        }
        this._marketService.remove(id);
    }

    checkOut(){
        this._router.navigateByUrl('/cart/checkout');
    }
}
