interface IarrayObjects {
    id: number;
    [index: string]: any;
}

export default function (
    unchangedArray: Array<IarrayObjects>,
    updatedArrayOrObject: Array<IarrayObjects> | IarrayObjects,
    toDelete: boolean = false,
): Array<IarrayObjects> {

    // Приводим входной объект к массиву объектов
    const updatedArrayObject: Array<IarrayObjects> = Array.isArray(updatedArrayOrObject) ? updatedArrayOrObject : [updatedArrayOrObject]
    // Инициализируем возвращаемый массив
    let payload: Array<IarrayObjects> = [...unchangedArray]
    // Получаем список id для начального массива обектов, которые необходимо изменить.
    // Для более удобного поиска и фильтрации.
    const IDArray: Array<number> = payload.map((o: IarrayObjects) => o.id)
    // Только если необходимо удалить объект из списка
    if (toDelete) {
        const arrayIDToDelete = updatedArrayObject.map((ua: IarrayObjects) => ua.id)
        payload = unchangedArray.filter((a: IarrayObjects) => arrayIDToDelete.indexOf(a.id) < 0)
    } else {
        updatedArrayObject.map((uo: IarrayObjects) => {
            if (IDArray.indexOf(uo.id) >= 0) {
                payload = payload.map((ua: IarrayObjects) => ua.id == uo.id ? uo : ua)
            } else {
                payload = [...payload, uo]
            }
        })
    }
    return payload
}