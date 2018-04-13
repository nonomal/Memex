import db from '..'
import AbstractModel from './abstract-model'

const favIcon = Symbol('favIconURI')

export interface Props {
    domain: string
    favIconURI: string
}

export default class FavIcon extends AbstractModel {
    public domain: string
    public favIcon: Blob

    constructor({ domain, favIconURI }: Props) {
        super()

        this.domain = domain
        this.favIconURI = favIconURI

        // Non-enumerable prop to hold the favIcon in-mem Blob link
        Object.defineProperty(this, favIcon, AbstractModel.DEF_NON_ENUM_PROP)
    }

    get favIconURI() {
        if (this.favIcon && !this[favIcon]) {
            return AbstractModel.getBlobURL(this.favIcon)
        }

        return this[favIcon]
    }

    set favIconURI(dataURI: string) {
        if (dataURI) {
            this.favIcon = AbstractModel.dataURLToBlob(dataURI)
            this[favIcon] = AbstractModel.getBlobURL(this.favIcon)
        }
    }

    public async delete() {
        return db.transaction('rw', db.favIcons, () =>
            db.favIcons.delete(this.domain),
        )
    }

    public async save() {
        return db.transaction('rw', db.favIcons, () => db.favIcons.put(this))
    }
}
