import {useState, useRef, useEffect} from "react";

const LanguageSelector = ({language, onSelect, languages}) => {

    return (
        <div>
          <p>Language: </p>
          <div className="dropdown">
            <select
              className="create-dropdown"
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
