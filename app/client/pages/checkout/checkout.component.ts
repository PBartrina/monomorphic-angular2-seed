import {Component, Inject} from "@angular/core";
import {RouterConfig, ActivatedRoute, ROUTER_DIRECTIVES, Router} from '@angular/router';
import {Config} from '../../app.config'
import {MarketService} from "../../services/market.service";
import {models} from "../../../common/models";
// import {validators} from "../../../../common/validators";

@Component({
    moduleId: module.id,
    selector: "CheckoutPage",
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'checkout.tns.html'
})
export class CheckoutPage {

    private cart//: models.CartItem[] = [];
    private total: string = "";
    private data: models.CheckoutData;

    public constructor(private config: Config, private _marketService: MarketService, private _router: Router) {
        this.data = { name: "", email: "", card: "" };
        _marketService.getCart()
            .subscribe(cart => {
                this.cart = cart
                console.log("cart fetching task complete!")
                this.total = this.getTotal();
            });
    }

    public getTotal(): string {
        let total: string;
        let price: number = 0;
        this.cart.forEach((item) => {
            price = price + (item.amount * item.price);
        })
        total = "TOTAL: " + price.toFixed(2) + "€";
        return total;
    }

    public confirm() {
            // if (validators.isValidName(this.data.name)
            //     && validators.isValidMail(this.data.email)
            //     && validators.isValidCard(this.data.card)) {
            //     this._marketService.checkout(this.data).subscribe(result => {
            //         if (this.config.PLATFORM === Platforms.tns) {
            //             var dialogs = require("ui/dialogs");
            //             dialogs.alert({
            //                 title: "Kitties purchased",
            //                 message: "Thanks for your purchase",
            //                 okButtonText: "You're welcome"
            //             }).then(function () {
            //                 console.log("Dialog closed!");
            //             });
            //         } else {
            //             alert("Kitties purchased")
            //         }
            //         console.log("checkout task complete!", JSON.stringify(result))
            //     })
            // } else {
            //     if (this.config.PLATFORM === Platforms.tns) {
            //             var dialogs = require("ui/dialogs");
            //             dialogs.alert({
            //                 title: "Data is invalid",
            //                 message: "Data is invalid",
            //                 okButtonText: "Okay"
            //             });
            //         } else {
            //             alert("Data is invalid")
            //         }
            // }


    }
}
