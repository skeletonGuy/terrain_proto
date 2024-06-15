class Object {
  constructor({ name }) {
    this._name = name;
    this._subObjects = [];
    this._geometry;
    this._material;
    this._mesh;
    this._animationBehaviors = [];
  }

  addObject(object) {
    for (obj of this._subObjects) {
      if (obj.name === object.name) {
        throw Error(
          'Object.addObject: Cannot add an object with the same name as a sub object',
        );
      }
    }
    this._subObjects.push(object);
  }

  getSubObject(name) {
    return this._subObjects.find((obj) => obj.name === name);
  }

  get mesh() {
    return this._mesh;
  }

  get name() {
    return this._name;
  }

  get animationBehaviors() {
    const childBehaviors = this._subObjects.map(
      (obj) => obj.animationBehaviors,
    );

    return [...childBehaviors, ...this._animationBehaviors];
  }

  addAnimationBehavior(objectAnimationBehavior) {
    this._animationBehaviors.push(objectAnimationBehavior.bind(this));
  }
}

export default Object;
