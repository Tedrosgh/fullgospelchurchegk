import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Input from "./Input";
import { signin, signup } from "../../actions/auth";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = () => {
    setIsSignup((current) => !current);
    setShowPassword(false);
    setFormData(initialState);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isSignup && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const result = await dispatch(isSignup ? signup(formData) : signin(formData));
    setSubmitting(false);

    if (result.confirmationRequired) {
      setIsSignup(false);
      setFormData(initialState);
      setError(result.message);
    } else if (result.ok) {
      history.push("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => (history.length > 1 ? history.goBack() : history.push("/"))}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {isSignup ? "Create account" : "Sign in"}
        </Typography>
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input name="firstName" label="First name" handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} autoFocus half />
                <Input name="lastName" label="Last name" handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} half />
              </>
            )}
            <Input name="email" label="Email address" handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} type="email" />
            <Input name="password" label="Password" handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} type={showPassword ? "text" : "password"} handleShowPassword={() => setShowPassword((shown) => !shown)} />
            {isSignup && <Input name="confirmPassword" label="Repeat password" handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} type="password" />}
          </Grid>
          <Button type="submit" fullWidth variant="contained" disabled={submitting} sx={{ mt: 3 }}>
            {submitting ? "Please wait…" : isSignup ? "Sign up" : "Sign in"}
          </Button>
          <Button fullWidth onClick={switchMode} sx={{ mt: 1 }}>
            {isSignup ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
