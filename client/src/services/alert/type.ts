export enum AlertType {
  ERROR = 'error',
  INFO = 'info',
}

export interface ButtonData {
  onClick?: () => void;
  value: string;
}

export interface AlertData {
  message: string;
  title: string;
  buttons?: ButtonData[];
  type: AlertType;
}
