export interface FileManagerResponse {
  url: string;
  key: string;
}

export interface FormattedFileItem {
  id: string;
  url: string;
  key: string;
  name: string;
  extension: string;
}

export interface FileManagerRequest {}
