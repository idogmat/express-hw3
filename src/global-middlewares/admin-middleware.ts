import {Response, Request, NextFunction} from 'express'
import {SETTINGS} from '../settings'

export const fromBase64ToUTF8 = (code: string) => {
    const buff = Buffer.from(code, 'base64')
    // console.log(buff)
    const decodedAuth = buff.toString('utf8')
    // console.log(decodedAuth)
    return decodedAuth
}
export const fromUTF8ToBase64 = (code: string) => {
    const buff2 = Buffer.from(code, 'utf8')
    // console.log(buff2)
    const codedAuth = buff2.toString('base64')
    // console.log(codedAuth)
    return codedAuth
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req?.headers?.['authorization'] as string // 'Basic xxxx'
    // console.log(auth)
    if (!auth) {
        res
            .status(401)
            .json({})
        return
    }
    const token = auth.split(' ')

    if (token?.length !== 2 || token[0] !== 'Basic') {
        res
            .status(401)
            .json({})
        return
    }

    const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)
    console.log(codedAuth)
    console.log(token[1])
    const decodeAuth = fromBase64ToUTF8(token[1])
    console.log(decodeAuth)
    console.log(SETTINGS.ADMIN)
    // if (decodedAuth !== SETTINGS.ADMIN) {
    if (decodeAuth !== SETTINGS.ADMIN) {
        res
            .status(401)
            .json({})
        return
    }
    next()
}