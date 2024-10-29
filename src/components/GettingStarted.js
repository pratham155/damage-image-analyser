import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./GettingStarted.css";
import { Button } from "antd";
import { ArrowLeftOutlined, FilePdfOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const GettingStarted = () => {
  const [numPages, setNumPages] = useState(null);

  const [fileOpened, setFileOpened] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePdfClick = () => {
    setFileOpened(true);
  };

  const handleBackClick = () => {
    setFileOpened(false);
  };

  return (
    <div className="pdf-container">
      {!fileOpened && (
        <div className="pdf-button">
          <Button
            type="primary"
            icon={<FilePdfOutlined />}
            size="large"
            onClick={handlePdfClick}
          >
            User manual
          </Button>
        </div>
      )}

      {fileOpened && (
        <div>
          <Button
            type="default"
            
            onClick={handleBackClick}
            className="back-button"
          >
           <FontAwesomeIcon icon={faCircleLeft} />
            Back
          </Button>

          <div className="pdf-wrapper">
            <Document
              file="/images/UserManual.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) =>
                console.error("Error loading PDF:", error)
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  className="pdf-page"
                />
              ))}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default GettingStarted;
