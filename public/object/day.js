export default class Day {
    constructor(name, numAsteroids) {
        this.name = name;
        this.numAsteroids = numAsteroids;
    }

    getName() {
        return this.name;
    }

    getNumAsteroids() {
        return this.numAsteroids;
    }
}
