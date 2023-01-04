import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import DocViewer from "./components/DocViewer";
import PDFViewer from "./components/PDFViewer";

/**
 * 
 * @param {import("react").PropsWithoutRef<{
 *  url: string;
 *  pagination?: boolean;
 *  maxHeight?: string | number;
 * }>} props 
 * @returns 
 */
const App = (props) => {
  const {
    url: uri = "",
    pagination,
    maxHeight
  } = props;

  const fileExtension = useMemo(() => uri.slice(uri.lastIndexOf(".") + 1), [uri]);
  if (!fileExtension) return <></>;
  if (fileExtension === "pdf") {
    return <PDFViewer url={uri} pagination={pagination} />
  }
  return <DocViewer url={uri} maxHeight={maxHeight} />
};

/**
 * 
 * @param {{
 *  url: string;
 *  rootId?: string;
 *  pagination?: boolean;
 *  maxHeight?: string | number;
 * }} args 
 */
export const init = (args) => {
  const {
    url,
    rootId = "root",
    pagination,
    maxHeight
  } = args;

  ReactDOM.render(<App url={url} pagination={pagination} maxHeight={maxHeight} />, document.getElementById(rootId));
}

// init({
//   url: "https://storage.googleapis.com/kslearning/00-Introduction.pdf",
//   // url: "https://storage.googleapis.com/kslearning/document/112393309-1565707194688-de19.docx",
//   pagination: true
// });