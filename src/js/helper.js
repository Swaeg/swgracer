class Helper {
    constructor() {}

    timestamp() {
        return new Date().getTime();
    }
    
    random() {
        return Math.random();
    }
    
    sign(number) {
        return number ? number < 0 ? -1 : 1 : 0;
    }
}

export let helper = new Helper();
