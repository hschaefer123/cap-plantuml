const HELPER = module.exports = { getName, v2ToJSON, deletePropFromObj, pushUpPropFromObj }

function getName(str) {
    if (typeof str === 'string' || str instanceof String) {
        const n = str.lastIndexOf('.')
        return str.substr(n + 1)
    } else { return null }
}

function v2ToJSON(odata) {
    // remove unnecessary stuff
    HELPER.deletePropFromObj(odata, '__metadata')
    HELPER.deletePropFromObj(odata, '__deferred')

    // eleminate results node by assigning parent node directly to results array
    HELPER.pushUpPropFromObj(odata, 'results')

    return JSON.stringify(odata)
}

// recursively delete a key from anywhere in the object
// will mutate the obj - no need to return it
function deletePropFromObj(obj, deleteThisKey) {
    if (Array.isArray(obj)) {
        obj.forEach(element => deletePropFromObj(element, deleteThisKey))
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            const value = obj[key]
            if (key === deleteThisKey) delete obj[key]
            else deletePropFromObj(value, deleteThisKey)
        }
    }
}

function pushUpPropFromObj(obj, pushThisKey, parent, pKey) {
    if (Array.isArray(obj)) {
        obj.forEach(element => pushUpPropFromObj(element, pushThisKey, obj, pKey))
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            const value = obj[key]
            if (key === pushThisKey) parent[pKey] = obj[key]
            pushUpPropFromObj(value, pushThisKey, obj, key)
        }
    }
}