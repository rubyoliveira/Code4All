import { LANGUAGES} from "../constants"
const languages = Object.entries(LANGUAGES);

const LanguageSelector = ({language, onSelect}) => {
    return(
       <div>
            <p>Language: </p>
            <div className = "dropdown">
                <select className="create-dropdown">
                    {languages.map(([lang, version]) => (
                        <option
                            key={lang}
                            color={lang === language ? ACTIVE_COLOR : ""}
                            bg={lang === language ? "gray.900" : "transparent"}
                            _hover={{
                                color: ACTIVE_COLOR,
                                bg: "gray.900",
                            }}
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
