import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Container } from "./container";

import Image from "next/image";

export function About() {
  return (
    <>
      <div className="relative">
        <Container>
          <h3 className="text-2xl font-ginie text-center font-bold text-zinc-900 dark:text-white md:text-3xl lg:text-4xl">
            Why Git-Ginie ?
          </h3>

          <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              title="Very Efficient"
              icon={<BoxIcon />}
              description={
                <>
                  It is very efficient and quick in giving responses and
                  executing workflows.
                </>
              }
            />
            <Card
              title="Customization"
              icon={<LightBulbIcon />}
              description={
                <>
                  User can customize all issue/pr open/close comments and also
                  the custom labels.
                </>
              }
            />
            <Card
              title="Easier"
              icon={<ThumbsUpIcon />}
              description={
                <>
                  Any one with the simple knowledge of the github repo can use
                  the application and customize workflows.
                </>
              }
            />
          </div>
        </Container>
      </div>
    </>
  );
}

function GraphicWrapper({
  children,
  onClick,
}: {
  children: JSX.Element;
  onClick: () => void;
}) {
  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={10}
      glareEnable
      tiltAngleYInitial={0}
      glareMaxOpacity={0.1}
      className="fix-safari-tilt shadow-lg w-full
rounded-lg text-center bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-700 dark:via-zinc-800 dark:to-darker p-px"
    >
      <div className="absolute z-50 flex p-2 justify-end w-full">
        <button onClick={onClick} aria-label="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 absolute hover:animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 animate-ping text-purple-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
      {children}
    </Tilt>
  );
}

function Card({ title, description, icon }: any) {
  return (
    <Tilt
      tiltMaxAngleX={2.5}
      tiltMaxAngleY={5}
      glareEnable
      tiltAngleYInitial={0}
      glareMaxOpacity={0.1}
      className="fix-safari-tilt relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-200 to-white p-px dark:from-zinc-700 dark:via-zinc-800 dark:to-darker"
    >
      <div className="relative flex h-full flex-col gap-6 rounded-2xl bg-zinc-100 p-8 dark:bg-zinc-900">
        <div className="flex items-center justify-center">{icon}</div>

        <div>
          <h4 className="text-xl font-semibold text-zinc-900 dark:text-white">
            {title}
          </h4>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">{description}</p>
        </div>
      </div>
    </Tilt>
  );
}

function ThumbsUpIcon() {
  return (
    <>
      <img
        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Old%20Key.png"
        alt="Privacy"
        width={50}
        height={50}
        className="object-contain mx-auto "
      />
    </>
  );
}

function LightBulbIcon() {
  return (
    <>
      <img
        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Magic%20Wand.png"
        alt="Customization image"
        width={70}
        height={70}
        className="object-contain mx-auto "
      />
    </>
  );
}

function BoxIcon() {
  return (
    <>
      <img
        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Comet.png"
        alt="Resolution"
        width={70}
        height={70}
        className="object-contain mx-auto "
      />
    </>
  );
}
