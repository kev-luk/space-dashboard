export default class Asteroid {
    constructor(name, nearestDistance, diameter, closestAproachDate) {
        this.name = name;
        this.nearestDistance = nearestDistance;
        this.diameter = diameter;
        this.closestAproachDate = closestAproachDate;
    }

    getName() {
        return this.name;
    }

    getNearestDistance() {
        return this.nearestDistance;
    }

    getDiameter() {
        return this.diameter;
    }

    getClosestApproachDate() {
        return this.closestAproachDate;
    }
}
