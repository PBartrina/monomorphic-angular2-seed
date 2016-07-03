import {models} from './models';

export namespace services {

    export class Cart {
        constructor(private items: Item[] = []) {
        }
        getItems(): Item[] {
            return this.items;
        }
        deleteItems(): boolean {
            try {
                this.items = [];
                return true;
            } catch (e) {
                return false;
            }
        }
        isEmpty(): boolean {
            return (this.items.length) <= 0;
        }
        getItem(id: string): Item {
            try {
                var foundItem: Item = null;
                this.items.forEach (( item ) => {
                    if (item._id === id) foundItem = item;
                });
                return foundItem;
            } catch (e) {
                return null;
            }
        }
        load(items: Item[]): boolean {
            try {
                this.items = items;
                return true;
            } catch (e) {
                return false;
            }
        }
        add(item: Item): boolean {
            try {
                let foundItem = false;
                this.items.forEach (( elem ) => {
                    if (elem._id === item._id) {
                        elem.add();
                        foundItem = true;
                    }
                });
                if (!foundItem) this.items.push(item);
                return true;
            } catch (e) {
                return false;
            }
        }
        remove(id: string): boolean {
            try {
                for (let i = this.items.length - 1; i >= 0; i--) {
                    if ( this.items[i]._id === id ) {
                        this.items.splice(i, 1);
                        break;
                    }
                }
                return true;
            } catch (e) {
                return false;
            }
        }
        substract(id: string): boolean {
            try {
                for (let i = this.items.length - 1; i >= 0; i--) {
                    if ( this.items[i]._id === id ) {
                        if ( this.items[i].getAmount() <= 1 ) {
                            this.items.splice(i, 1);
                            break;
                        } else {
                            this.items[i].substract();
                            break;
                        }
                    }
                }
                return true;
            } catch (e) {
                return false;
            }
        }
    }

    export class Item implements models.CartItem {
        constructor(public _id: string,
            public index: number,
            public picture: string,
            public amount: number,
            public name: string,
            public about: string,
            public price: number) {

        }
        add() {
            this.amount += 1;
        }
        substract() {
            this.amount -= 1;
        }
        getAmount() {
            return this.amount;
        }
    }
}
