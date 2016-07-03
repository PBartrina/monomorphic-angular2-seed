import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {RouterConfig, ActivatedRoute, ROUTER_DIRECTIVES, Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'menu',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: './menu.component.tns.html'
})
export class MenuComponent implements OnInit {

    @Input() public toggled: boolean;
    @Output() close = new EventEmitter();

    constructor(private _router: Router) { }

    ngOnInit() {
    }

    public menuItemTap(item) {
        let page = item.page;
        if (page !== this._router.url) {
            this._router.navigateByUrl(page);
        };
        this.close.emit(false);
    }

    public menuItemClass(page): string {
        let style: string;
        if (page == this._router.url) {
            style = "menu-item-selected"
        } else {
            style = "menu-item"
        }

        return style;
    }

    //Menu categories
    private sideDrawerItems = [
        { name: "Products", page: "/products", icon: "\uf09b" },
        { name: "Cart", page: "/cart", icon: "\uf07a" },
        { name: "Checkout", page: "/cart/checkout", icon: "\uf09d" }
    ];

}
