class Sample {
    constructor(name) {
        this.name = name;
    }

    say() {
        document.write("HI, I AM ", this.name);
    }
}

export default Sample;