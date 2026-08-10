import React, { useEffect, useState } from "react";
import { Alert, Avatar, Button, Container, Grid, Paper, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Input from "./Input";
import { signin, signup } from "../../actions/auth";
import {
  completeAuthRedirect,
  requestPasswordReset,
  resendConfirmation,
  updatePassword,
} from "../../api/api";

const initialState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [recoveryToken, setRecoveryToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const redirectType = params.get("type");
    if (redirectType === "recovery" && token) {
      setRecoveryToken(token);
      setFeedback({ severity: "info", message: "Enter your new password." });
      history.replace("/auth");
    } else if (token) {
      setSubmitting(true);
      completeAuthRedirect(token, refreshToken)
        .then(({ data }) => {
          dispatch({ type: "AUTH", data });
          history.replace("/");
        })
        .catch((requestError) => {
          history.replace("/auth");
          setFeedback({
            severity: "error",
            message: requestError.response?.data?.msg || "The confirmation link could not be completed.",
          });
        })
        .finally(() => setSubmitting(false));
    }
  }, [dispatch, history]);

  const changeField = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const switchMode = () => {
    setIsSignup((current) => !current);
    setShowPassword(false);
    setFormData(initialState);
    setFeedback(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    // Read the submitted controls as well as React state. Browsers and password
    // managers can autofill an uncontrolled field without firing onChange.
    const submittedValues = Object.fromEntries(new FormData(event.currentTarget).entries());
    const submittedForm = {
      ...formData,
      ...submittedValues,
      email: String(submittedValues.email || formData.email || "").trim().toLowerCase(),
      password: String(submittedValues.password || formData.password || ""),
      confirmPassword: String(
        submittedValues.confirmPassword || formData.confirmPassword || ""
      ),
    };

    if (!recoveryToken && !submittedForm.email) {
      setFeedback({ severity: "error", message: "Enter your email address." });
      return;
    }

    if (!submittedForm.password) {
      setFeedback({ severity: "error", message: "Enter your password." });
      return;
    }

    if ((isSignup || recoveryToken) && submittedForm.password !== submittedForm.confirmPassword) {
      setFeedback({ severity: "error", message: "Passwords do not match." });
      return;
    }

    setSubmitting(true);
    if (recoveryToken) {
      try {
        await updatePassword(recoveryToken, submittedForm.password);
        setRecoveryToken("");
        setFormData(initialState);
        setFeedback({ severity: "success", message: "Password updated. You can now sign in." });
      } catch (requestError) {
        setFeedback({ severity: "error", message: requestError.response?.data?.message || "Unable to update your password." });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const result = await dispatch(isSignup ? signup(submittedForm) : signin(submittedForm));
    setSubmitting(false);
    if (result.confirmationRequired) {
      setIsSignup(false);
      setFormData(initialState);
      setFeedback({ severity: "success", message: result.message });
    } else if (result.ok) {
      history.replace(location.state?.from || "/");
    } else {
      setFeedback({ severity: "error", message: result.message });
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setFeedback({ severity: "warning", message: "Enter your email address first." });
      return;
    }
    setSubmitting(true);
    try {
      await requestPasswordReset(formData.email);
      setFeedback({ severity: "success", message: "Password reset email sent. Check your inbox." });
    } catch (requestError) {
      setFeedback({ severity: "error", message: requestError.response?.data?.message || "Unable to send the reset email." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendConfirmation = async (event) => {
    const email = String(
      new FormData(event.currentTarget.form).get("email") || formData.email
    ).trim();
    if (!email) {
      setFeedback({ severity: "warning", message: "Enter your email address first." });
      return;
    }
    setSubmitting(true);
    try {
      await resendConfirmation(email);
      setFeedback({ severity: "success", message: "A new confirmation email was sent." });
    } catch (requestError) {
      setFeedback({
        severity: "error",
        message: requestError.response?.data?.msg || requestError.message || "Unable to resend confirmation.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => (history.length > 1 ? history.goBack() : history.push("/"))} sx={{ mb: 2 }}>Back</Button>
        <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "secondary.main" }}><LockOutlinedIcon /></Avatar>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {recoveryToken ? "Reset password" : isSignup ? "Create account" : "Sign in"}
        </Typography>
        {feedback && <Alert severity={feedback.severity} sx={{ my: 2 }}>{feedback.message}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && !recoveryToken && (
              <>
                <Input name="firstName" label="First name" handleChange={changeField} autoFocus half />
                <Input name="lastName" label="Last name" handleChange={changeField} half />
              </>
            )}
            {!recoveryToken && <Input name="email" label="Email address" handleChange={changeField} type="email" />}
            <Input name="password" label={recoveryToken ? "New password" : "Password"} handleChange={changeField} type={showPassword ? "text" : "password"} handleShowPassword={() => setShowPassword((shown) => !shown)} />
            {(isSignup || recoveryToken) && <Input name="confirmPassword" label="Repeat password" handleChange={changeField} type="password" />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" disabled={submitting} sx={{ mt: 3 }}>
            {submitting ? "Please wait…" : recoveryToken ? "Update password" : isSignup ? "Sign up" : "Sign in"}
          </Button>
          {!isSignup && !recoveryToken && <Button fullWidth onClick={handleForgotPassword} disabled={submitting}>Forgot password?</Button>}
          {!isSignup && !recoveryToken && <Button fullWidth onClick={handleResendConfirmation} disabled={submitting}>Resend confirmation email</Button>}
          {!recoveryToken && <Button fullWidth onClick={switchMode} sx={{ mt: 1 }}>
            {isSignup ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </Button>}
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
