import {Component, ViewChild, ElementRef, Inject} from "@angular/core";
import {RouterConfig, ActivatedRoute, ROUTER_DIRECTIVES, Router} from '@angular/router';
import {MenuComponent} from './components/menu/menu.component'
import {MarketService} from "./services/market.service";
import {ProductsPage} from "./pages/products/products.component";
import {CheckoutPage} from "./pages/checkout/checkout.component";
import {Config} from './app.config'
import {CartPage} from "./pages/cart/cart.component";
import {HTTP_PROVIDERS} from "@angular/http"
declare let PLATFORM: any;

@Component({
    moduleId: module.id,
    selector: "my-app",
    directives: [ROUTER_DIRECTIVES, MenuComponent],
    templateUrl: "app.component.tns.html",
    styleUrls: ['app.component.tns.css'],
})
export class AppComponent {

    private itemsInCart: number;
    private sdToggled: boolean = false;
    private animationDuration = 300;

    public constructor(config: Config, private _router: Router, private _marketService: MarketService) {
        _marketService.getCart().subscribe((cart) => {
            this.itemsInCart = cart.reduce((count, item) => count + item.amount, 0);
        });


        if (global.web) {
            console.log('on web!');
        } else {
            console.log("hiding actionbar!")
            let frameModule = require("ui/frame");
            let topmost = frameModule.topmost();
            topmost.currentPage.actionBarHidden = true;
        }
    }

    public goToCart() {
        this._router.navigate(["/cart"])
        if (this.sdToggled) {
            this.toggleSideDrawer();
        }
    }

    //Toggle side drawer
    public toggleSideDrawer() {
        this.sdToggled = !this.sdToggled;
    }
}

export const APP_ROUTES: RouterConfig = [
    { path: '', redirectTo: '/products', terminal: true },
    { path: "products", component: ProductsPage },
    { path: "cart", component: CartPage },
    { path: "cart/checkout", component: CheckoutPage },
]
