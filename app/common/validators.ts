
export namespace validators {
    export var isValidName = (name: string) => {
        return /[A-Z]/.test(name.toUpperCase());
    }

    export var isValidMail = (mail: string) => {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/.test(mail.toUpperCase());
    }

    export var isValidCard = (card: string) => {
        return /[0-9]/.test(card) && (card.length === 16);
    }
}
