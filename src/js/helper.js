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

    lerp(v0, v1, t) {
        t = t < 0 ? 0 : t;
        t = t > 1 ? 1 : t;
        // Precise method
        return (1 - t) * v0 + t * v1;
    }
}

export let helper = new Helper();
