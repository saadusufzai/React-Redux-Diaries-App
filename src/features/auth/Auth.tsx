import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../../interfaces/user.interface";
import * as Yup from "yup";
import http from "../../services/api";
import { saveToken, setAuthState } from "./authSlice";
import { setUser } from "./userSlice";
import { AuthResponse } from "../../services/mirage/routes/user";
import { useAppDispatch } from "../store";

const schema = Yup.object().shape({
    username: Yup.string()
    .required('No Username ?')
    .max(16, ' Usename cannot be longer than 16 characters long '),
    password: Yup.string().required('Without a password ?,'),
    email: Yup.string().email('Please provide a valid email address (expample@gmail.com)'),
})

const Auth: FC = () => {
  const { handleSubmit, register, errors } = useForm<User>({
    // validationSchema: schema,
  });

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const submitForm = (data: User) => {
    const path = isLogin ? "/auth/login" : "/auth/signup";
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setAuthState(true));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  return (
      <div className="auth">
          <div className="card">
              <form onSubmit={handleSubmit(submitForm)}>
                  <div className="inputWrapper">
                      <input ref={register} name='username' placeholder='Username' />
                      {errors && errors.username && (
                          <p className="error">{errors.username.message}</p>
                      )}
                  </div>
                  <div className="inputWrapper">
                      <input ref={register}
                      name='password'
                      type='password'
                      placeholder='Password'
                      />
                      {errors && errors.password && (
                          <p className="error">{errors.password.message}</p>
                      )}
                  </div>
                  {!isLogin &&(
                      <div className="inputWrapper">
                          <input ref={register}
                          name='email'
                          placeholder='Email (optional)'
                          type="email"/>
                          {errors && errors.email && (
                              <p className="error">{errors.email.message}</p>
                          )}
                      </div>
                  )}
                  <div className="inputWrapper">
                      <button type="submit" disabled={loading} >
                          {isLogin ? 'Login' : ' Create account '}
                      </button>
                  </div>
                  <p onClick={()=> setIsLogin(!isLogin)}
                    style= {{cursor:'pointer', opacity: 0.7}}
                   >
                       {isLogin? 'No Account ? Create one ': ' Already have an account?'}
                   </p>
              </form>
          </div>
      </div>
  );
};

export default Auth;
