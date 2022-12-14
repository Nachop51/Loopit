import "./CreateLoop.css";
import loopit from "../../../api/loopit";
import LoadEditor from "../../Editor";

import { useState } from "react";
import { Form, Field } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

const CreateLoop = ({ user_id, editorTheme }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const onSubmit = async ({ name, description, filename }) => {
    if (!name) {
      return { [FORM_ERROR]: "Title is required" };
    }

    if (!language || language === "default") {
      return { [FORM_ERROR]: "Language is required" };
    }
    if (!code || code === "") {
      return { [FORM_ERROR]: "Code is required" };
    }

    if (code.length > 3000) {
      return { [FORM_ERROR]: "Code is too long, maximum: 3000 characters" };
    }

    const params = {
      name,
      content: code,
      language,
      user_id,
    };
    if (description) params.description = description;
    if (filename) params.filename = filename;
    try {
      await loopit.post("/loops/add", params);

      navigate("/l");
    } catch (error) {
      console.log(error);
    }
  };

  const buildInput = ({ input, placeholder, optionalClass }) => {
    return (
      <input
        {...input}
        className={optionalClass ? optionalClass : ""}
        placeholder={placeholder}
        id={input.name}
        autoComplete="off"
      />
    );
  };

  if (editorTheme !== "vs-dark") {
    document.documentElement.style.setProperty(
      "--background-editor",
      "rgb(220, 220, 220)"
    );

    document.documentElement.style.setProperty(
      "--input-container-editor",
      "rgb(220, 220, 220)"
    );

    document.documentElement.style.setProperty(
      "--input-editor",
      "rgb(220, 220, 220)"
    );
    document.documentElement.style.setProperty(
      "--editor-inputs",
      "rgb(240, 240, 240)"
    );
    document.documentElement.style.setProperty(
      "--editor-input-text",
      "#15151e"
    );

    document.documentElement.style.setProperty(
      "--editor-input-border",
      "rgb(220, 220, 220)"
    );
  } else {
    document.documentElement.style.setProperty(
      "--background-editor",
      "rgb(30, 41, 59)"
    );
    document.documentElement.style.setProperty(
      "--input-container-editor",
      "rgb(30 41 59 / 0.8)"
    );
    document.documentElement.style.setProperty("--editor-inputs", "#15151e");
    document.documentElement.style.setProperty(
      "--editor-input-text",
      "rgb(220, 220, 220)"
    );
    document.documentElement.style.setProperty(
      "--editor-input-border",
      "default"
    );
  }
  return (
    <main className="editor">
      <h1 className="heading-primary">Create your loop!</h1>
      <div className="editor-container">
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitError }) => (
            <form onSubmit={handleSubmit} className="editor-form">
              <div className="inputs-required">
                <Field
                  name="name"
                  validate={(input) => {
                    return input === "" ? { title: "Title is required" } : null;
                  }}
                  placeholder="Title"
                  render={buildInput}
                />
                <select
                  name="language"
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    console.log(e.target.value);
                    return e.target.innerHTML;
                  }}
                >
                  <option>javascript</option>
                  <option>python</option>
                  <option>c</option>
                  <option>aes</option>
                  <option>apex</option>
                  <option>azcli</option>
                  <option>bat</option>
                  <option>bicep</option>
                  <option>cameligo</option>
                  <option>clojure</option>
                  <option>coffeescript</option>
                  <option>cpp</option>
                  <option>csharp</option>
                  <option>csp</option>
                  <option>css</option>
                  <option>cypher</option>
                  <option>dart</option>
                  <option>dockerfile</option>
                  <option>ecl</option>
                  <option>elixir</option>
                  <option>flow9</option>
                  <option>freemarker2</option>
                  <option>fsharp</option>
                  <option>go</option>
                  <option>graphql</option>
                  <option>handlebars</option>
                  <option>hcl</option>
                  <option>html</option>
                  <option>ini</option>
                  <option>java</option>
                  <option>json</option>
                  <option>julia</option>
                  <option>kotlin</option>
                  <option>less</option>
                  <option>lexon</option>
                  <option>liquid</option>
                  <option>lua</option>
                  <option>m3</option>
                  <option>markdown</option>
                  <option>mips</option>
                  <option>msdax</option>
                  <option>mysql</option>
                  <option>objective-c</option>
                  <option>pascal</option>
                  <option>pascaligo</option>
                  <option>perl</option>
                  <option>pgsql</option>
                  <option>php</option>
                  <option>pla</option>
                  <option>plaintext</option>
                  <option>postiats</option>
                  <option>powerquery</option>
                  <option>powershell</option>
                  <option>proto</option>
                  <option>pug</option>
                  <option>qsharp</option>
                  <option>r</option>
                  <option>razor</option>
                  <option>redis</option>
                  <option>redshift</option>
                  <option>restructuredtext</option>
                  <option>ruby</option>
                  <option>rust</option>
                  <option>sb</option>
                  <option>scala</option>
                  <option>scheme</option>
                  <option>scss</option>
                  <option>shell</option>
                  <option>sol</option>
                  <option>sparql</option>
                  <option>sql</option>
                  <option>st</option>
                  <option>swift</option>
                  <option>systemverilog</option>
                  <option>tcl</option>
                  <option>twig</option>
                  <option>typescript</option>
                  <option>vb</option>
                  <option>verilog</option>
                  <option>xml</option>
                  <option>yaml</option>
                  <option>Plain text</option>
                </select>
              </div>
              <LoadEditor setCode={setCode} language={language} height="40vh" />
              <div className="input-optional">
                <Field
                  name="filename"
                  placeholder="Filename (optional)"
                  render={buildInput}
                />
                <Field
                  name="description"
                  placeholder="Description (optional)"
                  render={buildInput}
                />
                <button type="submit" className="btn btn-primary create-loop">
                  Create loop
                </button>
              </div>
              {submitError ? (
                <div className="error-message show-editor-error">
                  {submitError}
                </div>
              ) : (
                <br className="show-editor-error" />
              )}
            </form>
          )}
        />
      </div>
    </main>
  );
};

const mapStateToProps = (state) => {
  return {
    editorTheme: state.auth.editorTheme,
  };
};
export default connect(mapStateToProps)(CreateLoop);
