import axios from "axios";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language, sourceCode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGES[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};

export const getLanguages = async() => {
    const response = await API.get("/packages")
    console.log(response.data)
    return response.data
}


export const LANGUAGES = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
    csharp: "6.12.0",
    php: "8.2.3",
    ruby: "3.0.1",
    cpp: "10.2.0",
    c: "10.2.0",
}

export const STARTER_CODE = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("User");\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("User")\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    csharp:
        'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    php: "<?php\n\n$name = 'User';\necho $name;\n",
  };
