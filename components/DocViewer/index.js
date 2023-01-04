import { useCallback } from "react";
import ReactDocViewer, { DocViewerRenderers, MSDocRenderer } from "react-doc-viewer";
import { SizeMe } from "react-sizeme";
import useDevToolsDetector from "../../useDevToolsDetector";
import "./docviewer.scss";

/**
 * 
 * @param {import("react").PropsWithoutRef<{
 *  url: string;
 *  maxHeight?: string | number;
 * }>} props 
 * @returns 
 */
const DocViewer = (props) => {
  const { url, maxHeight } = props;
  const { detectedDevTools } = useDevToolsDetector();

  const getMimeType = useCallback(() => {
    const fileExtension = url.slice(url.lastIndexOf(".") + 1);
    switch (fileExtension) {
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'ppt':
        return 'application/vnd.ms-powerpoint';
      case 'pptx':
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      default:
        return null;
    }
  }, [url]);

  /**
   * 
   * @param {number} width 
   * @param {"horizontal" | "vertial"} [orient]
   */
  const getHeight = (width, orient = "vertial") => {
    if (orient === "vertial") {
      if (width > 1400) return 1200;
      else if (width > 1200) return 1080;
      else if (width > 768) return 880;
      return 768;
    }
    if (width > 1400) return 520;
    else if (width > 1200) return 450;
    else if (width > 768) return 375;
    return 268;
  }

  const fileType = getMimeType(url);

  return !!fileType && !detectedDevTools && <SizeMe
    monitorHeight
    refreshRate={128}
    refreshMode="debounce"
  >{({ size }) => {
    return <div className="doc-viewer-container" style={{
      height: getHeight(size?.width ?? 0, fileType === "application/vnd.ms-powerpoint" || fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ? "horizontal" : "vertial"),
      maxHeight: maxHeight ?? undefined
    }}
      onClick={(evt) => evt.preventDefault()}
      onContextMenu={(evt) => evt.preventDefault()}
    >
      <ReactDocViewer
        documents={[{ uri: url, fileType: getMimeType(url) }]}
        pluginRenderers={[...DocViewerRenderers, MSDocRenderer]}
        config={{
          header: {
            disableHeader: true
          }
        }}
        style={{ height: "100%" }}
      />
      <div className="doc-viewer-container-bottom" />
    </div>
  }}
  </SizeMe >
}

export default DocViewer;