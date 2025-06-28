import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Input from "@/Components/Input";
import Label from "@/Components/Label";
import Button from "@/Components/Button";
import Link from "@/Components/Link";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Form from "@/Components/Form";

import { login } from "@/Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStateContext();

  // Redirect jika sudah login
  if (user) return <Navigate to="/admin" />;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = form;

    try {
      const user = await login(email, password);
      setUser(user); // ini akan simpan ke context + localStorage
      toastSuccess("Login berhasil");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 10); // beri waktu React update context
    } catch (err) {
      toastError(err.message);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <Heading as="h2" className="text-center mb-4">
        Login
      </Heading>

      <Form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="Masukkan email" required />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" value={form.password} onChange={handleChange} placeholder="Masukkan password" required />
        </div>

        <div className="flex justify-between items-center">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" name="remember" />
            <span className="text-sm text-gray-600">Ingat saya</span>
          </label>
          <Link href="#" className="text-sm">
            Lupa password?
          </Link>
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </Form>

      <p className="text-sm text-center text-gray-600 mt-4">
        Belum punya akun? <Link href="#">Daftar</Link>
      </p>
    </Card>
  );
};

export default Login;
