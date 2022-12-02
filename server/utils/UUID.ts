import {nanoid} from 'nanoid'

export const shortUUID = () => nanoid().substring(0, 8)
