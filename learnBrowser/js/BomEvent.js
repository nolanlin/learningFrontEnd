class BomEvent {
  constructor(element) {
    this.element = element;
  }
  addEvent(type, handler) {
    if (this.element.addEventListener) {
      this.element.addEventListener(type, handler, false);
    } else if (this.element.attachEvent) {
      this.element.attachEvent("on" + type, function () {
        handler.call(element);
      });
    } else {
      this.element["on" + type] = handler;
    }
  }
  removeEvent(type, handler) {
    if (this.element.removeEnentListener) {
      this.element.removeEnentListener(type, handler, false);
    } else if (element.datachEvent) {
      this.element.detachEvent("on" + type, handler);
    } else {
      this.element["on" + type] = null;
    }
  }
}
function stopPropagation(ev) {
  if (ev.stopPropagation) {
    ev.stopPropagation(); // 标准w3c
  } else {
    ev.cancelBubble = true; // IE
  }
}
function preventDefault(event) {
  if (event.preventDefault) {
    event.preventDefault(); // 标准w3c
  } else {
    event.returnValue = false; // IE
  }
}
