import React from 'react'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

function Tags(props) {
    if (!props.username || props.username != 'admin') {
        return (
            <div>
                <p>Тэги:</p>
                <ul>{props.tags.map((t, i) => <li key={i}>{t}</li>)}</ul>
            </div>
        )
    }
    return (
        <div>
            <p>Тэги:</p>
            {props.tags.map(
                (t, i) => <div style={{ display: "flex", alignItems: "center" }} key={i}><li>
                    <input
                        type="text"
                        placeholder="Тэг"
                        value={t}
                        onChange={e => props.updateTags([...props.tags.map((x, y) => y == i ? e.target.value : x)])}
                    /></li>
                    <HighlightOffIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => props.updateTags([...props.tags.filter((_, y) => y != i)])}
                    /></div>
            )}
            <AddCircleOutlineIcon
                style={{ cursor: "pointer" }}
                onClick={() => props.updateTags([...props.tags, 'новый тэг'])}
            />
        </div>
    )
}

export default Tags
