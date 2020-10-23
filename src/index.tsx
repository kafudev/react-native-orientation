import { NativeModules, DeviceEventEmitter } from 'react-native';

let listeners: any = {};
let orientationDidChangeEvent = 'orientationDidChange';
let specificOrientationDidChangeEvent = 'specificOrientationDidChange';

let id = 0;
let META = '__listener_id';

function getKey(listener: any) {
  if (!listener.hasOwnProperty(META)) {
    if (!Object.isExtensible(listener)) {
      return 'F';
    }

    Object.defineProperty(listener, META, {
      value: 'L' + ++id,
    });
  }

  return listener[META];
}

export function getOrientation(cb: any) {
  Orientation.getOrientation((error: any, orientation: any) => {
    cb(error, orientation);
  });
}

export function getSpecificOrientation(cb: any) {
  Orientation.getSpecificOrientation((error: any, orientation: any) => {
    cb(error, orientation);
  });
}

export function lockToPortrait() {
  Orientation.lockToPortrait();
}

export function lockToLandscape() {
  Orientation.lockToLandscape();
}

export function lockToLandscapeRight() {
  Orientation.lockToLandscapeRight();
}

export function lockToLandscapeLeft() {
  Orientation.lockToLandscapeLeft();
}

export function unlockAllOrientations() {
  Orientation.unlockAllOrientations();
}

export function addOrientationListener(cb: any) {
  var key = getKey(cb);
  listeners[key] = DeviceEventEmitter.addListener(
    orientationDidChangeEvent,
    (body: any) => {
      cb(body.orientation);
    }
  );
}

export function removeOrientationListener(cb: any) {
  var key = getKey(cb);

  if (!listeners[key]) {
    return;
  }

  listeners[key].remove();
  listeners[key] = null;
}

export function addSpecificOrientationListener(cb: any) {
  let key = getKey(cb);

  listeners[key] = DeviceEventEmitter.addListener(
    specificOrientationDidChangeEvent,
    (body: any) => {
      cb(body.specificOrientation);
    }
  );
}

export function removeSpecificOrientationListener(cb: any) {
  let key = getKey(cb);

  if (!listeners[key]) {
    return;
  }

  listeners[key].remove();
  listeners[key] = null;
}

export function getInitialOrientation() {
  return Orientation.initialOrientation;
}

type OrientationType = {
  multiply(a: number, b: number): Promise<number>;
};

const { Orientation } = NativeModules;

export default Orientation as OrientationType;
