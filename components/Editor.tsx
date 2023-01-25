import "react-quill/dist/quill.snow.css";

import ReactQuill from "react-quill";
import { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditorComponent({
  editorState,
  onEditorStateChange,
}: {
  editorState: string;
  onEditorStateChange: ReactQuillProps["onChange"];
}) {
  return (
    <ReactQuill
      theme="snow"
      value={editorState}
      onChange={onEditorStateChange}
    />
  );
}
