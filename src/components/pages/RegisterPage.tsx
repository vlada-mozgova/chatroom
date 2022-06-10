import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../../firebase/config";
import { errorHandler } from "../../helpers/authErrors";
import google from "../../images/google.png";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setErrorSlice,
  userSignInGoogle,
  userSignUp
} from "../../redux/slices/authSlices";
import { RootState } from "../../redux/store";
import "../../styles/AuthPages.scss";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Message } from "../shared/Message";

export const RegisterPage: React.FC = () => {
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [imageAsFile, setImageAsFile] = useState("");
  const [imageUrl, setImageAsUrl] = useState("");

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

  const onChange = (e: any) => {
    setImageAsFile(e.currentTarget.files[0]);
  };

  const uploadedFiles = (file: any) => {
    if (!file) return;
    console.log("start of upload");
    const storageRef = ref(storage, `/images/${file.name}`);
    const uploadtask = uploadBytesResumable(storageRef, file);

    uploadtask.on(
      "state_changed",
      (snapshot) => {
        console.log("uploaded");
      },
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then((url) => {
          setImageAsUrl(url);
        });
      }
    );
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    uploadedFiles(imageAsFile);
    dispatch(userSignUp({ email, firstname, password, imageUrl }));
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <p className="auth-title">Registration</p>
        <p className="auth-description">
          Sign up with your <b>Google</b> account
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
            required={false}
            className="photo"
            type="file"
            name="photo"
            onChange={onChange}
          />
          <Input
            placeholder="Firstname"
            value={firstname}
            name="firstaname"
            onChange={(e: any) => setFirstname(e.currentTarget.value)}
          />
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
            text={loading ? "Loading..." : "Sign Up"}
            type="submit"
            onClick={submitHandler}
            disabled={loading}
          />
        </form>
        <div className="link">
          Already have an account?{" "}
          <Link to="/login" className="link text">
            Login
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};
