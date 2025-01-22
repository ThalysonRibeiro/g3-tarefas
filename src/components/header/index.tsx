"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import style from "./styles.module.css";
import logo from "../../../public/assets/logo.svg";
import Image from "next/image";


export function Header() {
  const { data: session, status } = useSession();


  return (
    <header className={style.header}>
      <section className={style.content}>
        <nav className={style.nav}>
          <Link href="/">
            <Image
              className={style.logo}
              alt="logo TaskHub"
              src={logo}
            />
          </Link>

          <Link href="/">
            <h1 className={style.nameLogo}>Task Hub</h1>
          </Link>

          <Link href="/dashboard"
            className={style.link}>
            Meu painel</Link>
        </nav>

        {status === "loading" ? (
          <></>
        ) : session ? (
          <button className={style.loginButton} onClick={() => signOut()}>
            Olá {session?.user?.name}
          </button>
        ) : (
          <button className={style.loginButton} onClick={() => signIn("google")}>
            Acessar
          </button>
        )}
      </section>
    </header>
  )
}