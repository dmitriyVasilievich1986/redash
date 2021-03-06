//#region Импорт модулей
import getChangedArray from '../common/getChangedArray'
import React from 'react'
//#endregion

function Visualizations(props) {
    // Получаем список визуализаций связанных с этим бордом
    const [visualizations, updateVisualization] = props.visualizations

    // функция для обновления списка визуализаций
    const onChangeHandler = () => {
        const newVisual = {
            ...props.v,
            updated: true,
            inDashboard: !props.v.inDashboard,
        }
        updateVisualization(getChangedArray(visualizations, newVisual))
    }

    return (
        <div className='row'>
            {/* Чекбокс для переключения видимости визуализации */}
            <input
                style={{ marginRight: "5px" }}
                checked={props.v.inDashboard}
                onChange={onChangeHandler}
                type="checkbox"
            />
            {/* Название визуализации */}
            <p>{props.v.name}</p>
        </div>
    )
}

export default Visualizations
