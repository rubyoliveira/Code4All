

const LanguageSelector = () => {
    return(
       <div>
            <Text>Language: </Text>
            <div className = "dropdown">
                <select className="create-dropdown">
                    <option value = "">JavaScript</option>
                    <option value ="Beginner" >Beginner</option>
                    <option value ="Intermediate" >Intermediate</option>
                    <option value ="Expert" >Expert</option>
                </select>
            </div>
       </div>
    )
}

export default LanguageSelector
