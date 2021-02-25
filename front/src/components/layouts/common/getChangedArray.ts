interface IarrayObjects {
    id: number;
    [index: string]: any;
}

export default function (unchangedArray: Array<IarrayObjects>, updatedArrayObject: Array<IarrayObjects>, toDelete: boolean = false): Array<IarrayObjects> {
    let updatedArray: Array<IarrayObjects> = new Array<IarrayObjects>()
    const IDArray: Array<number> = updatedArrayObject.map((o: IarrayObjects) => o.id)
    if (toDelete)
        updatedArray = unchangedArray.filter((a: IarrayObjects) => !(a.id in IDArray))
    else {
        let update: boolean = false
        updatedArray = unchangedArray.map((a: IarrayObjects) => {
            if (IDArray.indexOf(a.id) >= 0) {
                update = true
                const updatedObject: IarrayObjects = updatedArrayObject.filter((o: IarrayObjects) => o.id == a.id)[0]
                return { ...a, ...updatedObject }
            }
            return a
        })
        // if (!update)
        //     updatedArrayObject.map((o: IarrayObjects) => { updatedArray.push(o) })
    }
    return updatedArray
}