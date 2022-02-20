import { IFilterPayrollValidation, ListParams } from './../../../models/payroll';

const validateField = (field: string, value: string | Date | null) => {
    if (value) return;
    let fieldRequire = '';

    switch (field) {
        case 'status':
            fieldRequire = 'Status is required.'
            break;
        case 'client':
            fieldRequire = 'Client is required.'
            break;
        case 'dateFrom':
            fieldRequire = 'Date from is required.'
            break;
        case 'dateTo':
            fieldRequire = 'Date to is required.'
            break;
        case 'invoice':
            fieldRequire = 'Invoice is required.'
            break;
    }

    return fieldRequire;
}

export const validateFilterPayroll = (values: ListParams): IFilterPayrollValidation => {
    return {
        status: validateField('status', values.status) as string,
        client: validateField('client', values.client) as string,
        dateFrom: validateField('dateFrom', values.dateFrom) as string,
        dateTo: validateField('dateTo', values.dateTo) as string,
        invoice: validateField('invoice', values.invoice) as string,
    }
}

export const validFilterPayroll = (values: IFilterPayrollValidation) => {
    return !values.status && !values.client && !values.dateFrom && !values.dateTo && !values.invoice;
};
  