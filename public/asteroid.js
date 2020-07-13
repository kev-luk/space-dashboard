export default class Asteroid {
    constructor(name, nearestDistance, diameter) {
        this.name = name;
        this.nearestDistance = nearestDistance;
        this.diameter = diameter;
    }

    get Name() {
        return this.name;
    }

    get NearestDistance() {
        return this.nearestDistance;
    }

    get Diameter() {
        return this.diameter;
    }
}
