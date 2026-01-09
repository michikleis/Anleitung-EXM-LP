export interface FormErrors {
  firstName?: string;
  email?: string;
  general?: string;
}

export interface WebhookPayload {
  firstName: string;
  email: string;
  timestamp: string;
  source: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  THANK_YOU = 'THANK_YOU',
}