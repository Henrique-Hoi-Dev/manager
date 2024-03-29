import React from 'react';
import { useDispatch } from 'react-redux';
import logo from '~/assets/logo.svg';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { signUpRequest } from '~/store/modules/auth/actions';

const schema = Yup.object().shape({
  name: Yup.string().required('! Nome é Obrigatório.'),
  email: Yup.string()
    .email('! Insira um e-mail válido.')
    .required('! O e-mail é obrigatório.'),
  password: Yup.string()
    .min(6, '! No mínimo 6 caracteres')
    .required('! A Senha é obrigatória.'),
});

export default function SignUp() {
  const dispatch = useDispatch();

  function handleSubmit({ name, email, password }) {
    dispatch(signUpRequest(name, email, password));
  }

  return (
    <>
      <img src={logo} alt="Gerenciador" />

      <Form schema={schema} onSubmit={handleSubmit}>
        <Input name="name" placeholder="Seu nome completo" />
        <Input name="email" type="email" placeholder="Seu e-mail" />
        <Input name="password" type="password" placeholder="Sua senha" />

        <button type="submit">Cadastrar</button>
        <Link to="/">já sou cadastrado</Link>
      </Form>
    </>
  );
}
