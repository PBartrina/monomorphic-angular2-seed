import {Injectable, Inject} from "@angular/core";
import * as Rx from "rxjs";
import {Http, Headers, RequestOptions} from "@angular/http"
import {models} from "../../common/models"
import {Config} from '../app.config'

@Injectable()
export class MarketService {

    private products: any[];
    private cart: any[];
    private refreshCartStream = new Rx.BehaviorSubject<void>(null);
    private increaseItemStream = new Rx.Subject<string>()
    private decreaseItemStream = new Rx.Subject<string>()
    private removeItemStream = new Rx.Subject<string>()
    private deleteCartStream = new Rx.Subject<void>()
    private cartStream: Rx.Observable<models.CartItem[]>;

    constructor(private config: Config, private _http: Http) {
        Rx.Observable.merge(
            this.increaseItemStream
                .flatMap(id => this._http.put(`http://${this.config.SERVICES_URL}:3000/api/cart/item/${id}`, null))
            ,
            this.decreaseItemStream
                .flatMap(id => this._http.delete(`http://${this.config.SERVICES_URL}:3000/api/cart/item/` + id))
            ,
            this.removeItemStream
                .flatMap(id => this._http.delete(`http://${this.config.SERVICES_URL}:3000/api/cart/item/${id}/all`))
            ,
            this.deleteCartStream
                .flatMap(() => this._http.delete(`http://${this.config.SERVICES_URL}:3000/api/cart`))
        ).catch(this.handleError)
            .do(() => this.refreshCartStream.next(null))
            .subscribe(response => console.log(response));

        this.cartStream = this.refreshCartStream
            .flatMap(() => this._http.get(`http://${this.config.SERVICES_URL}:3000/api/cart`))
            .map(response => response.json())
            .catch(this.handleError)
    }


    public getCart(): Rx.Observable<models.CartItem[]> {
        return this.cartStream;
    }

    public getProducts(): Rx.Observable<models.Product[]> {
        return this._http
            .get(`http://${this.config.SERVICES_URL}:3000/api/products`)
            .map(response => response.json())
            .catch(this.handleError);
    }

    public getProduct(itemID) {
        let product;
        this.products.filter((item) => item["_id"] == itemID).map((item) => {
            product = item;
        })
        return product;
    }

    public getCartItem(itemID) {
        return this.cartStream.map(cart => {
            let cartItem;
            cart.filter((item) => item["_id"] == itemID).map((item) => {
                cartItem = item;
            })
            return cartItem;
        })
    }


    public addToCart(itemID: string) {
        this.increase(itemID);
    }

    public increase(itemID: string) {
        this.increaseItemStream.next(itemID);
    }

    public decrease(itemID) {
        this.decreaseItemStream.next(itemID);
    }

    public remove(itemID) {
        this.removeItemStream.next(itemID);
    }

    public deleteCart() {
        this.deleteCartStream.next(null);
    }

    public checkout(data): Rx.Observable<models.CartItem[]> {
        console.log("checkout...")
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http
            .post(`http://${this.config.SERVICES_URL}:3000/api/checkout`, body, options)
            .share()
            .do(() => this.refreshCartStream.next(null))
            .map(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Rx.Observable.throw(errMsg);
    }
}
