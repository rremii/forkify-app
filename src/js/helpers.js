import { async } from 'regenerator-runtime'
import { TIMEOUT_SEC } from './config'

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(
                new Error(`Request took too long! Timeout after ${s} second`)
            )
        }, s * 1000)
    })
}

export const AJAX = async (url, uploadData = undefined) => {
    try {
        let fetchPro = uploadData
            ? fetch(url, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(uploadData),
              })
            : fetch(url)
        let result = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
        let data = await result.json()

        if (!result.ok) throw new Error(`${data.message}(${result.status})`)
        return data
    } catch (err) {
        throw err
    }
}
/*
export const getJSON = async (url) => {
    try {
        let fetchPro = fetch(url)
        let result = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)])
        let data = await result.json()

        if (!result.ok) throw new Error(`${data.message}(${result.status})`)
        return data
    } catch (err) {
        throw err
    }
}
export const sendJSON = async (url, uploadData) => {
    try {
        let result = await Promise.race([
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadData),
            }),
            timeout(TIMEOUT_SEC),
        ])
        let data = await result.json()

        if (!result.ok) throw new Error(`${data.message}(${result.status})`)
        return data
    } catch (err) {
        throw err
    }
}
*/
