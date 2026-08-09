import React, { useEffect, useState } from "react";
import { Alert, Avatar, Button, Container, Grid, Paper, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Input from "./Input";
import { signin, signup } from "../../actions/auth";
import { requestPasswordReset, updatePassword } from "../../api/api";

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
    if (params.get("type") === "recovery" && token) {
      setRecoveryToken(token);
      setFeedback({ severity: "info", message: "Enter your new password." });
      history.replace("/auth");
    }
  }, [history]);

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

    if ((isSignup || recoveryToken) && formData.password !== formData.confirmPassword) {
      setFeedback({ severity: "error", message: "Passwords do not match." });
      return;
    }

    setSubmitting(true);
    if (recoveryToken) {
      try {
        await updatePassword(recoveryToken, formData.password);
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

    const result = await dispatch(isSignup ? signup(formData) : signin(formData));
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
          {!recoveryToken && <Button fullWidth onClick={switchMode} sx={{ mt: 1 }}>
            {isSignup ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </Button>}
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
