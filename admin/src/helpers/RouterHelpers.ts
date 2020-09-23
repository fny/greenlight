import * as utils from "./LocalStorageHelpers";

const localStorageLastLocationKey = "gl-lastLocation";

function acceptLocation(lastLocation: Location) {
    if (
        lastLocation &&
        lastLocation.pathname &&
        lastLocation.pathname !== "/" &&
        lastLocation.pathname.indexOf("auth") === -1 &&
        lastLocation.pathname !== "/logout"
    ) {
        return true;
    }

    return false;
}

export function saveLastLocation(lastLocation: Location) {
    if (acceptLocation(lastLocation)) {
        utils.setStorage(
            localStorageLastLocationKey,
            JSON.stringify(lastLocation),
            120
        );
    }
}

export function forgetLastLocation() {
    utils.removeStorage(localStorageLastLocationKey);
}

export function getLastLocation() {
    const defaultLocation = { pathname: "/", title: "Dashboard"};
    const localStorateLocations = utils.getStorage(localStorageLastLocationKey);
    if (!localStorateLocations) {
        return { pathname: "/", title: "Dashboard"};
    }

    try {
        const result = JSON.parse(localStorateLocations);
        return result;
    } catch (error) {
        console.error(error);
        return defaultLocation;
    }
}

export function getCurrentUrl(location: Location) {
    return location.pathname.split(/[?#]/)[0];
}

export function checkIsActive(location: Location, url: string) {
    const current = getCurrentUrl(location);
    if (!current || !url) {
        return  false;
    }

    if (current === url) {
        return  true;
    }

    if (current.indexOf(url) > -1) {
        return true;
    }

    return false;
}
