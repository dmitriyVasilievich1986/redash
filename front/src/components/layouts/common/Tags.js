import React from 'react'

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

function Tags(props) {
    const [tags, updateTags] = props.tags
    if (!props.username || props.username != adminName) {
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
                (t, i) => <div style={{ display: "flex", alignItems: "center" }} key={i}><li>
                    <input
                        type="text"
                        placeholder="Тэг"
                        value={t}
                        onChange={e => {
                            updateTags([...tags.map((x, y) => y == i ? e.target.value : x)])
                            props.updated(true)
                        }}
                    /></li>
                    <HighlightOffIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            if (t.match(/querie_/g) != null)
                                return
                            props.updated(true)
                            updateTags([...tags.filter((_, y) => y != i)])
                        }}
                    /></div>
            )}
            <AddCircleOutlineIcon
                style={{ cursor: "pointer" }}
                onClick={() => {
                    props.updated(true)
                    updateTags([...tags, 'новый тэг'])
                }}
            />
        </div>
    )
}

export default Tags
