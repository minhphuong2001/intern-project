import { LIST_STATUS } from './../../../utils/constants';
import { IFilterPayrollValidation, ListParams } from './../../../models/payroll';

const validateStatus = (status: string) => {
    const statusList = [...LIST_STATUS];
    if (statusList.indexOf(status) === -1) {
        return 'Status is required.'
    }
    return '';
}

const validateDate = (dateFrom: Date, dateTo: Date) => {
    if (!dateFrom || !dateTo) {
        return 'Date is required.'
    }
    if (dateFrom > dateTo) {
        return 'The date to must be greater than the date from.'
    }
    return '';
}

const validateOrder = (order: string) => {
    if (!order) {
        return 'Order is required.'
    }
    return '';
}

export const validateField = (field: string, value: string | Date | null) => {
    if (value) return;
    let fieldRequire = '';

    switch (field) {
        case 'status':
            fieldRequire = 'Status is required.'
            break;
        case 'dateFrom':
            fieldRequire = 'Date from is required.'
            break;
        case 'dateTo':
            fieldRequire = 'Date to is required.'
            break;
        case 'order':
            fieldRequire = 'Order is required.'
            break;
    }

    return fieldRequire;
}

export const validateFilterPayroll = (values: ListParams): IFilterPayrollValidation => {
    return {
        status: validateStatus(values.status),
        dateFrom: validateDate(values.dateFrom, values.dateTo),
        dateTo: validateDate(values.dateFrom, values.dateTo),
        order: validateOrder(values.order),
    }
}

export const validFilterPayroll = (values: IFilterPayrollValidation) => {
    return !values.status && !values.dateFrom && !values.dateTo && !values.order;
};
  