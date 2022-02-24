export interface IPayrollData {
    approved: boolean;
    canceled: boolean;
    company_id: string;
    confirmed: boolean;
    currency: string;
    date_canceled: string | null;
    date_confirmed: string | null;
    date_fulfilled: string | null;
    date_matched: string | null;
    date_processed: string | null;
    date_received: string | null;
    date_released: string | null;
    fees: number;
    fulfilled: boolean;
    is_premium: boolean;
    matched: boolean;
    number_of_recipients: number;
    payment_type: string;
    payroll_id: string;
    received: boolean;
    released: boolean;
    subpayroll_ids: Array<string>;
    time_created: string;
    volume_input_in_input_currency: number;
}

export interface IPayroll {
    company_id: string,
    from_date: any,
    meta: any,
    payrolls: IPayrollData[];
    to_date: any
}
export interface ListParams {
    status: string;
    dateFrom: Date;
    dateTo: Date;
    order: string;
}
export interface IFilterPayrollValidation {
    status: string;
    dateFrom: string;
    dateTo: string;
    order: string;
}

export interface IStatus {
    fulfilled: boolean;
    matched: boolean;
    received: boolean;
    canceled: boolean;
    approved: boolean;
}