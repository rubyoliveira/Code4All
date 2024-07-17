import { LANGUAGES} from "../constants"
import {useState, useRef} from "react";
const languages = Object.entries(LANGUAGES);

const LanguageSelector = ({language, onSelect}) => {
    return(
       <div>
            <p>Language: </p>
            <div className = "dropdown">
                <select className="create-dropdown" >
                {languages.map(([lang, version]) => (
                    <option key={lang} value={lang} onClick={() => onSelect(lang)}>
                    {`${lang} (${version})`}
                    </option>
                ))}
                </select>
            </div>
       </div>
    )
}

export default LanguageSelector
