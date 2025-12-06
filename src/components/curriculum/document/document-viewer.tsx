"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  File,
  FileCode,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentViewerProps {
  documentUrl: string | null;
  documentTitle?: string;
  documentType?: string | null;
  className?: string;
}

type DocumentFileType =
  | "pdf"
  | "text"
  | "word"
  | "presentation"
  | "spreadsheet"
  | "unknown";

/**
 * Detect the document type from URL and/or database document_type field
 */
function getDocumentType(
  url: string | null,
  dbDocumentType: string | null | undefined
): DocumentFileType {
  // First, try to use the database document_type (MIME type) if available
  if (dbDocumentType) {
    const lower = dbDocumentType.toLowerCase();
    // Check for PDF MIME types
    if (lower === "application/pdf" || lower.includes("pdf")) return "pdf";
    // Check for text MIME types
    if (
      lower.startsWith("text/") ||
      lower === "text/plain" ||
      lower.includes("text")
    )
      return "text";
    // Check for Word MIME types
    if (
      lower.includes("msword") ||
      lower.includes("wordprocessingml") ||
      lower.includes("word") ||
      lower.includes("doc")
    )
      return "word";
    // Check for PowerPoint MIME types
    if (
      lower.includes("presentationml") ||
      lower.includes("powerpoint") ||
      lower.includes("ppt")
    )
      return "presentation";
    // Check for Excel MIME types
    if (
      lower.includes("spreadsheetml") ||
      lower.includes("excel") ||
      lower.includes("xls")
    )
      return "spreadsheet";
  }

  // Fall back to URL detection
  if (!url) return "unknown";

  const lower = url.toLowerCase();

  // Check for file extension
  if (lower.endsWith(".pdf") || lower.match(/\.pdf(\?|$)/)) return "pdf";
  if (lower.match(/\.(txt|sql|rtf|md|markdown)(\?|$)/)) return "text";
  if (lower.match(/\.(doc|docx)(\?|$)/)) return "word";
  if (lower.match(/\.(ppt|pptx)(\?|$)/)) return "presentation";
  if (lower.match(/\.(xls|xlsx|csv)(\?|$)/)) return "spreadsheet";

  // Check for PDF in Cloudinary raw URLs or filename
  // Cloudinary raw URLs might look like: .../raw/upload/.../filename.pdf or .../filename
  if (lower.includes("cloudinary.com") && lower.includes("/raw/")) {
    // Check if filename contains pdf
    const filename = lower.split("/").pop()?.split("?")[0] || "";
    if (filename.includes("pdf") || lower.includes(".pdf")) return "pdf";

    // For Cloudinary raw URLs, try to extract filename and check extension
    // Cloudinary URLs: https://res.cloudinary.com/.../raw/upload/v123/axioquan/documents/filename.pdf
    const pathParts = lower.split("/");
    const documentsIndex = pathParts.findIndex((part) => part === "documents");
    if (documentsIndex >= 0 && documentsIndex < pathParts.length - 1) {
      const potentialFilename = pathParts[documentsIndex + 1].split("?")[0];
      if (potentialFilename.includes(".pdf")) return "pdf";
      if (potentialFilename.match(/\.(txt|sql|rtf|md|markdown)$/))
        return "text";
      if (potentialFilename.match(/\.(doc|docx)$/)) return "word";
      if (potentialFilename.match(/\.(ppt|pptx)$/)) return "presentation";
      if (potentialFilename.match(/\.(xls|xlsx|csv)$/)) return "spreadsheet";
    }
  }

  // Check if URL path contains document type indicators
  if (lower.includes(".pdf") || lower.includes("/pdf")) return "pdf";

  // Last resort: if it's a Cloudinary raw URL and we can't determine type,
  // check if the URL contains any file extension hints in the path
  if (lower.includes("cloudinary.com") && lower.includes("/raw/")) {
    // Try to find any file extension in the entire URL
    const extensionMatch = lower.match(
      /\.(pdf|txt|sql|doc|docx|ppt|pptx|xls|xlsx|csv|rtf|md|markdown)(\?|$|\/)/
    );
    if (extensionMatch) {
      const ext = extensionMatch[1].toLowerCase();
      if (ext === "pdf") return "pdf";
      if (["txt", "sql", "rtf", "md", "markdown"].includes(ext)) return "text";
      if (["doc", "docx"].includes(ext)) return "word";
      if (["ppt", "pptx"].includes(ext)) return "presentation";
      if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
    }
  }

  return "unknown";
}

/**
 * Extract filename from URL
 */
function getFileNameFromUrl(url: string): string {
  if (!url) return "document";
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split("/").pop() || "document";
  } catch {
    return url.split("/").pop() || "document";
  }
}

/**
 * Get document type display name
 */
function getDocumentTypeName(type: DocumentFileType): string {
  switch (type) {
    case "pdf":
      return "PDF Document";
    case "text":
      return "Text File";
    case "word":
      return "Word Document";
    case "presentation":
      return "PowerPoint Presentation";
    case "spreadsheet":
      return "Spreadsheet";
    default:
      return "Document";
  }
}

/**
 * Get icon for document type
 */
function getDocumentIcon(type: DocumentFileType) {
  switch (type) {
    case "pdf":
      return <FileText className="h-12 w-12 text-red-600" />;
    case "text":
      return <FileCode className="h-12 w-12 text-blue-600" />;
    case "word":
      return <File className="h-12 w-12 text-blue-600" />;
    case "presentation":
      return <File className="h-12 w-12 text-orange-600" />;
    case "spreadsheet":
      return <File className="h-12 w-12 text-green-600" />;
    default:
      return <File className="h-12 w-12 text-gray-600" />;
  }
}

export function DocumentViewer({
  documentUrl,
  documentTitle,
  documentType,
  className,
}: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [detectedMimeType, setDetectedMimeType] = useState<string | null>(null);

  // Generate proxy URL for documents that need correct Content-Type headers
  // Cloudinary raw files often don't set the correct Content-Type, which prevents PDF rendering
  const getProxyUrl = (url: string | null): string | null => {
    if (!url) return null;

    // Only use proxy for Cloudinary raw files (they often don't set correct Content-Type)
    if (url.includes("cloudinary.com") && url.includes("/raw/")) {
      // Encode URL to base64 for the API route (browser-compatible)
      const encodedUrl = btoa(encodeURIComponent(url));
      return `/api/documents/${encodedUrl}`;
    }

    // For other URLs, use directly
    return url;
  };

  const proxyUrl = getProxyUrl(documentUrl);

  // If document_type is null and it's a Cloudinary URL, try to detect from Content-Type header
  useEffect(() => {
    if (
      !documentType &&
      documentUrl &&
      documentUrl.includes("cloudinary.com")
    ) {
      // Fetch just the headers to detect Content-Type
      fetch(documentUrl, { method: "HEAD" })
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if (contentType) {
            setDetectedMimeType(contentType);
          }
        })
        .catch((error) => {
          // Silently fail - we'll fall back to URL detection
          console.warn("Failed to detect Content-Type:", error);
        });
    }
  }, [documentUrl, documentType]);

  // Use detected MIME type if document_type is null
  const effectiveDocumentType = documentType || detectedMimeType;
  const docType = getDocumentType(documentUrl, effectiveDocumentType);
  const fileName = documentUrl ? getFileNameFromUrl(documentUrl) : "document";
  const displayTitle = documentTitle || fileName;

  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === "development") {
    console.log("DocumentViewer Debug:", {
      documentUrl,
      documentType,
      detectedMimeType,
      effectiveDocumentType,
      detectedType: docType,
      fileName,
    });
  }

  // Handle PDF iframe load - verify PDF is accessible and add timeout
  useEffect(() => {
    if (docType === "pdf" && documentUrl) {
      setIsLoading(true);
      setLoadError(null);

      // First, verify the PDF is accessible by checking headers
      fetch(documentUrl, { method: "HEAD" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`PDF not accessible: ${response.statusText}`);
          }
          const contentType = response.headers.get("content-type");
          if (contentType && !contentType.includes("pdf")) {
            console.warn("Content-Type mismatch:", contentType);
          }
        })
        .catch((error) => {
          console.error("PDF accessibility check failed:", error);
          // Don't set error yet - let iframe try to load
        });

      // Set a timeout to detect if the iframe fails to load
      // Some browsers don't fire onError for iframes, so we use a timeout
      const timeoutId = setTimeout(() => {
        // Check if still loading after 10 seconds
        setIsLoading((prevLoading) => {
          if (prevLoading) {
            setLoadError(
              "PDF is taking longer than expected to load. The file may be large or there may be a connection issue. Try opening it in a new tab or downloading it."
            );
            return false;
          }
          return prevLoading;
        });
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeoutId);
    }
  }, [documentUrl, docType]);

  // Handle text file loading
  useEffect(() => {
    if (docType === "text" && documentUrl) {
      setIsLoadingText(true);
      setLoadError(null);

      fetch(documentUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to load text file: ${response.statusText}`);
          }
          return response.text();
        })
        .then((text) => {
          setTextContent(text);
          setIsLoadingText(false);
        })
        .catch((error) => {
          console.error("Error loading text file:", error);
          setLoadError(error.message || "Failed to load text file");
          setIsLoadingText(false);
        });
    }
  }, [documentUrl, docType]);

  const handleDownload = () => {
    if (!documentUrl) return;

    const link = document.createElement("a");
    link.href = documentUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!documentUrl) return;
    window.open(documentUrl, "_blank", "noopener,noreferrer");
  };

  if (!documentUrl) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No document available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // PDF Viewer
  if (docType === "pdf") {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          {/* Header with controls */}
          <div className="border-b bg-gray-50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-sm">{displayTitle}</h3>
                <p className="text-xs text-gray-500">
                  {getDocumentTypeName(docType)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="flex items-center space-x-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>

          {/* PDF Preview */}
          <div className="relative w-full" style={{ minHeight: "600px" }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Loading PDF...</p>
                </div>
              </div>
            )}

            {loadError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-4 z-10">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{loadError}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Use proxy URL to ensure correct Content-Type headers for PDF rendering */}
            <iframe
              key={proxyUrl || documentUrl}
              src={`${
                proxyUrl || documentUrl
              }#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0"
              style={{ minHeight: "600px" }}
              title={displayTitle}
              onLoad={(e) => {
                setIsLoading(false);
                setLoadError(null);
              }}
              onError={() => {
                setLoadError(
                  "Failed to load PDF. Please try downloading the file."
                );
                setIsLoading(false);
              }}
              allow="fullscreen"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Text File Viewer
  if (docType === "text") {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          {/* Header with controls */}
          <div className="border-b bg-gray-50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileCode className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-sm">{displayTitle}</h3>
                <p className="text-xs text-gray-500">
                  {getDocumentTypeName(docType)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="flex items-center space-x-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>

          {/* Text Content */}
          <div className="p-6">
            {isLoadingText ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Loading text file...</p>
                </div>
              </div>
            ) : loadError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{loadError}</AlertDescription>
              </Alert>
            ) : textContent !== null ? (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 overflow-x-auto">
                  {textContent}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Unable to load text content</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Word/Office Documents - Coming Soon
  if (
    docType === "word" ||
    docType === "presentation" ||
    docType === "spreadsheet"
  ) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8">
            {getDocumentIcon(docType)}
            <h3 className="text-lg font-semibold mb-2 mt-4">{displayTitle}</h3>
            <p className="text-gray-600 mb-2">{getDocumentTypeName(docType)}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Preview coming soon!</strong>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Document preview for {getDocumentTypeName(docType)} files is
                currently under development. You can download the file to view
                it.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Button
                onClick={handleDownload}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Document</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleOpenInNewTab}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in New Tab</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Unknown/Unsupported Document Type
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="text-center py-8">
          <File className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">{displayTitle}</h3>
          <p className="text-gray-600 mb-4">
            This document type is not currently supported for preview.
          </p>
          <Button
            onClick={handleDownload}
            className="flex items-center space-x-2 mx-auto"
          >
            <Download className="h-4 w-4" />
            <span>Download Document</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
