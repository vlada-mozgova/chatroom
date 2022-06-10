import React, { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorHandler } from "../../helpers/authErrors";
import google from "../../images/google.png";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setErrorSlice,
  userSignIn,
  userSignInGoogle,
} from "../../redux/slices/authSlices";
import { RootState } from "../../redux/store";
import "../../styles/AuthPages.scss";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Message } from "../shared/Message";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { error, authenticated, loading } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(setErrorSlice(""));
    if (authenticated) navigate(`/chat?id=`);
  }, [authenticated, navigate, dispatch]);

  const registerWithGoogle = () => dispatch(userSignInGoogle());

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(userSignIn({ email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <p className="auth-title">Login</p>
        <p className="auth-description">
          Sign in with your <b>Google</b> account
        </p>
        <Button
          text="Sign in with Google"
          className="google"
          type="button"
          onClick={registerWithGoogle}
          disabled={false}
          image={google}
          classNamePic="google-pic"
        />
        <p className="auth-or">
          <span className="auth-line">or</span>
        </p>
        <form className="auth-shared" onSubmit={submitHandler}>
          {error && (
            <Message msg={errorHandler(error as string)} type={"danger"} />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            onChange={(e: any) => setEmail(e.currentTarget.value)}
          />
          <Input
            placeholder="Password"
            value={password}
            name="password"
            onChange={(e: any) => setPassword(e.currentTarget.value)}
          />
          <Button
            text={loading ? "Loading..." : "Sign In"}
            type="submit"
            onClick={submitHandler}
            disabled={loading}
          />
        </form>
        <Link to="/forgot-password" className="link text forgot">
          Forgot your password?
        </Link>
        <div className="link">
          Don't have an account?{" "}
          <Link to="/register" className="link text">
            Register
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};
