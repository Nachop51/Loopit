import LoadingSpinner from "../../assets/nobg.gif";

import { useRef } from "react";
import Editor from "@monaco-editor/react";
import { connect } from "react-redux";

const LoadEditor = ({ width, height, language, setCode, auth }) => {
  const editorRef = useRef(null);
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    editorRef.current.focus();
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  console.log(auth);

  return (
    <Editor
      width={width}
      height={height}
      language={language || "javascript"}
      theme={auth.editorTheme}
      loading={<img src={LoadingSpinner} alt="Spinner" className="spinner" />}
      options={{
        fontFamily: "Consolas",
        showUnused: true,
        tabSize: 2,
      }}
      onMount={handleEditorDidMount}
      defaultValue={"// here goes your code\n"}
      onChange={handleEditorChange}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(LoadEditor);
