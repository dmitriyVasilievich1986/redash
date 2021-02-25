interface IarrayObjects {
    [key: string]: string
}

export default function (arrayObjects: IarrayObjects): Array<FormData | IarrayObjects> {
    const contextData: FormData = new FormData()
    Object.keys(arrayObjects).map((x: string) => {
        contextData.append(x, arrayObjects[x])
    })
    const headers: IarrayObjects = {
        'Content-Type': 'multipart/form-data'
    }
    return [contextData, headers]
}