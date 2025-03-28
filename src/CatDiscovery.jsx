export class Cat {
    constructor(name, origin, weight, lifeSpan, imageUrl) {
      this.name = name;
      this.origin = origin;
      this.weight = weight;
      this.lifeSpan = lifeSpan;
      this.imageUrl = imageUrl;
    }
  }
  
  export class History extends Cat {
    constructor(name, origin, weight, lifeSpan, imageUrl, timestamp) {
      super(name, origin, weight, lifeSpan, imageUrl);
      this.timestamp = timestamp;
    }
  }
  