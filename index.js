import React, { Fragment, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  pdfjs,
  Document as PDFDocument,
  Page as PDFPage
} from "react-pdf";
import { SizeMe } from "react-sizeme";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import Select from "react-select";
import devTools from "devtools-detect";
import "./index.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * 
 * @param {import("react").PropsWithoutRef<{
 *  url: string;
 *  pagination?: boolean;
 *  classes?: {
 *   container?: string;
 *   pagination?: string;
 *  }
 * }>} props 
 * @returns 
 */
const App = (props) => {
  const {
    url: uri,
    pagination,
    classes = {
      container: "",
      pagination: ""
    }
  } = props;
  /**
   * @type {[Uint8Array | null, import("react").Dispatch<import("react").SetStateAction<Uint8Array | null>>]}
   */
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const [showPages, setShowPages] = useState(10);

  const arrPages = useMemo(() => {
    return pagination ? new Array(showPages).fill(null) : new Array(totalPage).fill(null)
  }, [pagination, totalPage, showPages]);

  const pageCount = useMemo(() => Math.ceil((totalPage) / showPages), [totalPage, showPages]);
  const lastPage = useMemo(() => {
    const lastPage = page * showPages + showPages;
    return lastPage > totalPage ? totalPage : lastPage;
  }, [page, showPages, totalPage])

  return <div className={`pdf-viewer-container ${classes.container}`} onContextMenu={(evt) => evt.preventDefault()}>
    <SizeMe
      monitorHeight
      refreshRate={128}
      refreshMode="debounce"
    >{({ size }) => <>
      {!loading && pagination && <div className={`pdf-viewer-pagination ${classes.pagination}`} style={{ width: size.width }}>
        <div className="pdf-viewer-pagination-wrap">
          <div className="pdf-viewer-pagination-main">
            <div className="pdf-viewer-pagination-item">
              <label>Show Pages</label>
              <Select
                value={showPages}
                onChange={({ value }) => {
                  setPage(0)
                  setShowPages(value);
                }}
                options={[10, 25, 50, 100].map((value) => ({ value, label: `${value}` }))}
                placeholder={`${showPages}`}
              />
            </div>
            <div className="pdf-viewer-pagination-item">
              <div className="pdf-viewer-pagination-range">
                {page * showPages + 1}-{lastPage} of {totalPage}
              </div>
              <div className={`pdf-viewer-pagination-nav nav-back${page <= 1 ? " disabled" : ""}`} onClick={() => {
                setPage((page) => page > 1 ? page - 1 : page)
              }}>
                <ChevronLeftIcon fill={page <= 1 ? "#ccc" : undefined} />
              </div>
              <div className={`pdf-viewer-pagination-nav nav-next${page + 1 >= pageCount ? " disabled" : ""}`} onClick={() => {
                setPage((page) => page + 1 < pageCount ? page + 1 : page);
              }}>
                <ChevronRightIcon fill={page + 1 >= pageCount ? "#ccc" : undefined} />
              </div>
            </div>
          </div>
        </div>
      </div>}
      {!devTools.isOpen && <PDFDocument
        className="pdf-document"
        file={uri}
        loading={<>Loading...</>}
        onLoadSuccess={(doc) => {
          doc.getData().then((data) => setFileData(data));
          setTotalPage(doc._pdfInfo?.numPages ?? 0);
          setLoading(false);
        }}
      >
        {arrPages.map((_, idx) => {
          const pageIndex = pagination ? idx + showPages * page : idx;
          return <Fragment key={idx}>
            {(!pagination || pageIndex < totalPage) && <PDFPage
              width={size.width}
              key={idx}
              className="pdf-page"
              pageIndex={pageIndex}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />}
          </Fragment>
        })}
      </PDFDocument>}
    </>}
    </SizeMe>
  </div>
};

/**
 * 
 * @param {{
 *  url: string;
 *  rootId?: string;
 *  pagination?: boolean;
 *  classes?: {
 *   container?: string;
 *   pagination?: string;
 *  }
 * }} args 
 */
export const init = (args) => {
  const {
    url,
    rootId = "root",
    pagination,
    classes
  } = args;

  ReactDOM.render(<App url={url} pagination={pagination} classes={classes} />, document.getElementById(rootId));
}

init({
  url: "https://storage.googleapis.com/kslearning/00-Introduction.pdf",
  pagination: true
});