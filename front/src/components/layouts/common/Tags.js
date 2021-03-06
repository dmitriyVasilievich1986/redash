//#region Импорт модулей
import React from 'react'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
//#endregion


function Tags(props) {
    const [tags, updateTags] = props.tags

    if (updateTags === null) {
        return (
            <div>
                <p>Тэги:</p>
                <ul>{tags.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
        )
    }
    return (
        <div>
            <p>Тэги:</p>
            {tags.map(
                (t, i) => <div className='row' key={i}><li>
                    <input
                        type="text"
                        placeholder="Тэг"
                        value={t}
                        onChange={e => {
                            if (t.match(/querie_/g) != null)
                                return
                            updateTags({ newTags: [...tags.map((x, y) => y == i ? e.target.value : x)] })
                        }}
                    /></li>
                    <HighlightOffIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (t.match(/querie_/g) != null)
                                return
                            updateTags({ newTags: [...tags.filter((_, y) => y != i)] })
                        }}
                    /></div>
            )}
            <AddCircleOutlineIcon
                style={{ cursor: "pointer" }}
                onClick={() => updateTags({ newTags: [...tags, 'новый тэг'] })}
            />
        </div>
    )
}

export default Tags
