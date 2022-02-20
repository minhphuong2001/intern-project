export interface IPayrollData {
    approved: boolean;
    canceled: boolean;
    company_id: string;
    confirmed: boolean;
    currency: string;
    date_canceled: null;
    date_confirmed: string;
    date_fulfilled: null;
    date_matched: string;
    date_processed: string;
    date_received: string;
    date_released: null;
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
    client: string;
    dateFrom: Date | string | null;
    dateTo: Date | string| null;
    invoice: string;
}
export interface IFilterPayrollValidation {
    status: string;
    client: string;
    dateFrom: Date | string| null;
    dateTo: Date | string| null;
    invoice: string;
}