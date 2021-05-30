// 实现new
function Player(name) {
  this.name = name;
}
function objectCreate() {
  const constructor = [].shift.call(arguments);
  const obj = Object.create(constructor.prototype);
  const resultObj = constructor.apply(obj, arguments);
  return typeof resultObj === "object" ? resultObj : obj;
}
