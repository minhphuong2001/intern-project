import { createCustomAction, ActionType, getType } from 'typesafe-actions';
import { IPayrollData } from "../../../models/payroll";

export interface PayrollState {
    payrolls: Array<IPayrollData>;
}

export const setPayroll = createCustomAction('payrolls/setPayroll', (data: Array<IPayrollData>) => ({
    data
}));


const actions = { setPayroll };
type Action = ActionType<typeof actions>;

export default function reducer(state: PayrollState = {payrolls: []}, action: Action) {
    switch (action.type) {
        case getType(setPayroll): 
            return {
                ...state,
                payrolls: action.data
            }
        default:
            return state;
    }
}