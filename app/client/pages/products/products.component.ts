import {Component} from "@angular/core";
import {MarketService} from "../../services/market.service";
import {models} from "../../../common/models";

@Component({
    moduleId: module.id,
    selector: "ProductsPage",
    templateUrl: 'products.tns.html'
})
export class ProductsPage {

    private items: models.Product[];
    private listToggled: boolean = true;

    public constructor(private _marketService: MarketService) {
        _marketService.getProducts()
            .subscribe(products => this.items = products);
    }

    public toggle() {
        this.listToggled = !this.listToggled;
    }

    public addToCart(item) {
        this._marketService.addToCart(item._id);
    }
}
