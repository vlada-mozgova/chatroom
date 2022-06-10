import React, { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { errorHandler } from "../../helpers/authErrors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  sendPasswordReset,
  setErrorSlice,
} from "../../redux/slices/authSlices";
import { RootState } from "../../redux/store";
import "../../styles/AuthPages.scss";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Message } from "../shared/Message";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");

  const dispatch = useAppDispatch();

  const { error, success, loading } = useAppSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    dispatch(setErrorSlice(""));
  }, [dispatch]);
  const successMsg = "Email sent!";

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(sendPasswordReset({ email, successMsg }));
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <p className="auth-title">Reset password</p>
        <form className="auth-shared forgot" onSubmit={submitHandler}>
          {error && (
            <Message msg={errorHandler(error as string)} type={"danger"} />
          )}
          {success && <Message msg={success} type={"success"} />}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            onChange={(e: any) => setEmail(e.currentTarget.value)}
          />
          <Button
            text={loading ? "Loading..." : "Send password reset email"}
            className=""
            type="submit"
            onClick={submitHandler}
            disabled={loading}
          />
          <Link to="/login" className="link text">
            Return to Login
          </Link>
        </form>
      </div>
    </div>
  );
};
