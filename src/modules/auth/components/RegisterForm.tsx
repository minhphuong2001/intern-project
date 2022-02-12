import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { ILocationParams, IRegisterParams, IRegisterValidation } from '../../../models/auth';
import { validateRegister, validRegister } from '../utils';

interface Props {
    onRegister(values: IRegisterParams): void;
    loading: boolean;
    errorMessage: string;
    locations: Array<ILocationParams>;
    cities: Array<ILocationParams>;
    getCities(pid: number | string): void;
}

const RegisterForm = (props: Props) => {
    const { onRegister, loading, errorMessage, locations, cities, getCities } = props;

    const [formValues, setFormValues] = React.useState<IRegisterParams>({
        email: '',
        password: '',
        repeatPassword: '',
        name: '',
        gender: '',
        region: '',
        state: ''
    });

    const [validate, setValidate] = React.useState<IRegisterValidation>();

    const onSubmit = () => {
        console.log(formValues);
        const validate = validateRegister(formValues);

        setValidate(validate);

        if (!validRegister(validate)) {
            return;
        }

        onRegister(formValues);
    }

    return (
        <form
            style={{ maxWidth: '500px', width: '100%' }}
            noValidate
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="row g-3 needs-validation"
            >
            {!!errorMessage && (
                <div className="alert alert-danger" role="alert" style={{ width: '100%' }}>
                {errorMessage}
                </div>
            )}

            <div className="col-md-12">
                <label htmlFor="inputEmail" className="form-label">
                <FormattedMessage id="email" />
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="inputEmail"
                    value={formValues.email}
                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                />

                {!!validate?.email && (
                <small className="text-danger">
                    <FormattedMessage id={validate?.email} />
                </small>
                )}
            </div>

            <div className="col-md-12">
                <label htmlFor="inputPassword" className="form-label">
                <FormattedMessage id="password" />
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                    value={formValues.password}
                    onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
                />

                {!!validate?.password && (
                <small className="text-danger">
                    <FormattedMessage id={validate?.password} />
                </small>
                )}
            </div>
        
            <div className="col-md-12">
                <label htmlFor="inputConfirmPassword" className="form-label">
                    <FormattedMessage id="confirmPassword" />
                </label>
                <input
                    type="password"
                    className="form-control"
                    id="inputConfirmPassword"
                    value={formValues.repeatPassword}
                    onChange={(e) => setFormValues({ ...formValues, repeatPassword: e.target.value })}
                />

                {!!validate?.repeatPassword && (
                    <small className="text-danger">
                        <FormattedMessage id={validate?.repeatPassword} />
                    </small>
                )}
            </div>

            <div className='col-md-12'>
                <label htmlFor="name" className="form-label">
                    <FormattedMessage id="name" />
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={formValues.name}
                    onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                />
                {!!validate?.name && (
                    <small className="text-danger">
                        <FormattedMessage id={validate?.name} />
                    </small>
                )}
            </div>
            
            <div className='col-md-12'>
                <label htmlFor="gender" className="form-label">
                    <FormattedMessage id="gender" />
                </label>
                <select
                    className="form-select"
                    id='gender'
                    value={formValues.gender}
                    onChange={(e) => setFormValues({...formValues, gender: e.target.value})}
                >
                    <option selected>--Chọn giới tính--</option>
                    <option value="female">Nữ</option>
                    <option value="male">Nam</option>
                    <option value="male">Khác</option>
                </select>
                {!!validate?.gender && (
                    <small className="text-danger">
                        <FormattedMessage id={validate?.gender} />
                    </small>
                )}
            </div>

            <div className='col-md-12'>
                <label htmlFor="region" className="form-label">
                    <FormattedMessage id="region" />
                </label>
                <select
                    className="form-select"
                    id='region'
                    value={formValues.region}
                    onChange={(e) => {
                        setFormValues({ ...formValues, region: e.target.value })
                        getCities(e.target.value)
                    }}
                >
                    <option disabled selected value=''>--Chọn quốc gia--</option>
                    {
                        locations.map((location: ILocationParams, index: number) => (
                            <option key={index} value={location.id}>{location.name}</option>
                        ))
                    }
                </select>

                {!!validate?.region && (
                    <small className="text-danger">
                        <FormattedMessage id={validate?.region} />
                    </small>
                )}
            </div>
            
            {formValues.region ? (
                <div className='col-md-12'>
                    <label htmlFor="state" className="form-label">
                        <FormattedMessage id="state" />
                    </label>
                    <select
                        className="form-select"
                        id="state"
                        value={formValues.state}
                        onChange={(e) => setFormValues({...formValues, state: e.target.value})}
                    >
                        <option disabled selected value=''>--Chọn thành phố--</option>
                        {
                            cities.map((city: ILocationParams, index: number) => (
                                <option key={index} value={city.id}>{city.name}</option>
                            ))
                        }
                    </select>
                    {!!validate?.state && (
                        <small className="text-danger">
                            <FormattedMessage id={validate?.state} />
                        </small>
                    )}
                </div>
            ) : (<div className='col-md-12'>
                    <label htmlFor="state" className="form-label">
                        <FormattedMessage id="state" />
                    </label>
                    <select
                        disabled
                        className="form-select"
                        id="state"
                        value={formValues.state}
                        onChange={(e) => setFormValues({...formValues, state: e.target.value})}
                    >
                    </select>
                    {!!validate?.state && (
                        <small className="text-danger">
                            <FormattedMessage id={validate?.state} />
                        </small>
                    )}
                </div>
            )}

            <div>
                <Link to='/login'>Đã có tài khoản</Link>
            </div>

            <div className="row justify-content-md-center" style={{ margin: '16px 0' }}>
                <div className="col-md-auto">
                <button
                    className="btn btn-primary"
                    type="submit"
                    style={{ minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    disabled={loading}
                >
                    {loading && <div className="spinner-border spinner-border-sm text-light mr-2" role="status" />}
                    <FormattedMessage id="register" />
                </button>
                </div>
            </div>
        </form>
    );
};

export default RegisterForm;
