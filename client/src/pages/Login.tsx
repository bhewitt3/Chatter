import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./login.css";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/background.jpg";
import Logo from "../assets/logo.png";
import type { LoginCredentials } from "../types/user";
import type { User } from "../types/user";
import { login } from "../api/api_user";
import type { ApiResponse } from "../types/api";
import { useAuth } from "../context/AuthContext";
const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const initialCredentials: LoginCredentials = {
    username: '',
    password: ''
  }
  const [inputCredentials, setInputCredentials] = useState(initialCredentials);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try{
      const response: ApiResponse<User> = await login(inputCredentials);

      if(response.type === 'success' && response.data){
        setLoading(false);
        setUser(response.data)
        navigate('/dashboard');
      }
      else if (response.type === 'error'){
        setError(response.message);
        setLoading(false);
      }
    } catch(err){
      setError("An error occurred while logging in.")
      setLoading(false);
    }
  };

  return (
    <div
      className="sign-in__wrapper"
       style={{ backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${BackgroundImage})` }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {/* Header */}
        <img
          className="img-thumbnail mx-auto d-block mb-2 bg-white"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign In</div>
        {/* Alert */}
        <p className="error-message">{error}</p>
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={inputCredentials.username}
            placeholder="Username"
            onChange={(e) => setInputCredentials({...inputCredentials, username: e.target.value})}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputCredentials.password}
            placeholder="Password"
            onChange={(e) => setInputCredentials({...inputCredentials, password: e.target.value})}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => navigate('/register')}
          >
            No account? Sign up!
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
