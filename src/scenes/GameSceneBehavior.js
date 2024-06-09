class GameSceneBehavior {
  constructor({ gameScene, parameters, onChange, runOnInit = false }) {
    this._parameters = parameters;
    this._gameScene = gameScene;
    this.onChange = () => onChange(this._gameScene, this._parameters);

    if (runOnInit) {
      this.onChange(this._gameScene, this._parameters);
    }
  }

  get parameters() {
    return this._parameters;
  }

  set parameters(params) {
    console.log("sett");
    this._parameters = params;

    console.log(this._parameters);

    this.onChange(this._gameScene, this._parameters);
  }
}

export default GameSceneBehavior;
