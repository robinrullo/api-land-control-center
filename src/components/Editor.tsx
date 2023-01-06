import {FC} from "react";
import MonacoEditor, {OnChange as MonacoChange} from "@monaco-editor/react";

export type EditorProps = { height?: number, value?: string, defaultValue?: string, lang?: 'javascript', onChange: MonacoChange, }
export const Editor: FC<EditorProps> = ({height, value, defaultValue, lang, onChange}) => {

  return <MonacoEditor
      height={height ?? 300}
      value={value}
      defaultValue={defaultValue ?? "foo('bar');"}
      language={lang ?? "javascript"}
      onChange={onChange}
  />
}
