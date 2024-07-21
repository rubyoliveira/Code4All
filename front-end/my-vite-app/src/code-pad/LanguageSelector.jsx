import {useState, useRef, useEffect} from "react";
import "./CodePad.css"

const LanguageSelector = ({language, onSelect, languages}) => {

    return (
        <div>
          <div className="dropdown-languages">
          <p>Language: </p>
            <select
              className="language-dropdown"
              value={language}
              onChange={(e) => onSelect(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.language}>
                  {`${lang.language} (${lang.version})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
}

export default LanguageSelector
