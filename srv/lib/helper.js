const HELPER = module.exports = { getName, v2ToJSON, deletePropFromObj, metaPropFromObj, pushUpPropFromObj }

function getName(str) {
    if (typeof str === 'string' || str instanceof String) {
        const n = str.lastIndexOf('.')
        return str.substr(n + 1)
    } else { return null }
}

function v2ToJSON(odata) {
    if (!odata) {
        return "{}"
    }

    if (odata && odata.d) {
        // remove leading property
        odata = odata.d
    }

    // remove unnecessary stuff
    //HELPER.deletePropFromObj(odata, '__metadata')
    HELPER.metaPropFromObj(odata, '__metadata')
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

function metaPropFromObj(obj, metaThisKey) {
    if (Array.isArray(obj)) {
        obj.forEach(element => metaPropFromObj(element, metaThisKey))
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            const value = obj[key]
            if (key === metaThisKey) {
                //obj[`**${obj[key].type}**`] = '';
                //delete obj[key]
                obj[key] = `**${HELPER.getName(obj[key].type)}**`
            }
            else metaPropFromObj(value, metaThisKey)
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