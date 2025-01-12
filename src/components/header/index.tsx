"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import style from "./styles.module.css";


export function Header() {
  const { data: session, status } = useSession();


  return (
    <header className={style.header}>
      <section className={style.content}>
        <nav className={style.nav}>
          <Link href="/">
            <h1 className={style.logo}>
              G3 Tarefas
              <span>+</span>
            </h1>
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