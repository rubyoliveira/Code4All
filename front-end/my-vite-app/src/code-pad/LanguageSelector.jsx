import { LANGUAGES} from "../constants"
import {useState, useRef} from "react";
const languages = Object.entries(LANGUAGES);

const LanguageSelector = ({language, onSelect}) => {
    return(
       <div>
            <p>Language: </p>
            <div className = "dropdown">
                <select className="create-dropdown" isLazy >
                    {languages.map(([lang, version]) => (
                        <option
                            key={lang}
                            onClick={() => onSelect(lang)}>
                            {lang}
                            &nbsp;
                            <p as="span" color="gray.600" fontSize="sm">
                                ({version})
                            </p>
                        </option>
                ))}
                </select>
            </div>
       </div>
    )
}

export default LanguageSelector
