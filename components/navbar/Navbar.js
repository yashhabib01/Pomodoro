"use client";

import Link from "next/link";
import React from "react";
import styles from "./navbar.module.css";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

const links = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "Tasks",
    url: "/Tasks",
  },
  {
    id: 3,
    title: "Analysis",
    url: "/Analysis",
  },
];

const Navbar = ({ user }) => {
  const router = useRouter();

  const logout = () => {
    router.push("/api/auth/logout");
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        Pomodoro
      </Link>
      <div className={styles.links}>
        {links.map((link) => (
          <Link key={link.id} href={link.url} className={styles.link}>
            {link.title}
          </Link>
        ))}

        <button className={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;

export const getServerSideProps = withPageAuthRequired({
  //returnTo: '/foo',
  async getServerSideProps(ctx) {
    const session = getSession(ctx.req, ctx.res);
    //check the console of backend, you will get tokens here
    console.log(session);
    return {
      props: {
        customProp: "bar",
      },
    };
  },
});
